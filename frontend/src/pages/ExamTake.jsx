import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SKILL_META = {
  reading: { label: "Đọc", color: "#facc15", icon: "📖" },
  writing: { label: "Viết", color: "#e06d53", icon: "✍️" },
  
};

function buildDemoQuestions({ level, examNumber }) {
  // Demo UI: 2 câu mỗi kỹ năng (đọc/viết). Bỏ phần "nghe" theo yêu cầu.
  const baseId = `${level}-${examNumber}`;
  return ["reading", "writing"].flatMap((skill) => {
    return [1, 2].map((n) => ({
      id: `${baseId}-${skill}-${n}`,
      skill,
      prompt: `Câu ${n} (${SKILL_META[skill].label}) - HSK ${level} - Đề ${examNumber}`,
      type: skill === "writing" ? "text" : "mcq",
      options:
        skill === "writing"
          ? []
          : ["A", "B", "C", "D"].map((o, k) => ({ key: `${o}-${k}`, label: `${o}` })),
      correct: skill === "writing" ? "" : "A",
    }));
  });
}


export default function ExamTake() {
  const { level, examNumber } = useParams();
  const navigate = useNavigate();

  const hskLevel = Number(level);
  const exNum = Number(examNumber);

  const questions = useMemo(() => {
    if (!hskLevel || !exNum) return [];
    return buildDemoQuestions({ level: hskLevel, examNumber: exNum });
  }, [hskLevel, exNum]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;

  const score = useMemo(() => {
    if (!submitted) return null;
    let s = 0;
    for (const q of questions) {
      const a = answers[q.id];
      if (!a) continue;
      if (q.type === "mcq") {
        if (a === q.correct) s += 1;
      } else {
        // demo: coi input không rỗng là đúng
        if (String(a).trim().length > 0) s += 1;
      }
    }
    return { correct: s, total };
  }, [submitted, answers, questions, total]);

  return (
    <div className="px-4 sm:px-6 py-6 flex flex-col gap-5 max-w-7xl mx-auto">

      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white font-extrabold text-2xl">
            Làm đề thi thử HSK {hskLevel} · Đề {String(exNum).padStart(2, "0")}
          </div>
          <div className="text-[#a0a0a5] text-sm mt-1">Demo UI để test luồng làm đề trước</div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-[#141416] border border-zinc-800 text-[#a0a0a5] hover:text-white hover:border-zinc-700 px-3 py-2 rounded-xl text-xs font-bold"
        >
          Quay lại
        </button>
      </div>

      <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
        <div className="flex flex-wrap gap-2">
          {Object.entries(SKILL_META).map(([k, meta]) => (
            <span
              key={k}
              className="inline-flex items-center gap-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#141416] border border-zinc-800"
              style={{ color: meta.color }}
            >
              <span aria-hidden>{meta.icon}</span>
              {meta.label}
            </span>
          ))}
        </div>

        <div className="mt-4 text-[#a0a0a5] text-xs font-semibold">
          {total} câu
        </div>
      </div>

      <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
        <div className="flex flex-col gap-4">
          {questions.map((q, i) => {
            const meta = SKILL_META[q.skill];
            return (
              <div key={q.id} className="border border-zinc-800 rounded-xl p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-white text-sm font-extrabold">{i + 1}. {q.prompt}</div>
                    <div className="text-[11px] font-bold mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full" style={{
                      color: meta.color,
                      background: "rgba(20,20,22,1)",
                      border: `1px solid ${meta.color}33`
                    }}>
                      <span aria-hidden>{meta.icon}</span>
                      {meta.label}
                    </div>
                  </div>
                </div>

                {q.type === "mcq" ? (
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const active = answers[q.id] === opt.label || answers[q.id] === q.correct && opt.label === "A";
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          disabled={submitted}
                          onClick={() =>
                            setAnswers((prev) => ({
                              ...prev,
                              [q.id]: opt.label,
                            }))
                          }
                          className={[
                            "text-xs font-bold px-3 py-2 rounded-xl border transition-colors text-left",
                            active
                              ? "bg-[#d67b7b] border-[#e6a3a3] text-white"
                              : "bg-[#141416] border-zinc-800 text-[#a0a0a5] hover:border-zinc-700 hover:text-white",
                          ].join(" ")}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      rows={4}
                      disabled={submitted}
                      value={answers[q.id] ?? ""}
                      onChange={(e) =>
                        setAnswers((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      className="w-full bg-[#141416] border border-zinc-800 text-white text-sm rounded-xl p-3 outline-none"
                      placeholder="Nhập câu trả lời (demo)"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {submitted && score && (
          <div className="text-white font-extrabold text-sm">
            Kết quả (demo): {score.correct}/{score.total}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="bg-[#141416] border border-zinc-800 text-[#a0a0a5] hover:text-white hover:border-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold"
          >
            Làm lại
          </button>

          <button
            onClick={() => setSubmitted(true)}
            disabled={submitted}
            className="bg-[#d67b7b] hover:bg-[#c96b6b] disabled:opacity-60 disabled:cursor-not-allowed active:scale-[0.98] transition-all text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
          >
            Nộp bài
          </button>
        </div>
      </div>
    </div>
  );
}

