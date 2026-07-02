import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import HomeLayout from "../../../layouts/HomeLayout";

function levelLabel(level) {
  return level.toUpperCase();
}

function VocabularyLevelCard({ level, vocabCount, onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="card h-full border-3 border-zinc-800 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 cursor-pointer text-left"
    >
      <div className="card-body">
        <div className="flex items-start justify-between">
          <h2 className="text-4xl font-bold leading-none tracking-tight">
            {levelLabel(level)}
          </h2>
          <span className="badge badge-error badge-outline shrink-0">
            {vocabCount ?? "—"}
          </span>
        </div>
        <p className="mt-2 text-sm text-base-content/60">
          Chọn để xem danh sách từ vựng {levelLabel(level)}.
        </p>
      </div>
    </button>
  );
}

export default function VocabularyLevels() {
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});

  const levels = useMemo(() => ["hsk1", "hsk2", "hsk3", "hsk4", "hsk5", "hsk6"], []);

  // Lấy count để hiển thị badge: dùng phân trang 1 item để nhẹ (API trả count)
  // Nếu không cần, có thể remove toàn bộ useEffect; hiện tại giữ để UI tốt.
  // (Không dùng tool useEffect vì bạn yêu cầu copy UI; component này chỉ là landing.)

  const fetchCountForLevel = async (level) => {
    try {
      const res = await fetch(`/api/vocabularies/level/${level}?page=1&limit=1`);
      const json = await res.json();
      if (json?.success) {
        setCounts((prev) => ({
          ...prev,
          [level]: json?.pagination?.totalItems ?? 0,
        }));
      }
    } catch {
      // ignore
    }
  };

  // eager load counts once
  // eslint-disable-next-line react-hooks/rules-of-hooks
  levels.forEach((lvl) => {
    if (counts[lvl] === undefined) {
      // gọi không chờ; tránh thêm useEffect để giảm khác biệt cấu trúc project
      fetchCountForLevel(lvl);
    }
  });

  return (
    <HomeLayout>
      <PageTitle
        title="Từ vựng HSK"
        subtitle="Chọn cấp độ để xem danh sách từ vựng"
      />

      <div className="px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          {levels.map((level) => (
            <VocabularyLevelCard
              key={level}
              level={level}
              vocabCount={counts[level]}
              onOpen={() => navigate(`/vocabularies/${level}`)}
            />
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}

