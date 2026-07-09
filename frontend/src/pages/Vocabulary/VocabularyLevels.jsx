import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageTitle from "../../../components/PageTitle";
import HomeLayout from "../../../layouts/HomeLayout";
import VocabularyCard from "../../../components/VocabularyCard";

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

  // Search state
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const levels = useMemo(
    () => ["hsk1", "hsk2", "hsk3", "hsk4", "hsk5", "hsk6"],
    [],
  );

  const fetchCountForLevel = async (level, signal) => {
    try {
      const res = await fetch(
        `/api/vocabularies/level/${level}?page=1&limit=1`,
        { signal },
      );
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

  // Lấy count cho từng level - chạy đúng 1 lần lúc mount
  useEffect(() => {
    const controller = new AbortController();
    levels.forEach((lvl) => fetchCountForLevel(lvl, controller.signal));
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tìm kiếm từ vựng (debounce 400ms), không giới hạn theo cấp độ
  useEffect(() => {
    const trimmed = query.trim();

    if (!trimmed) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const controller = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/vocabularies/search?q=${encodeURIComponent(trimmed)}&limit=24`,
          { signal: controller.signal },
        );
        const json = await res.json();
        setResults(json?.success ? json.data : []);
      } catch (err) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query]);

  const isSearching = query.trim().length > 0;

  return (
    <HomeLayout>
      <PageTitle
        title="Từ vựng HSK"
        subtitle="Chọn cấp độ hoặc tìm nhanh 1 từ vựng bất kỳ"
      />

      <div className="px-4 pt-6 w-full">
        {/* Thanh tìm kiếm - gõ chữ Hán, pinyin, hoặc nghĩa đều tìm được, không cần biết trước cấp độ */}
        <label className="input rounded-lg outline-none flex items-center gap-2 w-full max-w-md mx-auto mb-8">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="h-4 w-4 opacity-60"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Tìm từ vựng theo chữ Hán, pinyin hoặc nghĩa..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="btn btn-ghost btn-xs btn-circle"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </label>
      </div>

      <div className="px-4 pb-6">
        {isSearching ? (
          <>
            {searching && (
              <div className="flex justify-center py-10">
                <span className="loading loading-spinner loading-lg text-primary" />
              </div>
            )}

            {!searching && results.length === 0 && (
              <p className="text-center text-base-content/60 py-10">
                Không tìm thấy từ nào khớp với "{query.trim()}".
              </p>
            )}

            {!searching && results.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {results.map((vocab) => (
                  <VocabularyCard key={vocab._id} vocabulary={vocab} />
                ))}
              </div>
            )}
          </>
        ) : (
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
        )}
      </div>
    </HomeLayout>
  );
}