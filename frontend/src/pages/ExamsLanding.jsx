import React from "react";
import { Link } from "react-router-dom";

const LEVELS = [
  { level: 1, accent: "#00d1a8", attempts: "3.1K" },
  { level: 2, accent: "#1fc4d6", attempts: "929" },
  { level: 3, accent: "#4aa3ff", attempts: "979" },
  { level: 4, accent: "#6b5bff", attempts: "715" },
  { level: 5, accent: "#b46bff", attempts: "353" },
  { level: 6, accent: "#ff6b8b", attempts: "147" },
];

export default function ExamsLanding() {
  return (
    <div className="w-full px-4 sm:px-8 py-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold text-white text-center">Luyện thi HSK</h1>
        <p className="text-sm text-[#a0a0a5] mt-2 text-center">
          Luyện đề thi thử HSK 1–6 đầy đủ theo đúng định dạng thật, chấm điểm tức thì.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {LEVELS.map((item) => (
          <Link key={item.level} to={`/thi-thu/hsk/${item.level}`} className="group block">
            <div className="relative h-44">
              {/* Gradient border / glow */}
              <div
                aria-hidden
                className="absolute inset-0 rounded-2xl"
                style={{
                  padding: 2,
                  background: `linear-gradient(135deg, ${item.accent}, rgba(255,255,255,0.06))`,
                }}
              >
                <div className="h-full w-full rounded-[18px] bg-[#141416] overflow-hidden relative">
                  {/* corner decor */}
                  <div
                    aria-hidden
                    className="absolute -top-6 -right-6 w-28 h-28 rounded-full opacity-90"
                    style={{
                      background: `radial-gradient(circle at 30% 30%, ${item.accent}, rgba(0,0,0,0.0) 60%)`,
                    }}
                  />

                  <div className="p-6 h-full flex flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-xs text-[#9aa0a6] font-semibold">HSK</div>
                        <div className="text-6xl font-extrabold text-white mt-2">{item.level}</div>
                      </div>

                      <div
                        className="flex items-center justify-center w-12 h-12 rounded-full shadow-md"
                        style={{ background: item.accent }}
                      >
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                          <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-[#b2b6bb]">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center gap-2">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current mr-1"><path d="M6 2h9a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V4a2 2 0 012-2z" /></svg>
                          5 đề
                        </span>
                        <span className="inline-flex items-center gap-2 mt-1">
                          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current mr-1"><path d="M12 12a5 5 0 100-10 5 5 0 000 10zM2 20a10 10 0 0120 0H2z" /></svg>
                          {item.attempts} lượt làm
                        </span>
                      </div>

                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 group-hover:scale-105 transition-transform">
                        <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
