import React from "react";

/**
 * Nhiệm vụ trong ngày, dạng thanh tiến độ giống Baolingo/Duolingo.
 * TODO: nối vào GET /api/missions/today.
 */
const missions = [
  {
    id: "m1",
    title: "Học 20 từ vựng mới",
    progress: 12,
    total: 20,
    reward: 10,
    icon: "📖",
  },
  {
    id: "m2",
    title: "Hoàn thành 3 bài Shadowing",
    progress: 1,
    total: 3,
    reward: 15,
    icon: "🎧",
  },
  {
    id: "m3",
    title: "Đạt độ chính xác 90% trong 1 bài",
    progress: 0,
    total: 1,
    reward: 20,
    icon: "🎯",
  },
];

export default function DailyMissions() {
  return (
    <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-bold text-base">Nhiệm vụ hôm nay</h3>
        <span className="text-[11px] font-semibold text-[#a0a0a5] bg-[#141416] border border-zinc-800 px-2.5 py-1 rounded-full">
          Làm mới sau 14h32
        </span>
      </div>

      <div className="flex flex-col gap-4">
        {missions.map((m) => {
          const pct = Math.min(100, Math.round((m.progress / m.total) * 100));
          const done = pct >= 100;
          return (
            <div key={m.id} className="flex items-center gap-3">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-[#141416] border border-zinc-800 flex items-center justify-center text-lg">
                {m.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-sm font-semibold text-[#dddddf] truncate pr-2">
                    {m.title}
                  </p>
                  <span className="text-xs font-bold text-[#facc15] shrink-0">
                    +{m.reward} XP
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[#141416] border border-zinc-800 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: done
                        ? "#34d399"
                        : "linear-gradient(90deg,#d67b7b,#e06d53)",
                    }}
                  />
                </div>
              </div>
              <span className="text-xs font-semibold text-[#a0a0a5] w-10 text-right shrink-0">
                {m.progress}/{m.total}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}