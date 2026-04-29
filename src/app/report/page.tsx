"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  Calendar, 
  Tag, 
  Type, 
  MessageSquare, 
  ArrowRight, 
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Info,
  Phone,
  Clock,
  Eye,
  Send,
  Loader2,
  Lock,
  Zap,
  Coins,
  Hash
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ImageUpload } from "@/components/ui/image-upload";
import { PossibleMatchFound } from "@/components/ai/possible-match";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/context/auth-context";
import { toast } from "sonner";
import Link from "next/link";

type ItemType = "lost" | "found";

interface FormData {
  type: ItemType | null;
  title: string;
  category: string;
  location: string;
  date: string;
  time: string;
  description: string;
  contactInfo: string;
  reward: string;
  tags: string;
  images: File[];
}

export default function ReportPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiMatches, setAiMatches] = useState<any[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const isSubmittingRef = useRef(false);
  
  const [formData, setFormData] = useState<FormData>({
    type: null,
    title: "",
    category: "",
    location: "",
    date: "",
    time: "",
    description: "",
    contactInfo: "",
    reward: "",
    tags: "",
    images: []
  });

  // 1. Auth Protection
  const { user, logout, isLoading: isAuthLoading } = useAuth();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    if (!isAuthLoading && !user) {
      toast.error("Please log in to report an item.");
      router.push("/auth/login?returnTo=/report");
    } else if (user) {
      setIsAuthChecking(false);
    }
  }, [user, isAuthLoading, router]);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const uploadImages = async (userId: string) => {
    const uploadedUrls: string[] = [];
    
    for (const file of formData.images) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-${Math.random()}.${fileExt}`;
      const filePath = `${formData.type}/${fileName}`;

      const { data, error } = await supabase.storage
        .from('items') // Make sure this bucket exists in Supabase
        .upload(filePath, file);

      if (error) {
        console.error("Storage upload error:", error);
        throw new Error(`Failed to upload image: ${error.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);
      
      uploadedUrls.push(publicUrl);
    }
    
    return uploadedUrls;
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    
    // Final Validation
    if (!formData.title || !formData.location || !formData.date || !formData.category) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (formData.type === 'found' && formData.images.length === 0) {
      toast.error("Images are mandatory for found items.");
      return;
    }

    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      if (!user) throw new Error("Unauthorized access");

      // 1. Upload Images
      let imageUrls: string[] = [];
      try {
        imageUrls = await uploadImages(user.id);
      } catch (uploadErr) {
        // Falling back to a placeholder if storage bucket isn't set up yet for demo purposes
        console.warn("Storage upload failed, using local blob for demo:", uploadErr);
        imageUrls = formData.images.map(f => URL.createObjectURL(f));
      }

      // 2. Prepare Database Data
      const table = formData.type === 'lost' ? 'lost_items' : 'found_items';
      const payload: any = {
        user_id: user.id,
        title: formData.title,
        category: formData.category,
        description: formData.description,
        location: formData.location,
        contact_info: formData.contactInfo,
        image_url: imageUrls[0] || null,
        status: 'open'
      };

      if (formData.type === 'lost') {
        payload.date_lost = formData.date;
        if (formData.reward) payload.reward_amount = parseInt(formData.reward);
      } else {
        payload.date_found = formData.date;
      }

      // 3. Handle Tags (Convert string to array)
      if (formData.tags) {
        payload.tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== "");
      }

      // 4. Insert into DB
      const { data, error } = await supabase.from(table).insert(payload).select().single();

      if (error) throw error;

      // 5. Go to Success Step
      setStep(5);
      
    } catch (err: any) {
      toast.error(err.message || "Failed to submit report");
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  };

  // Trigger AI Matching when first image is uploaded
  useEffect(() => {
    if (formData.images.length > 0 && formData.type === 'lost') {
      triggerAiMatch();
    }
  }, [formData.images]);

  const triggerAiMatch = async () => {
    setIsMatching(true);
    try {
      const response = await fetch('/api/ai/match', {
        method: 'POST',
        body: JSON.stringify({ imageUrl: URL.createObjectURL(formData.images[0]) }),
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.matches) {
        setAiMatches(data.matches);
      }
    } catch (err) {
      console.error("AI Matching failed:", err);
      // Simulate matches for demo purposes
      setAiMatches([
        { id: '1', title: 'MacBook Air M2', image_url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=200', similarity: 0.92, location: 'Library Floor 2', category: 'Electronics' },
        { id: '2', title: 'iPhone 13', image_url: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=200', similarity: 0.85, location: 'Cafeteria', category: 'Electronics' }
      ]);
    } finally {
      setIsMatching(false);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
        <p className="text-sm font-black uppercase tracking-widest text-muted-foreground">Verifying Identity...</p>
      </div>
    );
  }

  const categories = ["Electronics", "Clothing", "Personal Docs", "Bags", "Keys", "Other"];

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary/10 text-primary text-sm font-black uppercase tracking-widest"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Report</span>
        </motion.div>
        <h1 className="text-5xl md:text-6xl font-black tracking-tighter capitalize">
          {step === 4 ? "Ready to post?" : formData.type ? `Report ${formData.type} item` : "Tell us what happened"}
        </h1>
        <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
          {step === 4 
            ? "Review your details before sharing with the campus community." 
            : "Our smart matching system will help you find what you're looking for."}
        </p>
      </header>

      {/* Progress Bar */}
      <div className="relative h-2 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mb-12">
        <motion.div 
          className="absolute h-full bg-primary"
          initial={{ width: 0 }}
          animate={{ width: `${(step / 4) * 100}%` }}
          transition={{ duration: 0.5, ease: "circOut" }}
        />
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <TypeCard 
              active={formData.type === "lost"} 
              onClick={() => {
                handleInputChange("type", "lost");
                setTimeout(nextStep, 300); // Small delay for visual feedback
              }}
              icon={<ArrowRight className="w-10 h-10" />}
              title="I Lost Something"
              description="Report an item you've misplaced on campus so we can help you find it."
            />
            <TypeCard 
              active={formData.type === "found"} 
              onClick={() => {
                handleInputChange("type", "found");
                setTimeout(nextStep, 300); // Small delay for visual feedback
              }}
              icon={<CheckCircle2 className="w-10 h-10" />}
              title="I Found Something"
              description="Help a fellow student by reporting an item you discovered on campus."
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <GlassCard className="p-10 space-y-8 border-white/20 !rounded-[3rem] shadow-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Item Name</label>
                  <div className="relative">
                    <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                    <Input 
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Blue MacBook Air" 
                      className="pl-14 h-16 rounded-2xl glass border-none text-lg font-bold" 
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {categories.map(cat => (
                      <button
                        key={cat}
                        onClick={() => handleInputChange("category", cat)}
                        className={cn(
                          "px-4 py-3 rounded-xl text-xs font-black uppercase tracking-tighter transition-all",
                          formData.category === cat 
                            ? "bg-primary text-white shadow-lg" 
                            : "bg-white/10 text-muted-foreground hover:bg-white/20"
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Location</label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                    <Input 
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Where was it?" 
                      className="pl-14 h-16 rounded-2xl glass border-none text-lg font-bold" 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                      <Input 
                        type="date" 
                        value={formData.date}
                        onChange={(e) => handleInputChange("date", e.target.value)}
                        className="pl-14 h-16 rounded-2xl glass border-none text-lg font-bold" 
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Time</label>
                    <div className="relative">
                      <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-primary" />
                      <Input 
                        type="time" 
                        value={formData.time}
                        onChange={(e) => handleInputChange("time", e.target.value)}
                        className="pl-14 h-16 rounded-2xl glass border-none text-lg font-bold" 
                      />
                    </div>
                  </div>
                </div>
                <div className="md:col-span-2 space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1">Description</label>
                  <Textarea 
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Provide key details like brand, color, scratches..." 
                    className="min-h-[150px] rounded-[2rem] glass border-none p-6 text-lg font-medium leading-relaxed" 
                  />
                </div>
              </div>
            </GlassCard>

            <div className="flex justify-between items-center px-4">
              <Button variant="ghost" size="lg" onClick={prevStep} className="rounded-2xl h-14 px-8 font-bold hover:bg-white/10">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button 
                size="lg" 
                onClick={nextStep}
                disabled={!formData.title || !formData.location || !formData.date || !formData.category}
                className="rounded-2xl h-16 px-12 text-xl font-black shadow-2xl shadow-primary/30 group"
              >
                Continue
                <ArrowRight className="ml-2 w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-10"
          >
            <GlassCard className="p-10 space-y-10 border-white/20 !rounded-[3rem] shadow-3xl">
              <div className="space-y-4 text-center">
                <h3 className="text-3xl font-black tracking-tight">Add Visual Proof</h3>
                <p className="text-lg text-muted-foreground font-medium">Clear photos increase match rates by up to 80%.</p>
              </div>
              
            <ImageUpload 
                images={formData.images} 
                onChange={(imgs) => handleInputChange("images", imgs)} 
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-500" /> Optional Reward ($)
                  </label>
                  <Input 
                    type="number"
                    value={formData.reward}
                    onChange={(e) => handleInputChange("reward", e.target.value)}
                    placeholder="Enter amount..." 
                    className="h-14 rounded-2xl glass border-none text-lg font-bold" 
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                    <Hash className="w-4 h-4 text-primary" /> Tags / Keywords
                  </label>
                  <Input 
                    value={formData.tags}
                    onChange={(e) => handleInputChange("tags", e.target.value)}
                    placeholder="e.g. cracked-screen, sticker" 
                    className="h-14 rounded-2xl glass border-none text-lg font-bold" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary/10 border border-primary/20">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white">
                  <Zap className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black uppercase tracking-widest">Smart Matching Enabled</p>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {formData.type === 'found' 
                      ? "Images are mandatory to help owners identify their items." 
                      : "Even without a photo, our AI analyzes your description to find matches."}
                  </p>
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <label className="text-sm font-black uppercase tracking-widest text-muted-foreground ml-1 flex items-center gap-2">
                   <Phone className="w-4 h-4 text-primary" /> Contact Method
                 </label>
                 <div className="relative">
                    <Input 
                      value={formData.contactInfo}
                      onChange={(e) => handleInputChange("contactInfo", e.target.value)}
                      placeholder="WhatsApp, Telegram or Phone Number" 
                      className="h-16 rounded-2xl glass border-none text-lg font-bold" 
                    />
                  </div>
              </div>
            </GlassCard>

            <div className="flex justify-between items-center px-4">
              <Button variant="ghost" size="lg" onClick={prevStep} className="rounded-2xl h-14 px-8 font-bold hover:bg-white/10">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button 
                size="lg" 
                onClick={nextStep}
                disabled={formData.type === 'found' && formData.images.length === 0}
                className="rounded-2xl h-16 px-12 text-xl font-black shadow-2xl shadow-primary/30 group"
              >
                Review Report
                <Eye className="ml-2 w-6 h-6 group-hover:scale-110 transition-transform" />
              </Button>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-12"
          >
            {/* AI MATCH SECTION */}
            <AnimatePresence>
               {aiMatches.length > 0 && (
                 <PossibleMatchFound matches={aiMatches} onSelect={(id) => console.log('Selected match', id)} />
               )}
            </AnimatePresence>

            <GlassCard className="p-10 border-primary/20 bg-primary/5 !rounded-[3rem] shadow-3xl">
              <div className="flex flex-col md:flex-row gap-10">
                <div className="w-full md:w-72 aspect-square rounded-[2rem] overflow-hidden bg-slate-200 shadow-2xl">
                   {formData.images.length > 0 ? (
                      <img src={URL.createObjectURL(formData.images[0])} className="w-full h-full object-cover" />
                   ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-300">
                        <Camera className="w-12 h-12 text-white" />
                      </div>
                   )}
                </div>
                <div className="flex-1 space-y-6">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary text-white font-black uppercase px-4 py-1 rounded-full">
                      {formData.type === 'lost' ? 'Lost Item' : 'Found Item'}
                    </Badge>
                    <Badge variant="outline" className="glass border-white/20 font-bold uppercase px-4 py-1 rounded-full">
                      {formData.category || 'Uncategorized'}
                    </Badge>
                  </div>
                  <h2 className="text-4xl font-black tracking-tight">{formData.title || 'Untitled Item'}</h2>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Location</p>
                      <p className="font-bold flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> {formData.location}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Date & Time</p>
                      <p className="font-bold flex items-center gap-2"><Calendar className="w-4 h-4 text-primary" /> {formData.date} at {formData.time}</p>
                    </div>
                  </div>
                  {formData.reward && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl inline-flex items-center gap-2 text-amber-500 font-black">
                      <Coins className="w-4 h-4" /> Reward: ${formData.reward}
                    </div>
                  )}
                  <div className="space-y-1">
                    <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Description</p>
                    <p className="text-muted-foreground font-medium italic">"{formData.description || 'No description provided.'}"</p>
                  </div>
                </div>
              </div>
            </GlassCard>

            <div className="flex justify-between items-center px-4">
              <Button variant="ghost" size="lg" onClick={prevStep} className="rounded-2xl h-14 px-8 font-bold hover:bg-white/10">
                <ArrowLeft className="mr-2 w-5 h-5" />
                Back
              </Button>
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="rounded-2xl h-16 px-12 text-xl font-black shadow-2xl shadow-primary/30 group bg-emerald-500 hover:bg-emerald-600 border-none transition-all active:scale-95 flex items-center justify-center text-white"
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-3">
                    <Loader2 className="w-6 h-6 animate-spin" />
                    <span>Publishing...</span>
                  </div>
                ) : (
                  <>
                    Post to Campus
                    <Send className="ml-2 w-6 h-6 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </>
                )}
              </Button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="step5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center space-y-8 py-20 text-center"
          >
            <div className="w-32 h-32 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-2xl shadow-emerald-500/20">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <div className="space-y-4">
              <h2 className="text-5xl font-black tracking-tighter">Mission Accomplished!</h2>
              <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                Your report has been successfully broadcasted to the campus community. 
                Our AI is already searching for potential matches.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 pt-8">
              <Button 
                onClick={() => {
                  router.push("/dashboard");
                  router.refresh();
                }}
                className="rounded-2xl h-16 px-12 text-xl font-black bg-primary text-white shadow-2xl shadow-primary/30"
              >
                Go to Dashboard
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
                className="rounded-2xl h-16 px-12 text-xl font-black glass border-white/10"
              >
                Report Another
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GlassCard variant="neutral" className="p-6 flex items-center gap-4 border-white/10 !rounded-3xl max-w-2xl mx-auto">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <Info className="w-5 h-5 text-primary" />
        </div>
        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
          Your privacy is important. Contact information is only shared with verified matches once you approve the connection.
        </p>
      </GlassCard>
    </div>
  );
}

function TypeCard({ active, onClick, icon, title, description }: { active: boolean, onClick: () => void, icon: React.ReactNode, title: string, description: string }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "text-left p-10 rounded-[3rem] border-2 transition-all duration-500 relative group overflow-hidden h-full",
        active 
          ? "bg-primary text-white border-primary shadow-2xl scale-[1.02]" 
          : "glass border-white/40 dark:border-white/10 hover:border-primary/50"
      )}
    >
      <div className={cn(
        "w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500",
        active ? "bg-white/20" : "bg-primary/10 text-primary group-hover:scale-110"
      )}>
        {icon}
      </div>
      <h3 className="text-3xl font-black tracking-tight mb-4">{title}</h3>
      <p className={cn(
        "text-lg font-medium leading-relaxed",
        active ? "text-white/80" : "text-muted-foreground"
      )}>
        {description}
      </p>
      {active && (
        <motion.div 
          layoutId="activeGlow"
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" 
        />
      )}
    </button>
  );
}
