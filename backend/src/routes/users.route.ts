import express from "express";
import requirePermission from "../middlewares/requirePermission";
import {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  updateUserPermissions,
} from "../controllers/user.controller";

const router = express.Router();

router.get("/", requirePermission("users", "read"), listUsers);
router.post("/", requirePermission("users", "create"), createUser);
router.patch("/:id", requirePermission("users", "update"), updateUser);
router.delete("/:id", requirePermission("users", "delete"), deleteUser);

// Sửa ma trận quyền của 1 user - cũng yêu cầu quyền "update" trên resource "users"
router.patch(
  "/:id/permissions",
  requirePermission("users", "update"),
  updateUserPermissions,
);

export default router;