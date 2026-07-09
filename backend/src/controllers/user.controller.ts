import { type Request, type Response } from "express";
import { clerkClient } from "@clerk/express";
import User from "../models/User";
import { RESOURCES, ACTIONS, type Resource, type Action } from "../constants/permissions";

// @desc    Danh sách user - đọc từ MongoDB (bản đồng bộ nhanh từ Clerk), có tìm kiếm + phân trang
// @route   GET /api/admin/users?search=&page=1&limit=20
// @access  Admin (quyền "read" trên resource "users")
export async function listUsers(req: Request, res: Response) {
  try {
    let { search, page = 1, limit = 20 } = req.query as any;
    page = parseInt(page, 10) || 1;
    limit = parseInt(limit, 10) || 20;

    const filter: Record<string, any> = {};
    if (search) {
      const regex = new RegExp(String(search).trim(), "i");
      filter.$or = [{ email: regex }, { firstName: regex }, { lastName: regex }];
    }

    const skip = (page - 1) * limit;

    const [totalItems, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        limit,
      },
      data: users,
    });
  } catch (error) {
    console.error("❌ Lỗi API listUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy danh sách user.",
    });
  }
}

// @desc    Đồng bộ TOÀN BỘ user hiện có bên Clerk vào MongoDB (backfill 1 lần).
//          Khác với webhook "user.created" (chỉ bắt user MỚI tạo sau này), API này
//          quét lại hết danh sách user đang có sẵn bên Clerk và upsert vào MongoDB -
//          dùng khi mới bật webhook, hoặc webhook bị lỡ mất vài user trước đó.
// @route   POST /api/admin/users/sync
// @access  Admin (quyền "update" trên resource "users")
export async function syncUsersFromClerk(req: Request, res: Response) {
  try {
    const limit = 100; // giới hạn tối đa mỗi lần gọi Clerk cho phép
    let offset = 0;
    let totalSynced = 0;
    let totalFromClerk = 0;

    // Lặp qua từng trang cho tới khi lấy hết user bên Clerk
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const { data: clerkUsers, totalCount } = await clerkClient.users.getUserList({
        limit,
        offset,
      });

      totalFromClerk = totalCount;
      if (clerkUsers.length === 0) break;

      // Upsert song song từng user trong trang hiện tại theo clerkId (giống logic createUser)
      await Promise.all(
        clerkUsers.map((clerkUser) =>
          User.findOneAndUpdate(
            { clerkId: clerkUser.id },
            {
              clerkId: clerkUser.id,
              email: clerkUser.emailAddresses?.[0]?.emailAddress ?? "",
              firstName: clerkUser.firstName ?? "",
              lastName: clerkUser.lastName ?? "",
              imageUrl: clerkUser.imageUrl ?? "",
            },
            { upsert: true, new: true, setDefaultsOnInsert: true },
          ),
        ),
      );

      totalSynced += clerkUsers.length;
      offset += limit;

      if (offset >= totalCount) break;
    }

    return res.status(200).json({
      success: true,
      message: `Đã đồng bộ ${totalSynced}/${totalFromClerk} user từ Clerk vào MongoDB.`,
      totalSynced,
      totalFromClerk,
    });
  } catch (error: any) {
    console.error("❌ Lỗi API syncUsersFromClerk:", error);
    return res.status(500).json({
      success: false,
      message: "Không thể đồng bộ user từ Clerk. Vui lòng thử lại.",
    });
  }
}

// @desc    Tạo user mới - tạo THẬT bên Clerk trước (nguồn xác thực gốc), rồi đồng bộ ngay vào MongoDB
// @route   POST /api/admin/users
// @access  Admin (quyền "create" trên resource "users")
export async function createUser(req: Request, res: Response) {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Thiếu email hoặc mật khẩu.",
      });
    }

    // 1. Tạo tài khoản THẬT bên Clerk trước
    const clerkUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
      firstName,
      lastName,
    });

    // 2. Đồng bộ ngay vào MongoDB, không đợi webhook, để admin thấy kết quả tức thì.
    //    Webhook user.created vẫn sẽ bắn về sau đó nhưng chỉ là xác nhận lại - upsert nên vô hại.
    const localUser = await User.findOneAndUpdate(
      { clerkId: clerkUser.id },
      {
        clerkId: clerkUser.id,
        email: clerkUser.emailAddresses?.[0]?.emailAddress ?? email,
        firstName: clerkUser.firstName ?? "",
        lastName: clerkUser.lastName ?? "",
        imageUrl: clerkUser.imageUrl ?? "",
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    return res.status(201).json({ success: true, data: localUser });
  } catch (error: any) {
    console.error("❌ Lỗi API createUser:", error);
    const clerkMessage = error?.errors?.[0]?.message;
    return res.status(400).json({
      success: false,
      message: clerkMessage || "Không thể tạo user. Vui lòng kiểm tra lại thông tin.",
    });
  }
}

// @desc    Sửa user - CHỈ hỗ trợ firstName/lastName.
//          Đổi email KHÔNG nằm trong scope này (Clerk yêu cầu luồng thêm + xác minh email riêng).
// @route   PATCH /api/admin/users/:id
// @access  Admin (quyền "update" trên resource "users")
export async function updateUser(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { firstName, lastName } = req.body;

    const localUser = await User.findById(id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user." });
    }

    const clerkUser = await clerkClient.users.updateUser(localUser.clerkId, {
      firstName,
      lastName,
    });

    localUser.firstName = clerkUser.firstName ?? "";
    localUser.lastName = clerkUser.lastName ?? "";
    await localUser.save();

    return res.status(200).json({ success: true, data: localUser });
  } catch (error: any) {
    console.error("❌ Lỗi API updateUser:", error);
    const clerkMessage = error?.errors?.[0]?.message;
    return res.status(400).json({
      success: false,
      message: clerkMessage || "Không thể cập nhật user.",
    });
  }
}

// @desc    Xóa user - xóa THẬT bên Clerk trước (tài khoản sẽ không đăng nhập được nữa),
//          rồi xóa khỏi MongoDB ngay để admin thấy kết quả tức thì.
// @route   DELETE /api/admin/users/:id
// @access  Admin (quyền "delete" trên resource "users")
export async function deleteUser(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const localUser = await User.findById(id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user." });
    }

    await clerkClient.users.deleteUser(localUser.clerkId);
    await User.deleteOne({ _id: id });

    return res.status(200).json({ success: true, message: "Đã xóa user." });
  } catch (error: any) {
    console.error("❌ Lỗi API deleteUser:", error);
    const clerkMessage = error?.errors?.[0]?.message;
    return res.status(400).json({
      success: false,
      message: clerkMessage || "Không thể xóa user.",
    });
  }
}

// @desc    Cập nhật ma trận quyền CRUD (theo từng resource) của 1 user
// @route   PATCH /api/admin/users/:id/permissions
// @access  Admin (quyền "update" trên resource "users")
export async function updateUserPermissions(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { permissions } = req.body as {
      permissions: Partial<Record<Resource, Partial<Record<Action, boolean>>>>;
    };

    if (!permissions || typeof permissions !== "object") {
      return res.status(400).json({ success: false, message: "Thiếu dữ liệu permissions." });
    }

    const localUser = await User.findById(id);
    if (!localUser) {
      return res.status(404).json({ success: false, message: "Không tìm thấy user." });
    }

    for (const [resource, actions] of Object.entries(permissions)) {
      // Bỏ qua resource lạ không nằm trong danh sách cho phép, tránh client tự chèn key rác
      if (!RESOURCES.includes(resource as Resource)) continue;

      const current = localUser.permissions.get(resource) || {
        create: false,
        read: false,
        update: false,
        delete: false,
      };

      const updated = { ...current };
      for (const action of ACTIONS) {
        if (typeof actions?.[action] === "boolean") {
          updated[action] = actions[action] as boolean;
        }
      }

      localUser.permissions.set(resource, updated);
    }

    await localUser.save();

    return res.status(200).json({ success: true, data: localUser });
  } catch (error) {
    console.error("❌ Lỗi API updateUserPermissions:", error);
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi cập nhật quyền.",
    });
  }
}