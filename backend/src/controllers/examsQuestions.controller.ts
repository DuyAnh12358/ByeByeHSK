import { type Request, type Response } from "express";
import Vocabulary from "../models/Vocabulary";

const clampLevel = (levelRaw: unknown): number | null => {
  const n = typeof levelRaw === "string" || typeof levelRaw === "number" ? Number(levelRaw) : NaN;
  if (Number.isNaN(n)) return null;
  if (n < 1 || n > 6) return null;
  return Math.trunc(n);
};

const clampExamNumber = (examNumberRaw: unknown): number | null => {
  const n = typeof examNumberRaw === "string" || typeof examNumberRaw === "number" ? Number(examNumberRaw) : NaN;
  if (Number.isNaN(n)) return null;
  if (n < 1 || n > 3) return null;
  return Math.trunc(n);
};

const mapHskToLevel = (hskLevel: number) => {
  // Vocabulary.level enum: 'HSK1'..'HSK6'
  return `HSK${hskLevel}`;
};

const shuffle = <T,>(arr: T[]) => {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
};

const createSeededRandom = (seed: number) => {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0x100000000;
  };
};

const seededShuffle = <T,>(arr: T[], seed: number) => {
  const a = arr.slice();
  const random = createSeededRandom(seed);
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const tmp = a[i];
    a[i] = a[j];
    a[j] = tmp;
  }
  return a;
};


/**
 * Build reading MCQ: choose the correct VI meaning for a given word.
 * We use Vocabulary meanings as the source.
 */
function buildReadingMCQ(params: {
  level: number;
  examNumber: number;
  vocabPool: Array<{ pinyin: string; meaning_vi: string }>;
  distractors: Array<string>;
}) {
  const { vocabPool, distractors } = params;

  // Take first N as stems, then shuffle
  const stems = vocabPool.slice(0, 6);

  return stems.map((v, idx) => {
    const correct = v.meaning_vi;
    const optionsSet = new Set<string>();
    optionsSet.add(correct);

    const distractList = shuffle(distractors);
    for (const d of distractList) {
      if (optionsSet.size >= 4) break;
      if (d && d !== correct) optionsSet.add(d);
    }

    const options = shuffle(Array.from(optionsSet)).slice(0, 4);
    const correctIndex = options.indexOf(correct);
    const correctKey = "ABCD"[correctIndex] || "A";

    return {
      id: `reading-${params.level}-${params.examNumber}-${idx + 1}`,
      skill: "reading",
      type: "mcq",
      prompt: `Chọn nghĩa đúng của: ${v.pinyin}`,
      options: options.map((label, i) => ({
        key: `${label}-${i}`,
        label,
      })),
      correct: correctKey,
    };
  });
}

/**
 * Build writing demo: simple prompt with word bank and accept free text.
 * Demo UI currently treats writing questions as free text and counts as correct if non-empty.
 */
function buildWritingText(params: {
  level: number;
  examNumber: number;
  vocabPool: Array<{ simplified: string; meaning_vi: string }>;
}) {
  const stems = params.vocabPool.slice(0, 4);
  return stems.map((v, idx) => {
    return {
      id: `writing-${params.level}-${params.examNumber}-${idx + 1}`,
      skill: "writing",
      type: "text",
      prompt: `Viết 1 câu ngắn có sử dụng từ: ${v.simplified} (nghĩa: ${v.meaning_vi})`,
    };
  });
}

function buildSkillQuestions(params: {
  level: number;
  examNumber: number;
  skill: string;
  vocabPool: Array<any>;
  distractors?: Array<string>;
}) {
  if (params.skill === "reading") {
    return buildReadingMCQ({
      level: params.level,
      examNumber: params.examNumber,
      vocabPool: params.vocabPool,
      distractors: params.distractors ?? [],
    });
  }

  if (params.skill === "writing") {
    return buildWritingText({
      level: params.level,
      examNumber: params.examNumber,
      vocabPool: params.vocabPool,
    });
  }

  return [];
}

export async function getExamQuestions(req: Request, res: Response) {
  try {
    const level = clampLevel(req.params.level);
    const examNumber = clampExamNumber(req.params.examNumber);

    if (!level || !examNumber) {
      return res.status(400).json({
        success: false,
        message: "level/examNumber không hợp lệ. level: 1..6, examNumber: 1..3",
      });
    }

    const queryLevel = mapHskToLevel(level);

    // We pick enough items for both reading MCQ and writing text
    // Reading uses pinyin + meaning_vi
    // Writing uses simplified + meaning_vi

    // 1) Pull pool for reading stems
    const vocabReading = await Vocabulary.find({ level: queryLevel as any })
      .select({ pinyin: 1, meaning_vi: 1 })
      .limit(80)
      .lean();


    // 2) Pull pool for writing stems
    const vocabWriting = await Vocabulary.find({ level: queryLevel })
      .select({ simplified: 1, meaning_vi: 1 })
      .limit(80)
      .lean();

    if (!vocabReading.length || !vocabWriting.length) {
      return res.status(404).json({
        success: false,
        message: `Không có từ vựng cho ${queryLevel}.`,
      });
    }

    const distractors = seededShuffle(
      (vocabReading as Array<any>)
        .map((v) => v?.meaning_vi)
        .filter((x) => typeof x === "string" && x.trim().length > 0),
      level * 100 + examNumber
    ).slice(0, 60);

    const questions = [
      ...buildReadingMCQ({
        level,
        examNumber,
        vocabPool: seededShuffle(vocabReading as any, level * 100 + examNumber),
        distractors,
      }),
      ...buildWritingText({
        level,
        examNumber,
        vocabPool: seededShuffle(vocabWriting as any, level * 100 + examNumber),
      }),
    ];

    // Ensure stable enough total size for UI: reading 6 + writing 4 = 10
    // If you want examNumber to change the seed later, we can replace shuffle with deterministic seed.

    return res.status(200).json({
      success: true,
      level,
      examNumber,
      data: {
        questions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo câu hỏi từ từ vựng.",
      error: (error as Error).message,
    });
  }
}

export async function getExamQuestionsBySkill(req: Request, res: Response) {
  try {
    const level = clampLevel(req.params.level);
    const examNumber = clampExamNumber(req.params.examNumber);
    const skill = String(req.params.skill || "").toLowerCase();

    if (!level || !examNumber || (skill !== "reading" && skill !== "writing")) {
      return res.status(400).json({
        success: false,
        message: "level/examNumber/skill không hợp lệ. level: 1..6, examNumber: 1..3, skill: reading|writing",
      });
    }

    const queryLevel = mapHskToLevel(level);
    let vocabPool: Array<any> = [];

    if (skill === "reading") {
      vocabPool = await Vocabulary.find({ level: queryLevel as any })
        .select({ pinyin: 1, meaning_vi: 1 })
        .limit(80)
        .lean();
    } else {
      vocabPool = await Vocabulary.find({ level: queryLevel as any })
        .select({ simplified: 1, meaning_vi: 1 })
        .limit(80)
        .lean();
    }

    if (!vocabPool.length) {
      return res.status(404).json({
        success: false,
        message: `Không có từ vựng cho ${queryLevel} (${skill}).`,
      });
    }

    const distractors = skill === "reading"
      ? shuffle(
          (vocabPool as Array<any>)
            .map((v) => v?.meaning_vi)
            .filter((x) => typeof x === "string" && x.trim().length > 0)
        ).slice(0, 60)
      : [];

    const questions = buildSkillQuestions({
      level,
      examNumber,
      skill,
      vocabPool: seededShuffle(vocabPool as any, level * 100 + examNumber + (skill === "writing" ? 1 : 0)),
      distractors,
    });

    return res.status(200).json({
      success: true,
      level,
      examNumber,
      skill,
      data: {
        questions,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi khi tạo câu hỏi theo kỹ năng từ từ vựng.",
      error: (error as Error).message,
    });
  }
}

