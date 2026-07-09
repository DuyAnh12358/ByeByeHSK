// models/User.ts
// User được đồng bộ (sync) từ Clerk qua Webhook, lưu thêm vào MongoDB để dễ liên kết
// với dữ liệu app-specific và lưu ma trận phân quyền CRUD theo từng resource.

import { Schema, model } from "mongoose";

const crudPermissionSchema = new Schema(
  {
    create: { type: Boolean, default: false },
    read: { type: Boolean, default: false },
    update: { type: Boolean, default: false },
    delete: { type: Boolean, default: false },
  },
  { _id: false },
);

const userSchema = new Schema(
  {
    // ID user bên Clerk - dùng để đối chiếu 2 chiều, KHÔNG tự sinh ObjectId trùng vai trò này
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    imageUrl: { type: String, default: "" },

    // Superadmin luôn full quyền mọi resource, dùng để bootstrap tài khoản admin đầu tiên.
    // KHÔNG expose qua API - chỉ set trực tiếp trong DB, tránh lỗi tự leo thang quyền qua UI.
    isSuperAdmin: { type: Boolean, default: false },

    // Ma trận quyền: resource ("vocabulary", "quizzes", "users"...) -> { create, read, update, delete }
    // Mặc định user mới KHÔNG có quyền gì (deny-by-default), admin phải chủ động cấp qua UI.
    permissions: {
      type: Map,
      of: crudPermissionSchema,
      default: {},
    },
  },
  { timestamps: true },
);

export default model("User", userSchema);