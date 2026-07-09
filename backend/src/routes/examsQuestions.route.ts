import { Router, type Request, type Response } from "express";
import { getExamQuestions, getExamQuestionsBySkill } from "../controllers/examsQuestions.controller";

const router = Router();

// Get questions for an exam (reading + writing) built from Vocabulary in DB
// GET /api/exams/questions/:level/:examNumber
router.get("/questions/:level/:examNumber", getExamQuestions);

// Get questions for a single skill using vocabulary from DB
// GET /api/exams/questions/:level/:examNumber/skill/:skill
router.get("/questions/:level/:examNumber/skill/:skill", getExamQuestionsBySkill);

// Debug
router.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

export default router;

