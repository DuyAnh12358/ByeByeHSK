import { type Request, type Response } from "express";
import ExamAttempt from "../models/ExamAttempt";

const clampLevel = (levelRaw: unknown): number | null => {
  const n = typeof levelRaw === "string" || typeof levelRaw === "number" ? Number(levelRaw) : NaN;
  if (Number.isNaN(n)) return null;
  if (n < 1 || n > 6) return null;
  return Math.trunc(n);
};

export async function getExamsStatsByLevel(req: Request, res: Response) {
  try {
    const level = clampLevel(req.query.level);
    if (!level) {
      return res.status(400).json({
        success: false,
        message: "level không hợp lệ. Phải là số giữa 1..6",
      });
    }

    // Frontend hiện đang có 3 đề (examNumber: 1..3)
    const examNumbers = [1, 2, 3];

    const attempts = await ExamAttempt.find({
      userId: "anonymous",
      hskLevel: level,
      examNumber: { $in: examNumbers },
    })
      .lean();

    const byExamNumber = new Map<number, { attemptsCount: number; bestScore: number; passed: boolean }>();
    for (const a of attempts) {
      byExamNumber.set(Number(a.examNumber), {
        attemptsCount: Number(a.attemptsCount ?? 0),
        bestScore: Number(a.bestScore ?? 0),
        passed: Boolean(a.passed ?? false),
      });
    }

    const data = examNumbers.map((examNumber) => {
      const found = byExamNumber.get(examNumber);
      return {
        level,
        examNumber,
        attemptsCount: found?.attemptsCount ?? 0,
        bestScore: found?.bestScore ?? 0,
        passed: found?.passed ?? false,
      };
    });

    return res.status(200).json({
      success: true,
      level,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi lấy stats đề thi.",
      error: (error as Error).message,
    });
  }
}

