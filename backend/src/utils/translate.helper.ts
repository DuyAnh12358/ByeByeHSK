import Groq from "groq-sdk";
import Vocabulary from "../models/Vocabulary";

// Khởi tạo Groq Client với API Key lấy từ file .env
const apiKey = process.env.GROQ_API_KEY;
const groq = apiKey ? new Groq({ apiKey }) : null;

/**
 * Tự động kiểm tra và dịch gom cụm danh sách từ vựng từ EN sang VI bằng Groq API
 * @param vocabularies Mảng các document từ vựng lấy từ DB lên (.lean())
 * @returns Mảng từ vựng đã được cập nhật nghĩa tiếng Việt sạch chữ [EN]
 */
export async function translateBatchIfNeeded(vocabularies: any[]): Promise<any[]> {
  if (!vocabularies || vocabularies.length === 0) return vocabularies;

  // 1. Lọc ra danh sách các từ chưa dịch (có nghĩa bắt đầu bằng [EN])
  const pendingTranslations = vocabularies.filter(
    (vocab) => vocab.meaning_vi && vocab.meaning_vi.startsWith("[EN]"),
  );

  // Nếu tất cả các từ trong trang này đã được dịch rồi thì trả về luôn
  if (pendingTranslations.length === 0) {
    return vocabularies;
  }

  // Kiểm tra an toàn xem cấu hình API Key đã sẵn sàng chưa
  if (!groq) {
    console.error("❌ [Groq Error]: GROQ_API_KEY chưa được cấu hình trong file .env!");
    return vocabularies;
  }

  console.log(
    `🤖 Phát hiện ${pendingTranslations.length}/${vocabularies.length} từ chưa dịch. Đang gom cụm dịch qua Groq (${pendingTranslations.length} từ)...`,
  );

  try {
    // 2. Trích xuất mảng văn bản tiếng Anh thô (Xóa chữ "[EN] ")
    const englishTexts = pendingTranslations.map((vocab) =>
      vocab.meaning_vi.replace("[EN] ", "").trim(),
    );

    const prompt = `
      Bạn là một dịch giả từ điển Trung-Anh-Việt chuyên nghiệp. 
      Hãy dịch mảng các định nghĩa tiếng Anh sau đây sang tiếng Việt.
      Yêu cầu: Dịch ngắn gọn, sát nghĩa từ điển, giữ nguyên các dấu phân cách như dấu chấm phẩy nếu có.
      
      Dữ liệu đầu vào: ${JSON.stringify(englishTexts)}
      
      Hãy trả về một JSON Object chứa duy nhất một trường dữ liệu tên là "translations", giá trị là mảng các chuỗi đã dịch theo đúng thứ tự phần tử đầu vào. Ví dụ định dạng:
      {
        "translations": ["nghĩa một", "nghĩa hai"]
      }
    `;

    // 3. Gọi Groq API theo đúng các tham số bạn đã cung cấp
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
      max_tokens: 1024, // SDK Groq chuẩn cho Node/Bun sử dụng thuộc tính max_tokens
      top_p: 1,
      // Kích hoạt JSON Mode của Groq để đảm bảo phản hồi trả về là JSON Object chuẩn
      response_format: { type: "json_object" },
      // Bổ sung các cấu hình mở rộng (compound_custom) như đoạn mã mẫu của bạn
      ...({
        compound_custom: {
          tools: {
            enabled_tools: ["web_search", "code_interpreter", "visit_website"],
          },
        },
      } as any),
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new Error("Không nhận được nội dung phản hồi từ Groq API.");
    }

    // 4. Giải mã chuỗi JSON thu được
    const parsedData = JSON.parse(responseText);
    const translatedTexts = parsedData.translations;

    if (Array.isArray(translatedTexts) && translatedTexts.length === pendingTranslations.length) {
      // 5. Đồng bộ song song: Cập nhật mảng đang chạy và lưu ngầm vào MongoDB cùng lúc
      const dbUpdates = pendingTranslations.map(async (vocab, index) => {
        const translatedText = translatedTexts[index]?.trim() || "";
        
        if (translatedText) {
          // Ghi đè trực tiếp lên object trong bộ nhớ để trả ra client ngay lập tức
          vocab.meaning_vi = translatedText;

          // Lưu vĩnh viễn vào MongoDB để tối ưu cho các lượt truy cập sau
          return Vocabulary.updateOne(
            { _id: vocab._id },
            { $set: { meaning_vi: translatedText } },
          );
        }
      });

      // Kích hoạt toàn bộ tiến trình ghi xuống DB chạy đồng thời
      await Promise.all(dbUpdates);
      console.log(`✅ Đã đồng bộ dịch thành công ${pendingTranslations.length} từ vựng bằng Groq.`);
    } else {
      console.error("❌ [Groq Error]: Cấu trúc mảng trả về từ Groq không khớp số lượng phần tử.");
    }

  } catch (error: any) {
    console.error("❌ [Groq Error]: Đã xảy ra lỗi khi xử lý dịch thuật:", error.message);
    // Giữ nguyên tiền tố [EN] nếu lỗi để hệ thống có thể thử lại ở lượt truy cập sau
  }

  return vocabularies;
}