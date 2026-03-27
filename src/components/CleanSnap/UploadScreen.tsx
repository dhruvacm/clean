import { useState, useCallback } from "react";
import { Camera, Upload, CheckCircle2, XCircle, MapPin, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Step = "upload" | "detecting" | "result" | "location" | "success";

interface UploadScreenProps {
  onComplete: (pts: number) => void;
}

const STEPS = ["Upload", "Detect", "Submit"];

const UploadScreen = ({ onComplete }: UploadScreenProps) => {
  const [step, setStep] = useState<Step>("upload");
  const [image, setImage] = useState<string | null>(null);
  const [detected, setDetected] = useState(true);
  const [location, setLocation] = useState("Auto-detecting location...");

  const currentStepIndex = (() => {
    if (step === "upload") return 0;
    if (step === "detecting" || step === "result") return 1;
    return 2;
  })();

  const handleFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setImage(e.target?.result as string);
      setStep("detecting");
      // Simulate AI detection
      setTimeout(() => {
        setDetected(Math.random() > 0.2);
        setStep("result");
      }, 2000);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleProceed = () => {
    setLocation("MG Road, Sector 14, Gurugram");
    setStep("location");
  };

  const handleSubmit = () => {
    setStep("success");
    setTimeout(() => onComplete(50), 2500);
  };

  const handleReset = () => {
    setStep("upload");
    setImage(null);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 max-w-lg mx-auto">
      {/* Progress */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center justify-center gap-2 mb-8"
      >
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-colors ${
                i <= currentStepIndex
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`text-xs font-medium ${
                i <= currentStepIndex ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {s}
            </span>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 h-0.5 rounded ${
                  i < currentStepIndex ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        ))}
      </motion.div>

      <AnimatePresence mode="wait">
        {/* UPLOAD */}
        {step === "upload" && (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="glass-card-elevated border-2 border-dashed border-primary/30 rounded-2xl p-10 text-center cursor-pointer hover:border-primary/60 transition-colors"
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload size={28} className="text-primary" />
              </div>
              <h2 className="text-lg font-bold text-foreground mb-1">Upload a Photo</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Drag & drop or tap to select
              </p>
              <div className="flex items-center justify-center gap-3">
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                  <Camera size={14} />
                  Camera
                </Button>
                <Button variant="outline" size="sm" className="rounded-xl gap-1.5">
                  <Upload size={14} />
                  Gallery
                </Button>
              </div>
              <input
                id="file-input"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>
          </motion.div>
        )}

        {/* DETECTING */}
        {step === "detecting" && (
          <motion.div
            key="detecting"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-elevated p-6 text-center"
          >
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-48 object-cover rounded-xl mb-5"
              />
            )}
            <div className="relative w-16 h-16 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              <Loader2 size={24} className="absolute inset-0 m-auto text-primary animate-spin" />
            </div>
            <h2 className="text-lg font-bold text-foreground mb-1">Analyzing Image...</h2>
            <p className="text-sm text-muted-foreground">AI is scanning for garbage</p>
          </motion.div>
        )}

        {/* RESULT */}
        {step === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card-elevated p-6 text-center"
          >
            {image && (
              <img
                src={image}
                alt="Uploaded"
                className="w-full h-48 object-cover rounded-xl mb-5"
              />
            )}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="mb-4"
            >
              {detected ? (
                <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-xl">
                  <CheckCircle2 size={20} />
                  <span className="font-semibold">Garbage Detected ✅</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-destructive/10 text-destructive px-4 py-2 rounded-xl">
                  <XCircle size={20} />
                  <span className="font-semibold">No Garbage Found ❌</span>
                </div>
              )}
            </motion.div>
            <p className="text-sm text-muted-foreground mb-5">
              {detected
                ? "We found waste in this image. Proceed to report it!"
                : "This image doesn't seem to contain garbage. Try another photo."}
            </p>
            {detected ? (
              <Button
                onClick={handleProceed}
                className="gradient-hero border-0 text-primary-foreground rounded-xl px-8 gap-2"
              >
                <MapPin size={16} />
                Add Location & Submit
              </Button>
            ) : (
              <Button onClick={handleReset} variant="outline" className="rounded-xl">
                Try Another Photo
              </Button>
            )}
          </motion.div>
        )}

        {/* LOCATION */}
        {step === "location" && (
          <motion.div
            key="location"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card-elevated p-6"
          >
            <h2 className="text-lg font-bold text-foreground mb-4 text-center">
              Confirm Location
            </h2>
            {/* Map placeholder */}
            <div className="w-full h-40 rounded-xl bg-secondary flex items-center justify-center mb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
              <div className="text-center z-10">
                <MapPin size={28} className="text-primary mx-auto mb-1" />
                <p className="text-xs font-medium text-secondary-foreground">Map Preview</p>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">
                Location
              </label>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="rounded-xl"
              />
            </div>
            <Button
              onClick={handleSubmit}
              className="w-full gradient-hero border-0 text-primary-foreground rounded-xl gap-2"
            >
              <Send size={16} />
              Submit Report
            </Button>
          </motion.div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card-elevated p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 size={40} className="text-primary" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl font-bold text-foreground mb-2"
            >
              Report Sent Successfully! 🎉
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-sm text-muted-foreground mb-4"
            >
              Report sent to municipality successfully
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.8, type: "spring" }}
              className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2.5 rounded-xl"
            >
              <span className="text-2xl font-bold">+50</span>
              <span className="text-sm font-medium">Clean Points earned!</span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UploadScreen;
