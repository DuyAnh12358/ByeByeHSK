import mongoose from "mongoose";
import Vocabulary from "./models/Vocabulary"; // Đường dẫn tới file Schema Vocabulary của bạn

// Hàm phân tích và gán nhãn HSK từ mảng level của file JSON
function determineHskLevel(levels: string[]): string {
  if (!levels || !Array.isArray(levels)) return "Custom";

  // Thứ tự ưu tiên hệ thống nhãn: newest (HSK 3.0 mới) -> new (HSK 2012) -> old (HSK cũ)
  const prefixes = ["newest-", "new-", "old-"];
  
  for (const prefix of prefixes) {
    const found = levels.find((l) => l.startsWith(prefix));
    if (found) {
      const levelNum = parseInt(found.replace(prefix, ""), 10);
      // Giới hạn trong khoảng HSK1 - HSK6 theo thiết kế Enum của Schema
      if (levelNum >= 1 && levelNum <= 6) {
        return `HSK${levelNum}`;
      }
    }
  }

  // Phương án dự phòng: Tìm bất kỳ số nào từ 1 đến 6 xuất hiện trong mảng level
  for (const l of levels) {
    const match = l.match(/[1-6]/);
    if (match) {
      return `HSK${match[0]}`;
    }
  }

  return "Custom";
}

async function importCompleteJson() {
  try {
    const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/your_db";
    // Mặc định điền một lesson_id khởi tạo bắt buộc theo Schema thiết kế
    const DEFAULT_LESSON_ID = process.env.LESSON_ID || "667fe123456789abcdef0123"; 

    await mongoose.connect(MONGO_URI);
    console.log("🔋 Đã kết nối thành công tới MongoDB.");

    console.log("⏳ Đang nạp dữ liệu từ file complete.json vào bộ nhớ...");
    const file = Bun.file("complete.json");
    const rawData = await file.json();

    if (!Array.isArray(rawData)) {
      console.error("❌ Định dạng file JSON không hợp lệ (Phải là một mảng Object).");
      process.exit(1);
    }

    console.log(`🚀 Phát hiện ${rawData.length} gốc từ. Bắt đầu tiền xử lý và đồng bộ...`);

    const batchSize = 1000;
    let bulkOps: any[] = [];
    let totalProcessedRecords = 0;

    for (let i = 0; i < rawData.length; i++) {
      const item = rawData[i];

      if (!item.simplified || !item.forms || !Array.isArray(item.forms)) {
        continue;
      }

      // Xác định cấp độ HSK chung cho từ này
      const currentLevel = determineHskLevel(item.level);

      // Duyệt qua tất cả các form âm đọc/biến thể ngữ nghĩa của chữ đó
      for (const form of item.forms) {
        const rawPinyin = form.transcriptions?.numeric || "";
        
        // Tạo pinyin không dấu và chuyển sang chữ thường (ví dụ: "ai1 ya1" -> "ai ya")
        const pinyinUnsigned = rawPinyin.replace(/[0-9]/g, "").toLowerCase().trim();
        
        // Gộp mảng các tầng ý nghĩa tiếng Anh lại với nhau ngăn cách bởi dấu chấm phẩy
        const meaningsArr = form.meanings || [];
        const meaningVi = meaningsArr.length > 0 ? `[EN] ${meaningsArr.join("; ")}` : "";

        // Tạo Document chuẩn hóa theo đúng cấu trúc Schema DB của bạn
        const vocabDoc = {
          simplified: item.simplified,
          traditional: form.traditional || item.simplified,
          pinyin: rawPinyin,
          pinyin_unsigned: pinyinUnsigned,
          han_viet: "ĐANG_CẬP_NHẬT", // Giữ nguyên flag để chạy tool dịch Hán Việt sau này
          meaning_vi: meaningVi,
          audio_url: "",
          lesson_id: new mongoose.Types.ObjectId(DEFAULT_LESSON_ID),
          level: currentLevel,
          stroke_data: "",
          examples: []
        };

        // Sử dụng updateOne kết hợp upsert dựa trên cặp (chữ giản thể + phiên âm) để chống trùng
        bulkOps.push({
          updateOne: {
            filter: { simplified: vocabDoc.simplified, pinyin: vocabDoc.pinyin },
            update: { $set: vocabDoc },
            upsert: true
          }
        });

        // Đẩy lệnh theo cụm (Batch Write) tối ưu hiệu năng kết nối mạng và RAM
        if (bulkOps.length >= batchSize) {
          const result = await Vocabulary.bulkWrite(bulkOps);
          totalProcessedRecords += bulkOps.length;
          console.log(`⏳ Đã đồng bộ thành công ${totalProcessedRecords} bản ghi từ vựng...`);
          bulkOps = [];
        }
      }
    }

    // Xử lý nốt các bản ghi còn sót lại ở cuối mảng
    if (bulkOps.length > 0) {
      await Vocabulary.bulkWrite(bulkOps);
      totalProcessedRecords += bulkOps.length;
    }

    console.log(`🎉 Tiến trình hoàn tất! Tổng cộng ${totalProcessedRecords} bản ghi từ vựng đã được cập nhật/thêm mới vào cơ sở dữ liệu.`);
    await mongoose.disconnect();
    process.exit(0);

  } catch (error) {
    console.error("❌ Lỗi nghiêm trọng xảy ra trong quá trình Import:", error);
    process.exit(1);
  }
}

importCompleteJson();