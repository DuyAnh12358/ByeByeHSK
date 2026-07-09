import { useEffect, useRef, useState } from "react";

export function useAudioPlayer() {
  const audioRef = useRef(null);
  const objectUrlRef = useRef(null);
  const audioContextRef = useRef(null);
  const speechUtteranceRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    return () => {
      try {
        audioRef.current?.pause?.();
      } catch {
        // ignore
      }
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      audioRef.current = null;
      objectUrlRef.current = null;
    };
  }, []);

  const playToneFallback = (durationMs = 700, frequency = 880) => {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextCtor) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextCtor();
    }

    const ctx = audioContextRef.current;
    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start();
    oscillator.stop(ctx.currentTime + durationMs / 1000 + 0.02);
  };

  const speakText = (text, lang = "zh-CN") => {
    if (!text || typeof window === "undefined") return;

    const synth = window.speechSynthesis;
    if (!synth) return;

    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    speechUtteranceRef.current = utterance;
    utterance.lang = lang;
    utterance.rate = 0.95;
    utterance.pitch = 1;
    utterance.volume = 1;

    const voices = synth.getVoices();
    const preferredVoice = voices.find((voice) => voice.lang?.toLowerCase().startsWith(lang.toLowerCase())) || voices.find((voice) => voice.lang?.toLowerCase().includes("zh"));
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onend = () => {
      setIsPlaying(false);
      speechUtteranceRef.current = null;
    };
    utterance.onerror = () => {
      setIsPlaying(false);
      speechUtteranceRef.current = null;
    };

    setIsPlaying(true);
    synth.speak(utterance);
  };

  const play = async (src, options = {}) => {
    if (!src) {
      if (options.text) {
        speakText(options.text, options.lang);
      }
      return;
    }

    // Đảm bảo fallback (tone/TTS trình duyệt) chỉ được kích hoạt đúng 1 lần cho mỗi
    // lượt play(), dù nó có thể được gọi từ catch (lỗi fetch) hoặc từ audio.onerror
    // (lỗi decode/phát 1 file đã fetch thành công nhưng bị hỏng/rỗng).
    let fallbackTriggered = false;
    const triggerFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      if (options.text) {
        speakText(options.text, options.lang);
      } else {
        playToneFallback();
      }
    };

    try {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }

      const response = await fetch(src, { cache: "no-store" });
      if (!response.ok) {
        throw new Error(`Audio fetch failed with status ${response.status}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], {
        type: response.headers.get("content-type") || "audio/wav",
      });
      const objectUrl = URL.createObjectURL(blob);
      objectUrlRef.current = objectUrl;

      const audio = new Audio(objectUrl);
      audioRef.current = audio;
      audio.preload = "auto";
      setIsPlaying(true);

      audio.onended = () => {
        setIsPlaying(false);
        if (objectUrlRef.current === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrlRef.current = null;
        }
      };

      // Trước đây onerror chỉ dọn state chứ không fallback, nên nếu server trả về
      // 200 OK kèm 1 file audio bị hỏng/rỗng (ví dụ cache cũ), audio sẽ lỗi decode
      // trong im lặng: không tiếng bíp, không giọng đọc, không log gì cả.
      audio.onerror = () => {
        setIsPlaying(false);
        if (objectUrlRef.current === objectUrl) {
          URL.revokeObjectURL(objectUrl);
          objectUrlRef.current = null;
        }
        triggerFallback();
      };

      await audio.play();
    } catch (err) {
      triggerFallback();
      setIsPlaying(false);
    }
  };

  const stop = () => {
    try {
      audioRef.current?.pause?.();
      audioRef.current = null;
    } catch {
      // ignore
    }

    if (typeof window !== "undefined") {
      window.speechSynthesis?.cancel();
    }

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setIsPlaying(false);
  };

  return { play, stop, isPlaying };
}