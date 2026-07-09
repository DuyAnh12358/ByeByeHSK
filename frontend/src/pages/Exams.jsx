import { useState, useMemo, useEffect } from "react";
import ExamsHero from "../../components/exams/ExamsHero";
import LevelTabs from "../../components/exams/LevelTabs";
import ModeToggle from "../../components/exams/ModeToggle";
import ExamCard from "../../components/exams/ExamCard";
import SkillPracticeGrid from "../../components/exams/SkillPracticeGrid";
import { getExamsForLevel, mergeExamAttempts } from "../../src/data/examsData";
import { useParams } from "react-router-dom";
import { apiGet } from "../utils/api";

export default function Exams() {
  const [level, setLevel] = useState(3);
  const [mode, setMode] = useState("full");
  const [attemptsByExamNumber, setAttemptsByExamNumber] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);
  const params = useParams();

  useEffect(() => {
    if (params.level) {
      const num = Number(params.level);
      if (!isNaN(num)) setLevel(num);
    }
  }, [params.level]);

  const baseExams = useMemo(() => getExamsForLevel(level), [level]);
  const questionCounts = baseExams[0]?.skills;

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoadingStats(true);
      try {
        const json = await apiGet(`/api/exams/stats?level=${level}`);
        if (cancelled) return;

        const byExamNumber = {};
        for (const item of json?.data ?? []) {
          byExamNumber[item.examNumber] = item;
        }
        setAttemptsByExamNumber(byExamNumber);
      } catch (e) {
        if (cancelled) return;
        setAttemptsByExamNumber(null);
      } finally {
        if (cancelled) return;
        setLoadingStats(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [level]);

  const exams = useMemo(() => {
    const merged = mergeExamAttempts(baseExams, attemptsByExamNumber);
    // Sort đề ít lượt làm hơn lên trước
    return merged.slice().sort((a, b) => {
      const aa = a?.attempt?.attempts ?? 0;
      const bb = b?.attempt?.attempts ?? 0;
      return aa - bb;
    });
  }, [baseExams, attemptsByExamNumber]);


  return (
    <div className="px-4 sm:px-6 py-6 flex flex-col gap-6">
      <ExamsHero />
      <LevelTabs selected={level} onSelect={setLevel} />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-white font-bold text-lg">
          HSK {level}{" "}
          <span className="text-[#a0a0a5] font-medium text-sm">
            · {exams.length} đề khả dụng
          </span>
        </h3>
        <ModeToggle mode={mode} onChange={setMode} />
      </div>

      {mode === "full" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
          {exams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} loadingStats={loadingStats} />
          ))}
        </div>
      ) : (
        <SkillPracticeGrid
          level={level}
          examNumber={exams?.[0]?.examNumber ?? 1}
          questionCounts={questionCounts}
        />
      )}

    </div>
  );
}

