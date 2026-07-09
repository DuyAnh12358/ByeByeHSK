import React from "react";

const SKILL_META = {
  reading: { label: "Đọc", color: "#facc15", icon: "📖" },
  writing: { label: "Viết", color: "#e06d53", icon: "✍️" },
};


export default function ExamCard({ exam, loadingStats = false }) {
  const { title, duration, totalQuestions, skills, attempt } = exam;

  return (
    <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-zinc-700 transition-colors h-full">
      <div className="flex items-start justify-between gap-3">
        <h4 className="text-white font-bold text-sm leading-snug">{title}</h4>
        {(attempt || loadingStats) && (
          <span
            className={`shrink-0 text-[11px] font-bold px-2 py-1 rounded-full ${
              attempt
                ? attempt.passed
                  ? "bg-emerald-400/10 text-emerald-400 border border-emerald-500/20"
                  : "bg-rose-400/10 text-rose-400 border border-rose-500/20"
                : "bg-zinc-700/30 text-[#a0a0a5] border border-zinc-800"
            }`}
          >
            {attempt ? `${attempt.bestScore}/100` : "..."}
          </span>
        )}
      </div>


      {/* Chip kỹ năng */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(skills)
          .filter(([key]) => key in SKILL_META)
          .map(([key, count]) => {
            const meta = SKILL_META[key];
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#141416] border border-zinc-800"
                style={{ color: meta.color }}
              >
                <span aria-hidden>{meta.icon}</span>
                {meta.label} · {count} câu
              </span>
            );
          })}
      </div>


      <div className="flex items-center gap-4 text-[11px] text-[#a0a0a5]">
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm.5 5v5.3l4 2.4-.8 1.3-4.7-2.8V7h1.5z" />
          </svg>
          {duration} phút
        </span>
        <span className="inline-flex items-center gap-1">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
            <path d="M4 4h16v2H4zm0 7h16v2H4zm0 7h10v2H4z" />
          </svg>
          {totalQuestions} câu
        </span>
        {attempt && <span>Đã làm {attempt.attempts} lần</span>}
      </div>

      <button
        onClick={() => {
          const url = `/thi-thu/hsk/${exam.level}/exam/${exam.examNumber}`;
          window.location.href = url;
        }}
        className="mt-auto bg-[#d67b7b] hover:bg-[#c96b6b] active:scale-[0.98] transition-all text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer"
      >
        {attempt ? "Làm lại" : "Bắt đầu thi"}
      </button>

    </div>
  );
}