// Dữ liệu mock cho trang "Luyện thi HSK".
// TODO: thay bằng GET /api/exams?level=... khi backend có endpoint.

// Thông số gần đúng theo cấu trúc đề thi HSK (số câu / thời lượng từng kỹ năng).
// Với HSK 7-9 (cấp cao, theo chuẩn HSK 3.0) đề gộp chung 3 cấp nên số liệu chỉ mang tính minh hoạ.
export const LEVELS = [
  { level: 1, band: "so-cap", totalQuestions: 40, duration: 35 },
  { level: 2, band: "so-cap", totalQuestions: 60, duration: 55 },
  { level: 3, band: "so-cap", totalQuestions: 80, duration: 90 },
  { level: 4, band: "trung-cap", totalQuestions: 100, duration: 105 },
  { level: 5, band: "trung-cap", totalQuestions: 100, duration: 125 },
  { level: 6, band: "trung-cap", totalQuestions: 101, duration: 140 },
];

export const BANDS = {
  "so-cap": { label: "Sơ cấp", color: "#34d399" },
  "trung-cap": { label: "Cao cấp", color: "#facc15" },
  "cao-cap": { label: "Cao cấp", color: "#f87171" },
};


// Tỉ trọng câu hỏi Nghe/Đọc/Viết theo % tổng số câu — chỉ để hiển thị chip minh hoạ
const SKILL_SPLIT = { listening: 0.35, reading: 0.4, writing: 0.25 };

function skillsFor(totalQuestions) {
  return {
    listening: Math.round(totalQuestions * SKILL_SPLIT.listening),
    reading: Math.round(totalQuestions * SKILL_SPLIT.reading),
    writing:
      totalQuestions -
      Math.round(totalQuestions * SKILL_SPLIT.listening) -
      Math.round(totalQuestions * SKILL_SPLIT.reading),
  };
}

export function getExamsForLevel(level) {
  const meta = LEVELS.find((l) => l.level === level);
  if (!meta) return [];
  const skills = skillsFor(meta.totalQuestions);

  return [1, 2, 3].map((n) => {
    const key = `${level}-${n}`;
    return {
      id: key,
      level,
      examNumber: n,
      title: `Đề thi thử HSK ${level} - Đề số ${String(n).padStart(2, "0")}`,
      duration: meta.duration,
      totalQuestions: meta.totalQuestions,
      skills,
      attempt: null,
    };
  });
}

export function mergeExamAttempts(exams, attemptsByExamNumber) {
  if (!Array.isArray(exams)) return [];

  return exams.map((exam) => {
    const stat = attemptsByExamNumber?.[exam.examNumber];
    return {
      ...exam,
      attempt: stat
        ? {
            bestScore: stat.bestScore ?? 0,
            passed: Boolean(stat.passed),
            attempts: stat.attemptsCount ?? 0,
          }
        : null,
    };
  });
}

