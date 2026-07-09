import React from "react";

const SKILLS = [
  {
    key: "reading",
    label: "Luyện Đọc",
    desc: "Đọc hiểu đoạn văn, điền từ, sắp xếp câu",
    color: "#facc15",
    icon: "📖",
  },
  {
    key: "writing",
    label: "Luyện Viết",
    desc: "Sắp xếp câu, viết đoạn văn theo chủ đề",
    color: "#e06d53",
    icon: "✍️",
  },
];


import { useNavigate } from "react-router-dom";

export default function SkillPracticeGrid({ level, examNumber = 1, questionCounts }) {
  const navigate = useNavigate();

  const goToSkill = (skillKey) => {
    // examNumber hiện tại lấy từ prop (mặc định = 1)
    navigate(`/thi-thu/hsk/${level}/exam/${examNumber}/skill/${skillKey}`);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">

      {SKILLS.map((s) => (
        <div
          key={s.key}
          className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-zinc-700 transition-colors h-full"
        >

          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
            style={{ background: `${s.color}1A` }}
          >
            {s.icon}
          </div>
          <div>
            <h4 className="text-white font-bold text-sm">
              {s.label} · HSK {level}
            </h4>
            <p className="text-xs text-[#a0a0a5] mt-1">{s.desc}</p>
          </div>
          <span className="text-[11px] font-semibold text-[#a0a0a5]">
            {questionCounts?.[s.key] ?? "--"} câu / lượt luyện
          </span>
          <button
            type="button"
            onClick={() => goToSkill(s.key)}
            className="mt-auto text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer text-white hover:opacity-95 active:scale-[0.98]"
            style={{ background: s.color }}
          >
            Luyện ngay
          </button>


        </div>
      ))}
    </div>
  );
}