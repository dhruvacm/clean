import { useState, useEffect, useCallback } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
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
  const [points, setPoints] = useState(0);
  const [reportsToday, setReportsToday] = useState(0);

  // Fetch user's points from profile
  useEffect(() => {
    if (!session?.user?.id) return;
    const fetchProfile = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("points, reports_count")
        .eq("user_id", session.user.id)
        .single();
      if (data) {
        setPoints(data.points ?? 0);
        setReportsToday(data.reports_count ?? 0);
      }
    };
    fetchProfile();
  }, [session?.user?.id, tab]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return <Navigate to="/auth" replace />;

  const handleUploadComplete = async (pts: number) => {
    const newPoints = points + pts;
    const newReports = reportsToday + 1;
    setPoints(newPoints);
    setReportsToday(newReports);

    await supabase
      .from("profiles")
      .update({ points: newPoints, reports_count: newReports })
      .eq("user_id", session.user.id);

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
          {tab === "leaderboard" && <LeaderboardScreen currentUserId={session.user.id} />}
          {tab === "rewards" && <RewardsScreen points={points} onPointsUpdate={(p) => setPoints(p)} />}
          {tab === "profile" && <ProfileScreen points={points} />}
        </motion.div>
      </AnimatePresence>
      <BottomNav active={tab} onChange={setTab} />
    </div>
  );
};

export default Index;
