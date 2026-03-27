import { Award, Gift, ShoppingBag, Ticket, Star, Loader2, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useState } from "react";

interface RewardsScreenProps {
  points: number;
  onPointsUpdate?: (newPoints: number) => void;
}

const REWARDS = [
  { name: "₹50 Grocery Coupon", cost: 500, icon: ShoppingBag },
  { name: "Free Bus Pass (1 Day)", cost: 300, icon: Ticket },
  { name: "Eco Store Discount 20%", cost: 200, icon: Gift },
  { name: "Plant a Tree Certificate", cost: 150, icon: Star },
];

const getLevelInfo = (pts: number) => {
  if (pts >= 2000) return { name: "Eco Legend", next: null, progress: 100 };
  if (pts >= 1500) return { name: "Green Champion", next: 2000, progress: ((pts - 1500) / 500) * 100 };
  if (pts >= 500) return { name: "Eco Warrior", next: 1500, progress: ((pts - 500) / 1000) * 100 };
  if (pts >= 100) return { name: "Clean Starter", next: 500, progress: ((pts - 100) / 400) * 100 };
  return { name: "Newcomer", next: 100, progress: (pts / 100) * 100 };
};

const RewardsScreen = ({ points, onPointsUpdate }: RewardsScreenProps) => {
  const [redeeming, setRedeeming] = useState<string | null>(null);
  const level = getLevelInfo(points);

  const handleRedeem = async (reward: typeof REWARDS[0]) => {
    if (points < reward.cost) return;

    setRedeeming(reward.name);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Insert redemption record
      const { error: insertError } = await supabase.from("redemptions").insert({
        user_id: user.id,
        reward_name: reward.name,
        points_spent: reward.cost,
      } as any);

      if (insertError) throw insertError;

      // Deduct points from profile
      const newPoints = points - reward.cost;
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ points: newPoints })
        .eq("user_id", user.id);

      if (updateError) throw updateError;

      toast.success(`Redeemed "${reward.name}" for ${reward.cost} points! 🎉`);
      onPointsUpdate?.(newPoints);
    } catch (err) {
      console.error("Redemption error:", err);
      toast.error("Failed to redeem reward. Please try again.");
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-6">
          <Award size={22} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Rewards</h1>
        </div>

        {/* Points card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-6 mb-6 text-center"
        >
          <p className="text-sm text-muted-foreground mb-1">Your Clean Points</p>
          <p className="text-4xl font-extrabold text-gradient mb-3">{points}</p>
          <div className="mb-2">
            <div className="flex justify-between text-xs text-muted-foreground mb-1">
              <span>Level: {level.name}</span>
              {level.next && <span>Next: {level.next} pts</span>}
            </div>
            <Progress value={level.progress} className="h-2" />
          </div>
          {level.next && (
            <p className="text-xs text-muted-foreground mt-2">
              Earn {level.next - points} more points to reach the next level
            </p>
          )}
        </motion.div>

        {/* Rewards list */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Redeem Points</h3>
        <div className="space-y-3">
          {REWARDS.map((reward, i) => {
            const canAfford = points >= reward.cost;
            const isRedeeming = redeeming === reward.name;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card p-4 flex items-center gap-3 hover-lift"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <reward.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{reward.name}</p>
                  <p className="text-xs text-muted-foreground">{reward.cost} points</p>
                </div>
                <Button
                  size="sm"
                  variant={canAfford ? "default" : "outline"}
                  className="rounded-xl text-xs"
                  disabled={!canAfford || isRedeeming}
                  onClick={() => handleRedeem(reward)}
                >
                  {isRedeeming ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : canAfford ? (
                    "Redeem"
                  ) : (
                    "Locked"
                  )}
                </Button>
              </motion.div>
            );
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-muted-foreground mt-6"
        >
          Redeem points for discounts in government shops & partner stores
        </motion.p>
      </motion.div>
    </div>
  );
};

export default RewardsScreen;
