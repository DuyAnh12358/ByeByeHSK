import React from "react";

const modes = [
  { key: "full", label: "Đề đầy đủ" },
  { key: "skill", label: "Luyện từng kỹ năng" },
];

export default function ModeToggle({ mode, onChange }) {
  return (
    <div className="inline-flex bg-[#141416] border border-zinc-800 rounded-full p-1 gap-1">
      {modes.map((m) => {
        const active = mode === m.key;
        return (
          <button
            key={m.key}
            onClick={() => onChange(m.key)}
            className={[
              "text-xs font-bold px-4 py-2 rounded-full transition-colors cursor-pointer",
              active
                ? "bg-[#d67b7b] text-white"
                : "text-[#a0a0a5] hover:text-white",
            ].join(" ")}
          >
            {m.label}
          </button>
        );
      })}
    </div>
  );
}