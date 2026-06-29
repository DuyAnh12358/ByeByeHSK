import { translate } from "@vitalets/google-translate-api";
import Vocabulary from "../models/Vocabulary";

/**
 * Hàm tự động kiểm tra và dịch một danh sách từ vựng từ EN sang VI
 * @param {Array} vocabularies - Mảng các document từ vựng từ DB (.lean() hoặc mongoose doc)
 * @returns {Promise<Array>} - Mảng từ vựng đã được dịch sạch chữ [EN]
 */
export default async function translateBatchIfNeeded(
  vocabularies: Array<any>,
): Promise<Array<any>> {
  if (!vocabularies || vocabularies.length === 0) return vocabularies;

  // 1. Lọc ra danh sách các từ cần dịch (có nghĩa bắt đầu bằng [EN])
  const pendingTranslations = vocabularies.filter(
    (vocab) => vocab.meaning_vi && vocab.meaning_vi.startsWith("[EN]"),
  );

  // Nếu tất cả các từ trong trang này đã được dịch rồi thì trả về luôn, không tốn thời gian gọi API Google
  if (pendingTranslations.length === 0) {
    return vocabularies;
  }

  console.log(
    `⏳ Phát hiện ${pendingTranslations.length}/${vocabularies.length} từ chưa dịch trong trang này. Đang dịch on-the-fly...`,
  );

  // 2. Tạo danh sách các Promise dịch song song cho cụm từ này (thường là 20 từ nên rất nhanh)
  const translationPromises = pendingTranslations.map(async (vocab) => {
    try {
      // Bóc tách chuỗi tiếng Anh sạch
      const englishText = vocab.meaning_vi.replace("[EN] ", "").trim();

      // Gọi Google dịch sang tiếng Việt
      const res = await translate(englishText, { from: "en", to: "vi" });
      const translatedText = res.text;

      // Cập nhật trực tiếp vào object hiện tại để trả về cho Frontend luôn
      vocab.meaning_vi = translatedText;

      // Cập nhật ngầm vào Database để lần sau truy cập không phải dịch lại nữa
      await Vocabulary.updateOne(
        { _id: vocab._id },
        { $set: { meaning_vi: translatedText } },
      );
    } catch (error) {
      console.error(
        `❌ Lỗi dịch từ tại chỗ cho từ "${vocab.simplified}":`,
        error.message,
      );
      // Nếu lỗi (ví dụ nghẽn mạng), giữ nguyên nghĩa cũ để app không bị crash
    }
  });

  // Chờ tất cả các từ trong cụm này dịch xong
  await Promise.all(translationPromises);

  return vocabularies;
}
