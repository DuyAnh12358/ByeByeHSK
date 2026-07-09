// constants/permissions.ts
// Danh sách "resource" (bảng dữ liệu) và "action" (CRUD) mà hệ thống phân quyền hỗ trợ.
// Thêm resource mới ở đây khi có thêm tính năng admin cần quản lý/phân quyền riêng.

export const RESOURCES = ["vocabulary", "exams", "users"] as const;
export type Resource = (typeof RESOURCES)[number];

export const ACTIONS = ["create", "read", "update", "delete"] as const;
export type Action = (typeof ACTIONS)[number];

export type CrudPermission = Record<Action, boolean>;
export type PermissionMap = Partial<Record<Resource, CrudPermission>>;