// controllers/auth.controller.ts
// Đồng bộ tài khoản đang đăng nhập (qua Clerk) vào MongoDB.
// Cách này thay thế cho webhook: KHÔNG cần Clerk chủ động gọi vào backend,
// mà chính FRONTEND chủ động gọi API này ngay sau khi user đăng nhập/đăng ký
// thành công (đính kèm session token của Clerk ở header Authorization).
//
// Đánh đổi so với webhook: đơn giản, không cần ngrok/signing secret lúc dev,
// nhưng sẽ có những trường hợp KHÔNG được đồng bộ tự động, ví dụ:
// - User xóa tài khoản trực tiếp qua Clerk (không có event nào báo về đây để xóa
//   record Mongo tương ứng - cần dọn thủ công nếu gặp).
// - Admin sửa thông tin user trực tiếp trong Clerk Dashboard (chỉ cập nhật lại
//   khi user đó gọi /sync ở lần đăng nhập kế tiếp).

import { type Request, type Response } from "express";
import { getAuth, clerkClient } from "@clerk/express";
import User from "../models/User";

// @desc    Đồng bộ thông tin user hiện tại (theo token Clerk) vào MongoDB.
//          Gọi ngay sau khi frontend đăng nhập/đăng ký thành công qua Clerk.
// @route   POST /api/auth/sync
// @access  Yêu cầu đã đăng nhập (Clerk session token hợp lệ ở header Authorization)
export async function syncUser(req: Request, res: Response) {
  try {
    // getAuth() đọc + verify token từ request nhờ clerkMiddleware() đã áp dụng
    // toàn cục ở index.ts - không cần tự tay parse header/verify JWT thủ công nữa.
    const { userId, isAuthenticated } = getAuth(req);

    // 🔍 Log tạm thời để xác định chính xác bước nào đang lỗi - xóa đi khi đã chạy ổn.
    console.log("[syncUser] isAuthenticated:", isAuthenticated, "| userId:", userId);

    if (!isAuthenticated || !userId) {
      return res.status(401).json({
        success: false,
        message: "Chưa đăng nhập hoặc token không hợp lệ.",
      });
    }

    // Session token của Clerk thường KHÔNG có sẵn email/tên/avatar trong claims
    // (trừ khi tự cấu hình custom claims) - nên gọi thẳng Backend API để lấy
    // đầy đủ + đáng tin cậy hơn là đọc từ token.
    const clerkUser = await clerkClient.users.getUser(userId);

    // 🔍 Log tạm thời - xóa đi khi đã chạy ổn.
    console.log("[syncUser] clerkUser email:", clerkUser.emailAddresses?.[0]?.emailAddress);

    const localUser = await User.findOneAndUpdate(
      { clerkId: userId },
      {
        clerkId: userId,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        imageUrl: clerkUser.imageUrl ?? "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    // 🔍 Log tạm thời - xóa đi khi đã chạy ổn.
    console.log("[syncUser] đã lưu vào Mongo, _id:", localUser?._id);

    return res.status(200).json({ success: true, data: localUser });
  } catch (error) {
    console.error("❌ Lỗi API syncUser:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể đồng bộ tài khoản. Vui lòng thử lại.",
    });
  }
}