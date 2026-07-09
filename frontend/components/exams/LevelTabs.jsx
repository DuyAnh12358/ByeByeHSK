import React from "react";
import { LEVELS, BANDS } from "../../src/data/examsData";

export default function LevelTabs({ selected, onSelect }) {
  // nhóm level theo band để hiển thị nhãn Sơ cấp / Trung cấp / Cao cấp phía trên
  const groups = ["so-cap", "trung-cap"].map((band) => ({
    band,
    levels: LEVELS.filter((l) => l.band === band),
  }));

  return (
    <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 overflow-x-auto">
        {groups.map((g) => (
          <div key={g.band} className="flex flex-col gap-2 shrink-0">
            <span
              className="text-[11px] font-bold uppercase tracking-wide"
              style={{ color: BANDS[g.band].color }}
            >
              {BANDS[g.band].label}
            </span>
            <div className="flex gap-2">
              {g.levels.map((l) => {
                const active = selected === l.level;
                return (
                  <button
                    key={l.level}
                    onClick={() => onSelect(l.level)}
                    className={[
                      "w-11 h-11 rounded-xl font-bold text-sm border transition-all cursor-pointer",
                      active
                        ? "text-white scale-105 shadow-lg"
                        : "bg-[#141416] border-zinc-800 text-[#a0a0a5] hover:border-zinc-700 hover:text-white",
                    ].join(" ")}
                    style={
                      active
                        ? {
                            background: "#d67b7b",
                            borderColor: "#e6a3a3",
                            boxShadow: "0 8px 20px -6px rgba(214,123,123,0.5)",
                          }
                        : undefined
                    }
                  >
                    {l.level}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}