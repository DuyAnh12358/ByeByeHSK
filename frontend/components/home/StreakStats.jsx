import React from "react";

/**
 * Thanh thống kê nhanh: Streak (chuỗi ngày học), XP, Kim cương, Tim.
 * TODO: nối vào GET /api/users/me/stats khi backend member khác dựng xong endpoint.
 */
const stats = [
  {
    key: "streak",
    label: "Streak",
    value: 47,
    suffix: "ngày",
    color: "#f5b942",
    icon: (
      <path d="M12 2c1.2 2.4-.6 3.8-1.6 5-1.4 1.7-1.9 3-1.9 4.4A3.5 3.5 0 0012 15a3.5 3.5 0 003.5-3.5c0-.9-.3-1.6-.8-2.3 1.6 1 2.8 2.9 2.8 5.1A5.5 5.5 0 0112 20a5.5 5.5 0 01-5.5-5.5c0-3.2 2-5.2 3.4-6.9C11 6 12.3 4.4 12 2z" />
    ),
  },
  {
    key: "xp",
    label: "Điểm KN",
    value: 1280,
    suffix: "XP",
    color: "#facc15",
    icon: (
      <path d="M12 2l2.6 6.9 7.4.4-5.8 4.7 2.1 7.2L12 17l-6.3 4.2 2.1-7.2-5.8-4.7 7.4-.4L12 2z" />
    ),
  },
  {
    key: "gems",
    label: "Kim cương",
    value: 356,
    suffix: "",
    color: "#60a5fa",
    icon: <path d="M6 3h12l4 6-10 12L2 9l4-6z" />,
  },
  {
    key: "hearts",
    label: "Tim",
    value: 5,
    suffix: "/5",
    color: "#fb7185",
    icon: (
      <path d="M12 21s-7.5-4.7-10-9.3C.5 8 2.3 4.5 5.7 4c2-.3 3.7.7 6.3 3.3C14.6 4.7 16.3 3.7 18.3 4c3.4.5 5.2 4 3.7 7.7C19.5 16.3 12 21 12 21z" />
    ),
  },
];

export default function StreakStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.key}
          className="flex items-center gap-3 bg-[#1c1c1e] border border-zinc-800 rounded-2xl px-4 py-3 hover:border-zinc-700 transition-colors"
        >
          <svg
            viewBox="0 0 24 24"
            className="w-7 h-7 shrink-0"
            style={{ fill: s.color }}
          >
            {s.icon}
          </svg>
          <div className="leading-tight">
            <p className="text-lg font-extrabold text-white">
              {s.value}
              <span className="text-xs font-semibold text-[#a0a0a5] ml-1">
                {s.suffix}
              </span>
            </p>
            <p className="text-[11px] uppercase tracking-wide text-[#a0a0a5]">
              {s.label}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}