import { Award, Gift, ShoppingBag, Ticket, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface RewardsScreenProps {
  points: number;
}

const REWARDS = [
  { name: "₹50 Grocery Coupon", cost: 500, icon: ShoppingBag },
  { name: "Free Bus Pass (1 Day)", cost: 300, icon: Ticket },
  { name: "Eco Store Discount 20%", cost: 200, icon: Gift },
  { name: "Plant a Tree Certificate", cost: 150, icon: Star },
];

const RewardsScreen = ({ points }: RewardsScreenProps) => {
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
              <span>Level: Eco Warrior</span>
              <span>Next: 1500 pts</span>
            </div>
            <Progress value={(points / 1500) * 100} className="h-2" />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Earn 250 more points to reach <span className="font-semibold text-primary">Green Champion</span>
          </p>
        </motion.div>

        {/* Rewards list */}
        <h3 className="text-sm font-semibold text-foreground mb-3">Redeem Points</h3>
        <div className="space-y-3">
          {REWARDS.map((reward, i) => (
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
                variant={points >= reward.cost ? "default" : "outline"}
                className="rounded-xl text-xs"
                disabled={points < reward.cost}
              >
                {points >= reward.cost ? "Redeem" : "Locked"}
              </Button>
            </motion.div>
          ))}
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
