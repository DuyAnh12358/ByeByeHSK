import { useEffect, useState } from "react";
import PageTitle from "../../../../components/PageTitle";
import HomeLayout from "../../../../layouts/HomeLayout";
import VocabularyCard from "../../../../components/VocabularyCard";

export default function VocabularyHSK2() {
  const [vocabularies, setVocabularies] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchVocabularies() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `/api/vocabularies/level/hsk2?page=${page}&limit=20`,
          { signal: controller.signal },
        );
        const json = await res.json();

        if (!json.success) {
          throw new Error(json.message || "Không thể tải từ vựng HSK2.");
        }

        setVocabularies(json.data);
        setPagination(json.pagination);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchVocabularies();
    return () => controller.abort();
  }, [page]);

  return (
    <HomeLayout>
      <PageTitle
        title="Từ vựng HSK2"
        subtitle="Danh sách từ vựng cấp độ HSK2 có sẵn"
      />

      <div className="px-4 py-6">
        {/* Trạng thái loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <span className="loading loading-spinner loading-lg text-primary" />
          </div>
        )}

        {/* Trạng thái lỗi */}
        {!loading && error && (
          <div className="alert alert-error max-w-xl mx-auto">
            <span>{error}</span>
          </div>
        )}

        {/* Trạng thái rỗng */}
        {!loading && !error && vocabularies.length === 0 && (
          <p className="text-center text-base-content/60 py-10">
            Chưa có từ vựng nào cho cấp độ HSK2.
          </p>
        )}

        {/* Danh sách từ vựng */}
        {!loading && !error && vocabularies.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vocabularies.map((vocab) => (
                <VocabularyCard key={vocab._id} vocabulary={vocab} />
              ))}
            </div>

            {/* Phân trang */}
            {pagination && pagination.totalPages > 1 && (
              <div className="join flex justify-center mt-8">
                <button
                  type="button"
                  className="join-item btn"
                  disabled={pagination.currentPage <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  «
                </button>
                <button type="button" className="join-item btn pointer-events-none">
                  Trang {pagination.currentPage} / {pagination.totalPages}
                </button>
                <button
                  type="button"
                  className="join-item btn"
                  disabled={pagination.currentPage >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  »
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </HomeLayout>
  );
}

