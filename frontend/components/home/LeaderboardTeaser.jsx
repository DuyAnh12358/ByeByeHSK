import React from "react";

/**
 * Xem trước Top 3 bảng xếp hạng tuần (giải Đồng/Bạc/Vàng kiểu Duolingo).
 * TODO: nối vào GET /api/leaderboard/weekly.
 */
const top3 = [
  { rank: 1, name: "Minh Anh", xp: 2140, medal: "#facc15" },
  { rank: 2, name: "Quốc Bảo", xp: 1980, medal: "#cbd5e1" },
  { rank: 3, name: "Bạn", xp: 1280, medal: "#e0864a", isYou: true },
];

export default function LeaderboardTeaser() {
  return (
    <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">Giải Đồng tuần này</h3>
        <span className="text-[11px] font-semibold text-[#a0a0a5]">
          Còn 3 ngày
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {top3.map((p) => (
          <div
            key={p.rank}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl ${
              p.isYou
                ? "bg-[#d67b7b]/10 border border-[#d67b7b]/30"
                : "border border-transparent"
            }`}
          >
            <span
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-extrabold text-[#141416] shrink-0"
              style={{ background: p.medal }}
            >
              {p.rank}
            </span>
            <p
              className={`flex-1 text-sm font-semibold truncate ${
                p.isYou ? "text-white" : "text-[#dddddf]"
              }`}
            >
              {p.name}
            </p>
            <span className="text-xs font-bold text-[#a0a0a5]">{p.xp} XP</span>
          </div>
        ))}
      </div>

      <button className="w-full mt-4 text-xs font-bold text-[#d67b7b] hover:text-[#e6a3a3] transition-colors cursor-pointer">
        Xem toàn bộ bảng xếp hạng →
      </button>
    </div>
  );
}