import { type Request, type Response } from "express";
import Vocabulary from "../models/Vocabulary";
import translateBatchIfNeeded from "../utils/translate.helper";

// @desc    Duyệt danh sách từ vựng theo Cấp độ (HSK1-HSK6 hoặc Custom)
// @route   GET /api/vocabularies/level/:level
// @access  Public
export default async function getVocabulariesByLevel(
  req: Request,
  res: Response,
) {
  try {
    // 1. Lấy level từ thông số URL (params)
    const { level } = req.params;

    // Lấy thông số phân trang từ query string (mặc định trang 1, mỗi trang 20 từ)
    let { page = 1, limit = 20 } = req.query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);

    if (page < 1) page = 1;
    if (limit < 1) limit = 20;

    // 2. Kiểm tra tính hợp lệ của Level theo thiết kế DB Enum
    const validLevels = [
      "HSK1",
      "HSK2",
      "HSK3",
      "HSK4",
      "HSK5",
      "HSK6",
      "Custom",
    ];

    // Chuẩn hóa chữ (ví dụ người dùng nhập hsk1 hoặc custom chữ thường thì tự biến thành viết hoa)
    const formattedLevel =
      level.toUpperCase() === "CUSTOM" ? "Custom" : level.toUpperCase();

    if (!validLevels.includes(formattedLevel)) {
      return res.status(400).json({
        success: false,
        message:
          "Cấp độ (Level) không hợp lệ. Phải thuộc: HSK1 -> HSK6 hoặc Custom.",
      });
    }

    // 3. Tạo bộ lọc theo đúng level đã chọn
    const filter = { level: formattedLevel };

    // Tính toán số lượng bản ghi bỏ qua (skip) cho phân trang
    const skip = (page - 1) * limit;

    // 4. Truy vấn DB song song để lấy tổng số từ và danh sách từ của trang hiện tại
    const [totalItems, rawVocabularies] = await Promise.all([
      Vocabulary.countDocuments(filter),
      Vocabulary.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ simplified: 1 }) // Sắp xếp theo thứ tự bảng chữ cái chữ Giản thể
        .lean(), // Bỏ bớt hàm thừa của Mongoose để tăng tốc độ phản hồi JSON
    ]);

    const vocabularies = await translateBatchIfNeeded(rawVocabularies);

    // 5. Tính toán tổng số trang
    const totalPages = Math.ceil(totalItems / limit);

    // 6. Trả kết quả về cho Frontend
    return res.status(200).json({
      success: true,
      level: formattedLevel,
      count: vocabularies.length,
      pagination: {
        totalItems,
        totalPages,
        currentPage: page,
        limit,
      },
      data: vocabularies,
    });
  } catch (error) {
    console.error("❌ Lỗi API getVocabulariesByLevel:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống khi duyệt từ vựng theo cấp độ.",
    });
  }
}
