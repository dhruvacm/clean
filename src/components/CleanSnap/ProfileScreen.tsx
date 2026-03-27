import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, LogOut, Save, Mail, Award } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface ProfileScreenProps {
  points: number;
}

const ProfileScreen = ({ points }: ProfileScreenProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, bio")
      .eq("user_id", user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setDisplayName(data.display_name || "");
          setBio(data.bio || "");
        }
      });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({ display_name: displayName, bio })
      .eq("user_id", user.id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Profile updated!" });
    }
    setSaving(false);
  };

  const initials = displayName
    ? displayName.slice(0, 2).toUpperCase()
    : (user?.email?.slice(0, 2).toUpperCase() ?? "U");

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center gap-2 mb-6">
          <User size={22} className="text-primary" />
          <h1 className="text-xl font-bold text-foreground">Profile</h1>
        </div>

        {/* Avatar & Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card-elevated p-6 mb-6 flex flex-col items-center"
        >
          <Avatar className="w-20 h-20 mb-3">
            <AvatarFallback className="text-xl font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <p className="text-lg font-bold text-foreground">{displayName || "User"}</p>
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Mail size={14} /> {user?.email}
          </p>
          <div className="flex items-center gap-1 mt-2 px-3 py-1 rounded-full bg-primary/10">
            <Award size={14} className="text-primary" />
            <span className="text-sm font-semibold text-primary">{points} pts</span>
          </div>
        </motion.div>

        {/* Edit form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 space-y-4 mb-4"
        >
          <div>
            <Label className="text-xs text-muted-foreground">Display Name</Label>
            <Input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Bio</Label>
            <Input
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself"
              className="mt-1"
            />
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full gradient-hero border-0 text-primary-foreground font-semibold rounded-xl gap-2"
          >
            <Save size={16} />
            {saving ? "Saving..." : "Save Profile"}
          </Button>
        </motion.div>

        {/* Sign out */}
        <Button
          variant="outline"
          onClick={signOut}
          className="w-full rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive/10"
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;
