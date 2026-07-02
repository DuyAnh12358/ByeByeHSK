import HeroGreeting from "../../components/home/HeroGreeting";
import StreakStats from "../../components/home/StreakStats";
import DailyMissions from "../../components/home/DailyMissions";
import LearningPath from "../../components/home/LearningPath";
import LeaderboardTeaser from "../../components/home/LeaderboardTeaser";

export default function Home() {
  return (
    <div className="px-4 sm:px-6 py-6 flex flex-col gap-6">
      <HeroGreeting />
      <StreakStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột chính: lộ trình học + nhiệm vụ */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          <LearningPath />
          <DailyMissions />
        </div>

        {/* Cột phụ: bảng xếp hạng */}
        <div className="flex flex-col gap-6">
          <LeaderboardTeaser />
        </div>
      </div>
    </div>
  );
}