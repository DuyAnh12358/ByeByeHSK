// middlewares/requirePermission.ts
// Middleware factory - kiểm tra user đăng nhập có quyền [action] trên [resource] hay không.
// Dùng: router.delete("/:id", requirePermission("users", "delete"), deleteUser)
//
// ⚠️ Thay thế cho requireAdmin.ts cũ (kiểm tra role nhị phân) - có thể xóa file đó đi.

import { type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import User from "../models/User";
import { type Resource, type Action } from "../constants/permissions";

export default function requirePermission(resource: Resource, action: Action) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { userId } = getAuth(req);

      if (!userId) {
        return res.status(401).json({ success: false, message: "Chưa đăng nhập." });
      }

      const localUser = await User.findOne({ clerkId: userId });

      if (!localUser) {
        return res.status(403).json({
          success: false,
          message: "Tài khoản chưa được đồng bộ, thử lại sau ít phút.",
        });
      }

      // Superadmin bỏ qua toàn bộ check, luôn full quyền
      if (localUser.isSuperAdmin) {
        return next();
      }

      const resourcePermission = localUser.permissions?.get(resource);

      if (!resourcePermission || !resourcePermission[action]) {
        return res.status(403).json({
          success: false,
          message: `Bạn không có quyền "${action}" trên "${resource}".`,
        });
      }

      next();
    } catch (error) {
      console.error("❌ Lỗi requirePermission:", error);
      return res
        .status(500)
        .json({ success: false, message: "Lỗi kiểm tra quyền truy cập." });
    }
  };
}