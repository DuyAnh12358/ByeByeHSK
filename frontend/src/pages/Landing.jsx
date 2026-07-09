import React, { useEffect, useMemo, useState } from "react";
import heroImg from "../assets/hero.png";


const steps = [
  {
    no: "1",
    title: "Chọn Bài Học Phù Hợp",
    desc: "Kho nội dung đa dạng từ giáo trình HSK, phim ảnh, nhạc Hoa ngữ, đến tiếng Trung thương mại, du lịch và giao tiếp đời thường.",
  },
  {
    no: "2",
    title: "Nghe & Chép Chính Tả (Dictation)",
    desc: "Thử thách khả năng nghe và nhận diện mặt chữ Hán. AI sẽ kiểm tra Pinyin (phiên âm) và Hán tự để sửa lỗi ngay lập tức.",
  },
  {
    no: "3",
    title: "Nhại Âm & Ghi Âm (Shadowing)",
    desc: "Mô phỏng ngữ điệu và độ nhấn nhá của người bản xứ. Công nhận dạng giọng nói AI giúp bạn chuẩn hóa thanh điệu (tones) chính xác.",
  },
  {
    no: "4",
    title: "Theo Dõi Tiến Độ",
    desc: "Hệ thống báo cáo chi tiết lượng từ vựng HSK đã nạp và biểu đồ cải thiện kỹ năng nghe - nói mỗi ngày.",
  },
];

function GlowCard({ children }) {
  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-[#1c1c1e] p-5 overflow-hidden">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute -top-20 -left-20 w-44 h-44 rounded-full bg-[#d67b7b]/20 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-44 h-44 rounded-full bg-[#e06d53]/15 blur-3xl" />
      </div>
      {children}
    </div>
  );
}

function MainSection() {
  const [mounted, setMounted] = React.useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="px-4 sm:px-6 py-10 flex flex-col gap-10">
      <section className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-br from-[#241a19] via-[#1c1c1e] to-[#141416]">


        <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-[#d67b7b]/10 blur-2xl" />
        <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-[#e06d53]/10 blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(214,123,123,0.18),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(224,109,83,0.14),transparent_55%)]" />

        <div className="relative z-10 p-6 sm:p-10 flex flex-col lg:flex-row gap-10 lg:items-center">
          <div className="flex-1">
            <div
              className={
                "inline-flex items-center gap-2 rounded-full bg-[#d67b7b]/15 border border-[#d67b7b]/30 px-3 py-1 text-xs font-semibold text-[#e6a3a3] " +
                (mounted ? "animate-pulse" : "opacity-0")
              }
              style={{ animationDuration: "0.5s" }}
            >
              Công Nghệ AI Học Tiếng Trung Thông Minh
            </div>

            <h1 className={"mt-4 text-4xl sm:text-5xl font-black leading-tight text-white tracking-tight transition-all duration-500 " + (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")}>
              Lộ Trình 4 Bước Chinh Phục Tiếng Trung
            </h1>

            <p
              className={
                "mt-4 text-zinc-300 max-w-xl text-base sm:text-lg transition-all duration-500 " +
                (mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3")
              }
            >
              Phương pháp khoa học giúp bạn nghe hiểu người bản xứ và nói tiếng Trung trôi chảy chỉ sau thời gian ngắn
            </p>


            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-2xl bg-[#d67b7b] hover:bg-[#c96b6b] active:scale-[0.99] transition-all text-white font-bold px-6 py-3 shadow-lg shadow-[#d67b7b]/20"
              >
                Thử ngay
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center rounded-2xl bg-transparent border border-zinc-700 hover:border-zinc-500 hover:bg-[#1c1c1e] active:scale-[0.99] transition-all text-white font-bold px-6 py-3"
              >
                Xem thêm
              </a>
            </div>

            <div className="mt-6 text-xs text-zinc-500">
              Trải nghiệm ngay giống y chang cấu trúc banner/header & CTA
            </div>
          </div>

          <div className="flex-1">
            <div className="relative">
              <div className="absolute -inset-3 rounded-3xl bg-gradient-to-r from-[#d67b7b]/20 to-[#e06d53]/10 blur-xl" />
              <div className="relative rounded-3xl border border-zinc-800 bg-[#141416]/40 p-4">
                <img
                  src={heroImg}
                  alt="Landing"
                  className="w-full h-auto rounded-2xl object-cover"
                  loading="eager"
                />

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    {
                      title: "Giao diện chọn bài học theo chủ đề",
                      desc: "Phim, nhạc, HSK & nhiều chủ đề khác",
                    },
                    {
                      title: "AI kiểm tra chính tả Dictation",
                      desc: "Sửa lỗi Pinyin & Hán tự ngay lập tức",
                    },
                    {
                      title: "Shadowing chuẩn thanh điệu",
                      desc: "Ghi âm + nhận dạng phát âm AI",
                    },
                    {
                      title: "Bảng tiến độ & lộ trình",
                      desc: "Theo dõi cải thiện mỗi ngày",
                    },
                  ].map((c, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-zinc-800 bg-[#141416]/40 p-4 hover:border-zinc-600 transition-colors"
                    >
                      <div className="text-white font-bold text-sm">{c.title}</div>
                      <div className="mt-2 text-zinc-400 text-xs">{c.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-white font-black text-2xl sm:text-3xl">4 Bước Luyện Tập</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {steps.map((s) => (
            <div key={s.no} className="transition-transform duration-300 hover:-translate-y-1">
              <GlowCard>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#d67b7b]/15 border border-[#d67b7b]/30 flex items-center justify-center text-[#e6a3a3] font-black">
                    {s.no}
                  </div>
                  <div className="text-white font-black text-base">{s.title}</div>
                </div>
                <p className="mt-3 text-sm text-zinc-300">{s.desc}</p>
              </GlowCard>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-[#141416]/40 p-6 sm:p-10">
        <h3 className="text-white font-black text-2xl">Công Nghệ AI Học Tiếng Trung Thông Minh</h3>
        <p className="mt-3 text-zinc-300 max-w-2xl">Giải quyết triệt để nỗi sợ nghe kém và phát âm sai thanh điệu</p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {[
            {
              title: "Nghe Thấu Người Bản Xứ",
              text: "Bạn gặp khó khăn khi người Trung Quốc nói quá nhanh? Phương pháp Dictation giúp tai bạn làm quen với tốc độ thực. 92% học viên hiểu rõ các đoạn hội thoại thực tế sau 30 ngày.",
              cta: "Thử ngay",
            },
            {
              title: "Nói Tiếng Trung Tự Nhiên",
              text: "Xóa bỏ giọng 'người nước ngoài', làm chủ 4 thanh điệu và biến điệu. Shadowing giúp bạn có ngữ điệu tự nhiên như người Bắc Kinh. 95% người dùng tự tin giao tiếp hơn sau 3 tháng.",
              cta: "Thử ngay",
            },
            {
              title: "Khắc Phục Lỗi Sai Tức Thì",
              text: "Học từ sai lầm là cách nhanh nhất. AI phân tích chi tiết lỗi phát âm thanh điệu và lỗi viết sai bộ thủ, giúp bạn chỉnh sửa ngay trong quá trình thực hành.",
              cta: "Thử ngay",
            },
          ].map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-zinc-800 bg-[#1c1c1e] p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-zinc-600"
            >
              <div className="text-white font-black">{card.title}</div>
              <p className="mt-3 text-zinc-300 text-sm">{card.text}</p>
              <a
                href="#"
                className="mt-5 inline-flex items-center justify-center rounded-2xl bg-[#d67b7b] hover:bg-[#c96b6b] transition-colors text-white font-bold px-5 py-2.5"
              >
                {card.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-800 bg-[#1c1c1e] p-6 sm:p-10">
        <h3 className="text-white font-black text-2xl">Tại sao nên chọn ByeByeHSK?</h3>
        <p className="mt-2 text-zinc-300">Tính năng ưu việt giúp việc học tiếng Trung trở nên dễ dàng và hiệu quả</p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              t: "Luyện Nghe Đa Giọng",
              d: "Làm quen với nhiều chất giọng (Bắc Kinh, Đài Loan, giọng địa phương) để không bỡ ngỡ thực tế.",
            },
            {
              t: "Luyện Nói Chuẩn Thanh Điệu",
              d: "Chấm điểm phát âm chính xác từng thanh mẫu, vận mẫu và thanh điệu (1, 2, 3, 4).",
            },
            {
              t: "Ghi Nhớ Chữ Hán Sâu",
              d: "Kết hợp nghe - viết giúp ghi nhớ mặt chữ và bộ thủ lâu hơn 5 lần so với cách học vẹt.",
            },
            {
              t: "Bám Sát Mục Tiêu HSK",
              d: "Hệ thống báo cáo tiến độ chi tiết được thiết kế riêng cho người luyện thi HSK và TOCFL.",
            },
          ].map((x) => (
            <div key={x.t} className="rounded-2xl border border-zinc-800 bg-[#141416]/30 p-5 transition-transform duration-300 hover:-translate-y-1 hover:border-zinc-600">
              <div className="text-white font-black">{x.t}</div>
              <div className="mt-3 text-zinc-400 text-sm">{x.d}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function Landing() {
  return <MainSection />;
}



