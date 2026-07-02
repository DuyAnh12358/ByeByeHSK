import React from "react";
import { useUser } from "@clerk/clerk-react";

export default function HeroGreeting() {
  const { user, isLoaded } = useUser();
  const firstName = isLoaded ? user?.firstName || "bạn" : "";

  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#241a19] via-[#1c1c1e] to-[#141416] p-6 sm:p-8">
      {/* Chữ Hán mờ trang trí phía sau, gợi chủ đề tiếng Trung mà không lấn nội dung */}
      <span
        aria-hidden
        className="font-hanzi select-none pointer-events-none absolute -right-4 -top-6 text-[9rem] sm:text-[11rem] font-black text-white/[0.04] leading-none"
      >
        学
      </span>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 bg-[#d67b7b]/15 text-[#e6a3a3] border border-[#d67b7b]/30 text-xs font-semibold px-2.5 py-1 rounded-full">
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current">
              <path d="M12 2c1.2 2.4-.6 3.8-1.6 5-1.4 1.7-1.9 3-1.9 4.4A3.5 3.5 0 0012 15a3.5 3.5 0 003.5-3.5c0-.9-.3-1.6-.8-2.3 1.6 1 2.8 2.9 2.8 5.1A5.5 5.5 0 0112 20a5.5 5.5 0 01-5.5-5.5c0-3.2 2-5.2 3.4-6.9C11 6 12.3 4.4 12 2z" />
            </svg>
            47 ngày liên tiếp
          </span>
          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white">
            Chào {firstName}, tiếp tục hành trình chinh phục HSK nào 加油!
          </h1>
          <p className="mt-2 text-sm text-[#a0a0a5] max-w-md">
            Bạn còn 8 từ vựng nữa là hoàn thành mục tiêu hôm nay. Đừng để
            streak bị đứt nhé.
          </p>
        </div>

        <button className="shrink-0 bg-[#d67b7b] hover:bg-[#c96b6b] active:scale-[0.98] transition-all text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg shadow-[#d67b7b]/25 cursor-pointer">
          Tiếp tục học →
        </button>
      </div>
    </div>
  );
}