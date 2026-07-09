import React from "react";

export default function ExamsHero() {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#241a19] via-[#1c1c1e] to-[#141416] p-6 sm:p-8">
      <span
        aria-hidden
        className="font-hanzi select-none pointer-events-none absolute -right-6 -top-8 text-[9rem] sm:text-[11rem] font-black text-white/[0.04] leading-none"
      >
        考
      </span>

      <div className="relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-[#e06d53]/15 text-[#f0a084] border border-[#e06d53]/30 text-xs font-semibold px-2.5 py-1 rounded-full">
          Luyện thi HSK MỚI
        </span>
        <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
          Luyện thi HSK
        </h1>
        <p className="mt-2 text-sm text-[#a0a0a5] max-w-lg">
          Luyện đề thi thử HSK 1–9 đầy đủ theo đúng định dạng thật: nghe, đọc,
          viết — chấm điểm tức thì và xem lại đáp án chi tiết.
        </p>

        <div className="mt-6 grid grid-cols-3 gap-3 max-w-md">
          <div className="bg-[#141416]/60 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-extrabold text-white">3</p>
            <p className="text-[11px] text-[#a0a0a5]">Đề đã làm</p>
          </div>
          <div className="bg-[#141416]/60 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-extrabold text-emerald-400">66%</p>
            <p className="text-[11px] text-[#a0a0a5]">Điểm TB</p>
          </div>
          <div className="bg-[#141416]/60 border border-zinc-800 rounded-2xl px-3 py-3 text-center">
            <p className="text-lg font-extrabold text-[#d67b7b]">HSK 3</p>
            <p className="text-[11px] text-[#a0a0a5]">Mục tiêu</p>
          </div>
        </div>
      </div>
    </div>
  );
}