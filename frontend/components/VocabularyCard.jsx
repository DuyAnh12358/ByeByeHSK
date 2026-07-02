// components/VocabularyCard.jsx
// Card hiển thị 1 từ vựng (chữ Hán giản thể, pinyin, nghĩa...) dùng daisyUI
// Mỗi phần được cấp 1 chỗ cố định (fixed height / min-height), có hay không có
// dữ liệu thì vị trí các phần khác vẫn không bị xê dịch.

import { useState } from "react";

export default function VocabularyCard({ vocabulary }) {
  const {
    simplified,
    traditional,
    pinyin,
    pinyin_unsigned,
    meaning_vi,
    level,
    examples = [],
  } = vocabulary;

  const hasTraditional = Boolean(traditional && traditional !== simplified);
  const modalId = `vocab-modal-${simplified || "item"}`;

  // Tab đang chọn trong dialog: xem chữ giản thể hay phồn thể
  const [activeScript, setActiveScript] = useState("simplified");

  const openModal = () => {
    setActiveScript("simplified"); // luôn mở lại từ giản thể cho nhất quán
    const dialog = document.getElementById(modalId);
    if (dialog) {
      dialog.showModal();
    }
  };

  const displayedChar =
    activeScript === "traditional" && hasTraditional ? traditional : simplified;

  return (
    <div
      className="card h-full border-3 border-zinc-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={openModal}
    >
      <div className="card-body flex flex-col gap-2 p-5">
        {/* Header: chữ Hán + badge cấp độ - luôn ở vị trí đầu tiên, cao cố định */}
        <div className="flex h-11 items-start justify-between">
          <h2 className="text-4xl font-bold leading-none tracking-tight">
            {simplified}
          </h2>
          {level && (
            <span className="badge badge-error badge-outline shrink-0">
              {level}
            </span>
          )}
        </div>

        {/* Phồn thể - luôn chiếm 1 dòng cố định (h-4), rỗng thì ẩn chữ chứ không bỏ dòng */}
        <p
          className={`h-4 text-xs text-base-content/50 ${
            hasTraditional ? "" : "invisible"
          }`}
        >
          Phồn thể: {traditional}
        </p>

        {/* Pinyin - luôn chiếm 1 dòng cố định (h-7) */}
        <p
          className={`h-7 text-lg font-medium text-[#d67b7b] ${
            pinyin ? "" : "invisible"
          }`}
        >
          {pinyin}
        </p>

        <div className="divider my-0" />
      </div>

      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-md text-center" onClick={(e) => e.stopPropagation()}>
          {/* Tab chọn Giản thể / Phồn thể - chỉ hiện nếu từ này có cả 2 dạng */}
          {hasTraditional && (
            <div className="tabs tabs-boxed inline-flex justify-center mb-4">
              <button
                type="button"
                className={`tab ${activeScript === "simplified" ? "tab-active" : ""}`}
                onClick={() => setActiveScript("simplified")}
              >
                Giản thể
              </button>
              <button
                type="button"
                className={`tab ${activeScript === "traditional" ? "tab-active" : ""}`}
                onClick={() => setActiveScript("traditional")}
              >
                Phồn thể
              </button>
            </div>
          )}

          {/* Chữ Hán to, ngay chính giữa đầu dialog */}
          <h3 className="text-8xl font-bold leading-none">{displayedChar}</h3>

          {/* Pinyin / pinyin không dấu / nghĩa - chỉ 3 thông tin này */}
          <div className="mt-5 flex flex-col items-center gap-1">
            <p className="text-xl font-medium text-[#d67b7b]">
              {pinyin || "—"}
            </p>
            {pinyin_unsigned && (
              <p className="text-sm text-base-content/50">
                {pinyin_unsigned}
              </p>
            )}
            <p className="mt-2 text-base text-base-content/90">
              {meaning_vi || "Chưa có nghĩa"}
            </p>
          </div>

          {/* Ví dụ (nếu có) */}
          {examples.length > 0 && (
            <div className="mt-6 text-left">
              <h4 className="mb-3 text-lg font-semibold">Ví dụ</h4>
              <div className="space-y-3">
                {examples.map((item, index) => (
                  <div
                    key={`${item.zh || index}-${index}`}
                    className="rounded-xl border border-base-300 p-3"
                  >
                    <p className="font-semibold">{item.zh || "—"}</p>
                    <p className="text-sm text-[#d67b7b]">{item.pinyin || "—"}</p>
                    <p className="text-sm">{item.vi || "—"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="modal-action justify-center">
            <form method="dialog">
              <button className="btn">Đóng</button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}