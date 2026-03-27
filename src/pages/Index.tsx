import { useState, useCallback } from "react";
import BottomNav from "@/components/CleanSnap/BottomNav";
import HomeScreen from "@/components/CleanSnap/HomeScreen";
import UploadScreen from "@/components/CleanSnap/UploadScreen";
import LeaderboardScreen from "@/components/CleanSnap/LeaderboardScreen";
import RewardsScreen from "@/components/CleanSnap/RewardsScreen";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "home" | "upload" | "leaderboard" | "rewards";

const Index = () => {
  const [tab, setTab] = useState<Tab>("home");
  const [points, setPoints] = useState(1250);
  const [reportsToday, setReportsToday] = useState(2);

  const handleUploadComplete = useCallback((pts: number) => {
    setPoints((p) => p + pts);
    setReportsToday((r) => r + 1);
    setTimeout(() => setTab("rewards"), 500);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "home" && (
            <HomeScreen
              points={points}
              reportsToday={reportsToday}
              onUpload={() => setTab("upload")}
            />
          )}
          {tab === "upload" && <UploadScreen onComplete={handleUploadComplete} />}
          {tab === "leaderboard" && <LeaderboardScreen />}
          {tab === "rewards" && <RewardsScreen points={points} />}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
