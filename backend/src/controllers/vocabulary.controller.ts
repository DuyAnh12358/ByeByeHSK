import { type Request, type Response } from "express";
import Vocabulary from "../models/Vocabulary";
import { translateBatchIfNeeded } from "../utils/translate.helper";


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

export async function searchVocabulary(req: Request, res: Response) {
  try {
    const { q } = req.query;
    let { page = 1, limit = 20 } = req.query as any;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 20;
 
    const keyword = typeof q === "string" ? q.trim() : "";
 
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Vui lòng nhập từ khóa tìm kiếm (query param 'q').",
      });
    }
 
    // Escape ký tự đặc biệt của regex để tránh lỗi/khai thác khi user gõ ký tự lạ (., *, (, ...)
    const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const searchRegex = new RegExp(escapedKeyword, "i");
 
    // Tìm khớp ở nhiều field cùng lúc: gõ chữ Hán, pinyin (có dấu hoặc không), Hán Việt, hoặc nghĩa đều ra kết quả
    const filter = {
      $or: [
        { simplified: searchRegex },
        { traditional: searchRegex },
        { pinyin: searchRegex },
        { pinyin_unsigned: searchRegex },
        { han_viet: searchRegex },
        { meaning_vi: searchRegex },
      ],
    };
 
    const skip = (page - 1) * limit;
 
    const [totalItems, rawVocabularies] = await Promise.all([
      Vocabulary.countDocuments(filter),
      Vocabulary.find(filter)
        .skip(skip)
        .limit(limit)
        .sort({ simplified: 1 })
        .lean(),
    ]);
 
    const vocabularies = await translateBatchIfNeeded(rawVocabularies);
 
    return res.status(200).json({
      success: true,
      keyword,
      count: vocabularies.length,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
      data: vocabularies,
    });
  } catch (error) {
    console.error("❌ Lỗi API searchVocabulary:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống khi tìm kiếm từ vựng.",
    });
  }
}