import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../utils/api";

const SKILL_META = {
  reading: { label: "Đọc", color: "#facc15", icon: "📖" },
  writing: { label: "Viết", color: "#e06d53", icon: "✍️" },
};

function buildDemoQuestions({ level, examNumber, skill }) {
  const baseId = `${level}-${examNumber}-${skill}`;
  return [1, 2, 3, 4].map((n) => {
    const type = skill === "writing" ? "text" : "mcq";

    return {
      id: `${baseId}-${n}`,
      skill,
      prompt: `Câu ${n} (${SKILL_META[skill].label}) - HSK ${level} - Đề ${String(examNumber).padStart(2, "0")}`,
      type,
      options:
        type === "mcq"
          ? ["A", "B", "C", "D"].map((o, k) => ({ key: `${o}-${k}`, label: `${o}` }))
          : [],
      correct: type === "mcq" ? "A" : "",
    };
  });
}

export default function SkillPracticeTake() {
  const { level, examNumber, skill } = useParams();
  const navigate = useNavigate();

  const hskLevel = Number(level);
  const exNum = Number(examNumber);
  const activeSkill = String(skill || "").toLowerCase();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      if (!hskLevel || !exNum || !(activeSkill in SKILL_META)) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await apiGet(`/api/exams/questions/${hskLevel}/${exNum}/skill/${activeSkill}`);
        if (!cancelled) {
          setQuestions(res?.data?.questions ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setQuestions(buildDemoQuestions({ level: hskLevel, examNumber: exNum, skill: activeSkill }));
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadQuestions();
    return () => {
      cancelled = true;
    };
  }, [hskLevel, exNum, activeSkill]);

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
        if (String(a).trim().length > 0) s += 1;
      }
    }

    return { correct: s, total };
  }, [submitted, answers, questions, total]);

  const skillMeta = SKILL_META[activeSkill] ?? { label: "", color: "#a0a0a5", icon: "" };

  return (
    <div className="px-4 sm:px-6 py-6 flex flex-col gap-5 max-w-7xl mx-auto">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white font-extrabold text-2xl">
            Luyện {skillMeta.label} · HSK {hskLevel} · Đề {String(exNum).padStart(2, "0")}
          </div>
          <div className="text-[#a0a0a5] text-sm mt-1">Demo UI để test luồng luyện từng kỹ năng</div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-[#141416] border border-zinc-800 text-[#a0a0a5] hover:text-white hover:border-zinc-700 px-3 py-2 rounded-xl text-xs font-bold"
        >
          Quay lại
        </button>
      </div>

      <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
        <span
          className="inline-flex items-center gap-2 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#141416] border border-zinc-800"
          style={{ color: skillMeta.color }}
        >
          <span aria-hidden>{skillMeta.icon}</span>
          {skillMeta.label}
        </span>

        {loading ? (
          <div className="mt-4 text-[#a0a0a5] text-xs font-semibold">Đang tải câu hỏi...</div>
        ) : (
          <div className="mt-4 text-[#a0a0a5] text-xs font-semibold">{total} câu</div>
        )}

        {error && (
          <div className="mt-3 text-sm text-rose-300 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-3">
            Không tải được dữ liệu từ backend. Chuyển sang demo.
          </div>
        )}
      </div>

      <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
        {loading ? (
          <div className="text-[#a0a0a5] text-sm">Đang tải câu hỏi...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => {
              return (
                <div key={q.id} className="border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-white text-sm font-extrabold">
                        {i + 1}. {q.prompt}
                      </div>
                      <div
                        className="text-[11px] font-bold mt-2 inline-flex items-center gap-2 px-2.5 py-1 rounded-full"
                        style={{
                          color: skillMeta.color,
                          background: "rgba(20,20,22,1)",
                          border: `1px solid ${skillMeta.color}33`,
                        }}
                      >
                        <span aria-hidden>{skillMeta.icon}</span>
                        {skillMeta.label}
                      </div>
                    </div>
                  </div>

                  {q.type === "mcq" ? (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {q.options.map((opt) => {
                        const active = answers[q.id] === opt.label;
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
        )}
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

