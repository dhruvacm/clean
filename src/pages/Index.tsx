import { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import BottomNav from "@/components/CleanSnap/BottomNav";
import HomeScreen from "@/components/CleanSnap/HomeScreen";
import UploadScreen from "@/components/CleanSnap/UploadScreen";
import LeaderboardScreen from "@/components/CleanSnap/LeaderboardScreen";
import RewardsScreen from "@/components/CleanSnap/RewardsScreen";
import ProfileScreen from "@/components/CleanSnap/ProfileScreen";
import { AnimatePresence, motion } from "framer-motion";

type Tab = "home" | "upload" | "leaderboard" | "rewards" | "profile";

const Index = () => {
  const { session, loading } = useAuth();
  const [tab, setTab] = useState<Tab>("home");
  const [points, setPoints] = useState(1250);
  const [reportsToday, setReportsToday] = useState(2);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  const handleUploadComplete = (pts: number) => {
    setPoints((p) => p + pts);
    setReportsToday((r) => r + 1);
    setTimeout(() => setTab("rewards"), 500);
  };

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
          {tab === "profile" && <ProfileScreen points={points} />}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
