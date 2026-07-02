import React from "react";

/**
 * Lộ trình học HSK dạng "con đường" — mỗi nút là 1 bài học gắn với 1 chữ Hán đại diện.
 * status: "done" | "current" | "locked"
 * TODO: nối vào GET /api/lessons?unit=... khi backend dựng xong.
 */
const path = [
  { id: "l1", hanzi: "你", pinyin: "nǐ", title: "Chào hỏi cơ bản", status: "done" },
  { id: "l2", hanzi: "好", pinyin: "hǎo", title: "Giới thiệu bản thân", status: "done" },
  { id: "l3", hanzi: "家", pinyin: "jiā", title: "Gia đình", status: "done" },
  { id: "l4", hanzi: "吃", pinyin: "chī", title: "Ăn uống", status: "current" },
  { id: "l5", hanzi: "买", pinyin: "mǎi", title: "Mua sắm", status: "locked" },
  { id: "l6", hanzi: "去", pinyin: "qù", title: "Đi lại, phương hướng", status: "locked" },
  { id: "l7", hanzi: "问", pinyin: "wèn", title: "Hỏi đường", status: "locked" },
];

// vị trí ngang xen kẽ tạo cảm giác "con đường" uốn lượn
const OFFSETS = ["justify-center", "justify-start", "justify-end", "justify-center", "justify-start", "justify-end", "justify-center"];

function Node({ item, offsetClass }) {
  const isDone = item.status === "done";
  const isCurrent = item.status === "current";
  const isLocked = item.status === "locked";

  return (
    <div className={`w-full flex ${offsetClass} px-4 sm:px-10`}>
      <div className="relative flex flex-col items-center w-24">
        {isCurrent && (
          <span className="absolute -top-9 whitespace-nowrap text-[11px] font-bold text-white bg-[#d67b7b] px-2.5 py-1 rounded-full shadow-lg shadow-[#d67b7b]/30 animate-bounce">
            Bắt đầu
          </span>
        )}
        <button
          disabled={isLocked}
          className={[
            "relative w-16 h-16 rounded-full flex items-center justify-center font-hanzi text-2xl font-bold border-4 transition-transform",
            isDone &&
              "bg-emerald-500 border-emerald-300/40 text-white shadow-lg shadow-emerald-900/40 hover:scale-105",
            isCurrent &&
              "bg-[#d67b7b] border-[#f2b8b0] text-white shadow-xl shadow-[#d67b7b]/40 scale-110 hover:scale-115",
            isLocked &&
              "bg-[#1c1c1e] border-zinc-800 text-zinc-600 cursor-not-allowed",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {isDone ? (
            <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
              <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 11-11-1.5-1.5z" />
            </svg>
          ) : isLocked ? (
            <svg viewBox="0 0 24 24" className="w-6 h-6 fill-zinc-600">
              <path d="M17 8V7a5 5 0 00-10 0v1H5v13h14V8h-2zm-8-1a3 3 0 016 0v1H9V7zm3 6a2 2 0 012 2c0 .74-.4 1.38-1 1.72V17h-2v-1.28c-.6-.34-1-.98-1-1.72a2 2 0 012-2z" />
            </svg>
          ) : (
            item.hanzi
          )}
        </button>
        <div className="mt-2 text-center">
          <p
            className={`text-xs font-bold font-hanzi ${
              isLocked ? "text-zinc-600" : "text-[#dddddf]"
            }`}
          >
            {isLocked ? "?" : item.pinyin}
          </p>
          <p
            className={`text-[11px] leading-tight ${
              isLocked ? "text-zinc-700" : "text-[#a0a0a5]"
            }`}
          >
            {item.title}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LearningPath() {
  return (
    <div className="bg-[#1c1c1e] border border-zinc-800 rounded-2xl p-5 sm:p-8">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-white font-bold text-base">
          HSK 1 · Chủ đề: Giao tiếp cơ bản
        </h3>
        <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
          3/7 bài hoàn thành
        </span>
      </div>
      <p className="text-xs text-[#a0a0a5] mb-8">
        Đi theo con đường, hoàn thành từng bài để mở khoá bài tiếp theo.
      </p>

      <div className="relative flex flex-col gap-10 py-2">
        {path.map((item, i) => (
          <Node key={item.id} item={item} offsetClass={OFFSETS[i % OFFSETS.length]} />
        ))}
      </div>
    </div>
  );
}