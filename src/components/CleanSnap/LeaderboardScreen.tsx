import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface LeaderboardUser {
  user_id: string;
  display_name: string | null;
  points: number;
}

interface LeaderboardScreenProps {
  currentUserId: string;
}

const rankIcon = (i: number) => {
  if (i === 0) return <Crown size={16} className="text-yellow-500" />;
  if (i === 1) return <Medal size={16} className="text-gray-400" />;
  if (i === 2) return <Medal size={16} className="text-amber-600" />;
  return null;
};

const getInitials = (name: string | null) => {
  if (!name) return "??";
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const LeaderboardScreen = ({ currentUserId }: LeaderboardScreenProps) => {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("user_id, display_name, points")
        .order("points", { ascending: false })
        .limit(20);
      setUsers((data as LeaderboardUser[]) ?? []);
      setLoading(false);
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const top3 = users.slice(0, 3);

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={22} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
        </div>

        {/* Top 3 podium */}
        {top3.length >= 3 && (
          <div className="flex items-end justify-center gap-3 mb-8">
            {[1, 0, 2].map((idx) => {
              const user = top3[idx];
              const isCurrentUser = user.user_id === currentUserId;
              const height = idx === 0 ? "h-28" : idx === 1 ? "h-22" : "h-18";
              const size = idx === 0 ? "w-16 h-16 text-lg" : "w-12 h-12 text-sm";
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.15 }}
                  className="flex flex-col items-center"
                >
                  <div
                    className={`${size} rounded-full gradient-hero flex items-center justify-center font-bold text-primary-foreground mb-2`}
                  >
                    {getInitials(user.display_name)}
                  </div>
                  <p className={`text-xs font-semibold mb-0.5 ${isCurrentUser ? "text-primary" : "text-foreground"}`}>
                    {user.display_name || "Anonymous"} {isCurrentUser && "(You)"}
                  </p>
                  <p className="text-xs text-primary font-bold mb-2">{user.points} pts</p>
                  <div
                    className={`${height} w-20 rounded-t-xl ${
                      idx === 0
                        ? "bg-gradient-to-t from-primary/20 to-primary/5"
                        : "bg-secondary"
                    } flex items-start justify-center pt-2`}
                  >
                    <span className="text-sm font-bold text-foreground">#{idx + 1}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="glass-card overflow-hidden">
          {users.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">No users yet. Be the first to earn points!</p>
          )}
          {users.map((user, i) => {
            const isCurrentUser = user.user_id === currentUserId;
            return (
              <motion.div
                key={user.user_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${
                  isCurrentUser ? "bg-primary/5" : ""
                }`}
              >
                <span className="w-6 text-sm font-bold text-muted-foreground text-center">
                  {i + 1}
                </span>
                <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                  {getInitials(user.display_name)}
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${isCurrentUser ? "text-primary font-bold" : "text-foreground"}`}>
                    {user.display_name || "Anonymous"} {isCurrentUser && "(You)"}
                  </p>
                </div>
                {rankIcon(i)}
                <span className="text-sm font-semibold text-primary">{user.points}</span>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardScreen;
