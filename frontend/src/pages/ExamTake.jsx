import React, { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiGet } from "../utils/api";

const SKILL_META = {
  reading: { label: "Đọc", color: "#facc15", icon: "📖" },
  writing: { label: "Viết", color: "#e06d53", icon: "✍️" },
};

function buildDemoQuestions({ level, examNumber }) {
  const baseId = `${level}-${examNumber}`;
  return ["reading", "writing"].flatMap((skill) => {
    return [1, 2].map((n) => ({
      id: `${baseId}-${skill}-${n}`,
      skill,
      prompt: `Câu ${n} (${SKILL_META[skill].label}) - HSK ${level} - Đề ${String(examNumber).padStart(2, "0")}`,
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

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!hskLevel || !exNum) {
        setQuestions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const res = await apiGet(`/api/exams/questions/${hskLevel}/${exNum}`);
        const qs = res?.data?.questions ?? [];
        if (!cancelled) setQuestions(qs);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
          setQuestions(buildDemoQuestions({ level: hskLevel, examNumber: exNum }));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [hskLevel, exNum]);

  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const total = questions.length;
  const isEmpty = !loading && total === 0;

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

  return (
    /* Chuẩn hóa: Dùng w-full, tự động co giãn theo layout cha */
    <div className="w-full px-4 sm:px-8 py-6 flex flex-col gap-5">

      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-white font-extrabold text-2xl">
            Làm đề thi thử HSK {hskLevel} · Đề {String(exNum).padStart(2, "0")}
          </div>
          <div className="text-[#a0a0a5] text-sm mt-1">Demo UI để test luồng làm đề trước</div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="bg-[#141416] border border-zinc-800 text-[#a0a0a5] hover:text-white hover:border-zinc-700 px-3 py-2 rounded-xl text-xs font-bold transition-colors"
        >
          Quay lại
        </button>
      </div>

      {/* Meta thông tin đề bài */}
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

        {loading ? (
          <div className="mt-4 text-[#a0a0a5] text-xs font-semibold">Đang tải đề...</div>
        ) : (
          <div className="mt-4 text-[#a0a0a5] text-xs font-semibold">{total} câu</div>
        )}

        {error && (
          <div className="mt-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-200">
            Lỗi khi tải đề từ backend: {error}
          </div>
        )}

        {isEmpty && !error && !loading && (
          <div className="mt-3 rounded-2xl border border-slate-500/20 bg-slate-700/40 p-3 text-sm text-slate-200">
            Chưa có câu hỏi cho đề này. Vui lòng thử lại hoặc kiểm tra dữ liệu HSK trong database.
          </div>
        )}
      </div>

      {/* Danh sách câu hỏi */}
      <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
        {loading ? (
          <div className="text-[#a0a0a5] text-sm">Đang tải câu hỏi...</div>
        ) : (
          <div className="flex flex-col gap-4">
            {questions.map((q, i) => {
              const meta = SKILL_META[q.skill];
              return (
                <div key={q.id} className="border border-zinc-800 rounded-2xl bg-[#121214] p-5 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] transition-all hover:shadow-[0_0_0_1px_rgba(214,123,123,0.25)]">
                  <div className="flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="text-white text-base font-bold">{i + 1}. {q.prompt}</div>
                        <div
                          className="text-[11px] font-semibold mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1"
                          style={{
                            color: meta.color,
                            background: "rgba(255,255,255,0.05)",
                            border: `1px solid ${meta.color}33`,
                          }}
                        >
                          <span aria-hidden>{meta.icon}</span>
                          {meta.label}
                        </div>
                      </div>
                    </div>

                    {q.type === "mcq" ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                "w-full text-left text-sm font-semibold px-4 py-3 rounded-2xl border transition-all",
                                active
                                  ? "bg-[#d67b7b] border-[#e6a3a3] text-white"
                                  : "bg-[#141416] border-zinc-700 text-[#d1d5db] hover:border-zinc-600 hover:bg-[#1f1f22]",
                              ].join(" ")}
                            >
                              {opt.label}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
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
                        className="mt-4 w-full bg-[#141416] border border-zinc-800 text-white text-sm rounded-2xl p-4 outline-none placeholder:text-slate-500"
                        placeholder="Nhập câu trả lời..."
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Thanh điều khiển chân trang (Nộp bài / Làm lại) */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        {submitted && score ? (
          <div className="text-white font-extrabold text-sm">
            Kết quả (demo): {score.correct}/{score.total}
          </div>
        ) : (
          <div />
        )}

        <div className="flex gap-3">
          <button
            onClick={() => {
              setAnswers({});
              setSubmitted(false);
            }}
            className="bg-[#141416] border border-zinc-800 text-[#a0a0a5] hover:text-white hover:border-zinc-700 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors"
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