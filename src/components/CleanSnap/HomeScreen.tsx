import { Camera, Leaf, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-illustration.png";

interface HomeScreenProps {
  points: number;
  reportsToday: number;
  onUpload: () => void;
}

const HomeScreen = ({ points, reportsToday, onUpload }: HomeScreenProps) => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-hero flex items-center justify-center">
            <Leaf size={18} className="text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">CleanSnap</span>
        </div>
        <div className="glass-card px-3 py-1.5 flex items-center gap-1.5">
          <span className="text-sm font-semibold text-primary">{points}</span>
          <span className="text-xs text-muted-foreground">pts</span>
        </div>
      </motion.div>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card-elevated p-6 mb-5 text-center"
      >
        <img
          src={heroImg}
          alt="CleanSnap hero"
          width={800}
          height={600}
          className="w-48 h-auto mx-auto mb-4"
        />
        <h1 className="text-2xl font-extrabold text-foreground leading-tight mb-2">
          Turn your city cleaner
          <br />
          <span className="text-gradient">with one photo</span>
        </h1>
        <p className="text-sm text-muted-foreground mb-5">
          Snap garbage, report it, earn rewards. Be the change.
        </p>
        <Button
          onClick={onUpload}
          size="lg"
          className="gradient-hero border-0 text-primary-foreground font-semibold rounded-xl px-8 gap-2 hover-lift"
        >
          <Camera size={18} />
          Upload Image
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 gap-3 mb-5"
      >
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Camera size={16} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Total</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{reportsToday}</p>
          <p className="text-xs text-muted-foreground">Reports submitted</p>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <TrendingUp size={16} className="text-primary" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">Points</span>
          </div>
          <p className="text-2xl font-bold text-foreground">{points}</p>
          <p className="text-xs text-muted-foreground">Clean Points earned</p>
        </div>
      </motion.div>
    </div>
  );
};

export default HomeScreen;
