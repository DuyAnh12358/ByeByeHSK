import { type Request, type Response } from "express";
import Vocabulary from "../models/Vocabulary";
import { EdgeTTS } from "edge-tts-universal"; // ✅ Chuyển từ @andresaya/edge-tts (đã lỗi thời) sang edge-tts-universal (cập nhật đúng cơ chế xác thực mới nhất của Microsoft: Chromium 143 + cookie MUID)
import path from "path";
import fs from "fs";

// Ngưỡng tối thiểu (byte) để coi 1 file cache là hợp lệ.
// File mp3/wav thật (kể cả tone fallback ~35KB) luôn lớn hơn ngưỡng này rất nhiều.
// Nếu file tồn tại nhưng nhỏ hơn ngưỡng -> coi là file rác/hỏng (do EdgeTTS ghi dở khi kết nối lỗi) và xóa để tạo lại.
const MIN_VALID_AUDIO_BYTES = 512;

function isValidAudioFile(filePath: string) {
  try {
    const stats = fs.statSync(filePath);
    return stats.isFile() && stats.size > MIN_VALID_AUDIO_BYTES;
  } catch {
    return false;
  }
}

function removeIfExists(filePath: string) {
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch {
    // ignore
  }
}

function createToneWavBuffer(durationMs = 800, sampleRate = 22050, frequency = 880) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const sampleCount = Math.floor((durationMs / 1000) * sampleRate);
  const dataSize = sampleCount * blockAlign;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * blockAlign, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < sampleCount; i += 1) {
    const t = i / sampleRate;
    const amplitude = 0.25 * 32767 * Math.sin(2 * Math.PI * frequency * t);
    buffer.writeInt16LE(Math.round(amplitude), 44 + i * blockAlign);
  }

  return buffer;
}

/**
 * @desc    Stream hoặc sinh trực tiếp file phát âm TTS cho từ vựng theo ID
 * @route   GET /api/vocabularies/audio/:id
 * @access  Public
 */
export async function getVocabularyAudio(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // 1. Tìm từ vựng trong DB để lấy chữ Giản thể (simplified) cần đọc
    const vocab = await Vocabulary.findById(id).lean();
    if (!vocab) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy từ vựng để tạo âm thanh.",
      });
    }

    // 2. Thiết lập thư mục lưu trữ cache audio
    const cacheDir = path.join(process.cwd(), "public", "audio_cache");
    if (!fs.existsSync(cacheDir)) {
      fs.mkdirSync(cacheDir, { recursive: true });
    }

    const audioFilePath = path.join(cacheDir, `${id}.mp3`);
    const fallbackAudioPath = audioFilePath.replace(/\.mp3$/, ".wav");

    // 3. Nếu file audio đã tồn tại VÀ hợp lệ (không rỗng/hỏng) -> Trả về luôn (Cache Hit)
    // Trước đây chỉ check existsSync, nên nếu 1 file .mp3 bị ghi dở/rỗng do EdgeTTS
    // lỗi giữa chừng (mất kết nối websocket) thì nó sẽ được coi là "cache hit" mãi mãi
    // và trả về client 1 file audio hỏng -> im lặng không phát được gì, không có log,
    // và fallback tone cũng không bao giờ được tạo/dùng lại cho từ đó nữa.
    if (fs.existsSync(audioFilePath)) {
      if (isValidAudioFile(audioFilePath)) {
        return res.sendFile(audioFilePath);
      }
      removeIfExists(audioFilePath);
    }
    if (fs.existsSync(fallbackAudioPath)) {
      if (isValidAudioFile(fallbackAudioPath)) {
        return res.sendFile(fallbackAudioPath);
      }
      removeIfExists(fallbackAudioPath);
    }

    console.log(`🔊 Đang tạo TTS cho từ: ${vocab.simplified} (${vocab.pinyin})`);

    try {
      // 4-5. Khởi tạo và sinh âm thanh bằng API mới của edge-tts-universal
      // (thư viện cũ @andresaya/edge-tts dùng new EdgeTTS() rồi .synthesize(text, voice, opts) + .toFile(path);
      //  thư viện mới dùng new EdgeTTS(text, voice, opts) rồi .synthesize() trả về { audio, subtitle })
      const tts = new EdgeTTS(vocab.simplified, "zh-CN-XiaoxiaoNeural");
      const result = await tts.synthesize();
      const audioBuffer = Buffer.from(await result.audio.arrayBuffer());
      await fs.promises.writeFile(audioFilePath, audioBuffer);
    } catch (ttsError: any) {
      const message = ttsError?.message || String(ttsError || "unknown");
      console.warn("⚠️ Edge TTS unavailable, using fallback audio:", message);
      // Dọn file .mp3 mà thư viện EdgeTTS có thể đã tạo/ghi dở trước khi kết nối lỗi,
      // tránh để lại rác khiến lần gọi sau đọc nhầm file hỏng này (xem isValidAudioFile ở trên).
      removeIfExists(audioFilePath);
      const fallbackBuffer = createToneWavBuffer();
      fs.writeFileSync(fallbackAudioPath, fallbackBuffer);
      return res.sendFile(fallbackAudioPath);
    }

    // 6. Trả file audio vừa tạo về cho client phát âm thanh
    return res.sendFile(audioFilePath);

  } catch (error: any) {
    console.error("❌ Lỗi hệ thống khi xử lý Edge TTS:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể tạo file phát âm vào lúc này.",
    });
  }
}