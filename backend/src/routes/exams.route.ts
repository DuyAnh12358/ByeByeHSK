import { Router, type Request, type Response } from "express";
import { getExamsStatsByLevel } from "../controllers/exams.controller";

const router = Router();

router.get("/stats", getExamsStatsByLevel);

// Chỉ để tránh express route mismatch và dễ debug khi gọi sai URL
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default router;

