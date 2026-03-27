import { Trophy, Medal, Crown } from "lucide-react";
import { motion } from "framer-motion";

const USERS = [
  { name: "Priya Sharma", pts: 2450, avatar: "PS" },
  { name: "Arjun Mehta", pts: 2100, avatar: "AM" },
  { name: "Sneha Patel", pts: 1800, avatar: "SP" },
  { name: "You", pts: 1250, avatar: "YO", isUser: true },
  { name: "Ravi Kumar", pts: 1100, avatar: "RK" },
  { name: "Neha Gupta", pts: 950, avatar: "NG" },
  { name: "Vikram Singh", pts: 820, avatar: "VS" },
];

const rankIcon = (i: number) => {
  if (i === 0) return <Crown size={16} className="text-gold" />;
  if (i === 1) return <Medal size={16} className="text-silver" />;
  if (i === 2) return <Medal size={16} className="text-bronze" />;
  return null;
};

const LeaderboardScreen = () => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={22} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Leaderboard</h1>
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-3 mb-8">
          {[1, 0, 2].map((idx) => {
            const user = USERS[idx];
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
                  {user.avatar}
                </div>
                <p className="text-xs font-semibold text-foreground mb-0.5">{user.name}</p>
                <p className="text-xs text-primary font-bold mb-2">{user.pts} pts</p>
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

        {/* Full list */}
        <div className="glass-card overflow-hidden">
          {USERS.map((user, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 ${
                user.isUser ? "bg-primary/5" : ""
              }`}
            >
              <span className="w-6 text-sm font-bold text-muted-foreground text-center">
                {i + 1}
              </span>
              <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-secondary-foreground">
                {user.avatar}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${user.isUser ? "text-primary font-bold" : "text-foreground"}`}>
                  {user.name} {user.isUser && "(You)"}
                </p>
              </div>
              {rankIcon(i)}
              <span className="text-sm font-semibold text-primary">{user.pts}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default LeaderboardScreen;
