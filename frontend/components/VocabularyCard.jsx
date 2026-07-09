// components/VocabularyCard.jsx
// Card hiển thị 1 từ vựng (chữ Hán giản thể, pinyin, nghĩa...) dùng daisyUI
// Mỗi phần được cấp 1 chỗ cố định (fixed height / min-height), có hay không có
// dữ liệu thì vị trí các phần khác vẫn không bị xê dịch.

import { useMemo, useState } from "react";
import { useAudioPlayer } from "./useAudioPlayer";

export default function VocabularyCard({ vocabulary }) {
  const {
    simplified,
    traditional,
    pinyin,
    pinyin_unsigned,
    meaning_vi,
    level,
    examples = [],
    audio_url, // từ API trả về
  } = vocabulary;

  const hasTraditional = Boolean(traditional && traditional !== simplified);
  const modalId = `vocab-modal-${simplified || "item"}`;

  // Tab đang chọn trong dialog: xem chữ giản thể hay phồn thể
  const [activeScript, setActiveScript] = useState("simplified");

  const { play } = useAudioPlayer();

  const openModal = () => {
    setActiveScript("simplified"); // luôn mở lại từ giản thể cho nhất quán
    const dialog = document.getElementById(modalId);
    if (dialog) dialog.showModal();
  };

  const resolvedAudioUrl = useMemo(() => {
    if (!audio_url) return "";
    // Nếu API trả về đường dẫn tương đối, đảm bảo format chuẩn.
    // fetch/Audio đều hoạt động tốt với url tuyệt đối.
    if (audio_url.startsWith("http://") || audio_url.startsWith("https://")) {
      return audio_url;
    }
    if (audio_url.startsWith("/")) return audio_url;
    return `/${audio_url}`;
  }, [audio_url]);

  // Phát âm khi bấm nút loa
  const handlePlayAudio = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!resolvedAudioUrl) return;

    try {
      await play(resolvedAudioUrl, { text: simplified, lang: "zh-CN" });
    } catch (err) {
      console.error("❌ Lỗi không thể phát âm thanh từ vựng:", err);
      // Có thể do audio_url trả về JSON lỗi hoặc endpoint không tồn tại.
      // Không throw để tránh làm vỡ UI.
    }
  };

  const displayedChar =
    activeScript === "traditional" && hasTraditional
      ? traditional
      : simplified;

  return (
    <div
      className="card h-full border-3 border-zinc-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
      onClick={openModal}
    >
      <div className="card-body flex flex-col gap-2 p-5">
        <div className="flex h-11 items-start justify-between">
          <div className="flex-1">
            <h2 className="text-4xl font-bold leading-none tracking-tight">
              {simplified}
            </h2>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {!!resolvedAudioUrl && (
              <button
                type="button"
                onClick={handlePlayAudio}
                className="btn btn-ghost btn-circle btn-xs text-[#d67b7b] hover:bg-base-200 transition-colors"
                title="Nghe phát âm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                  />
                </svg>
              </button>
            )}
            {level && (
              <span className="badge badge-error badge-outline shrink-0">
                {level}
              </span>
            )}
          </div>
        </div>

        <p
          className={`h-4 text-xs text-base-content/50 ${
            hasTraditional ? "" : "invisible"
          }`}
        >
          Phồn thể: {traditional}
        </p>

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
        <div
          className="modal-box max-w-md text-center"
          onClick={(e) => e.stopPropagation()}
        >
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

          <h3 className="text-8xl font-bold leading-none">{displayedChar}</h3>

          <div className="mt-5 flex flex-col items-center gap-1">
            <div className="flex items-center justify-center gap-2">
              <p className="text-xl font-medium text-[#d67b7b]">
                {pinyin || "—"}
              </p>
              {!!resolvedAudioUrl && (
                <button
                  type="button"
                  onClick={handlePlayAudio}
                  className="btn btn-ghost btn-circle btn-xs text-[#d67b7b] hover:bg-base-200 transition-colors"
                  title="Nghe phát âm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.009 9.009 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z"
                    />
                  </svg>
                </button>
              )}
            </div>

            {pinyin_unsigned && (
              <p className="text-sm text-base-content/50">{pinyin_unsigned}</p>
            )}
            <p className="mt-2 text-base text-base-content/90">
              {meaning_vi || "Chưa có nghĩa"}
            </p>
          </div>

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
                    <p className="text-sm text-[#d67b7b]">
                      {item.pinyin || "—"}
                    </p>
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

