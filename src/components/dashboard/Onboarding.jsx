import React, { useState, useEffect } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Link as LinkIcon, 
  Palette, 
  Share, 
  Sparkles,
  CheckCircle2,
  MessageSquare
} from 'lucide-react';

const Onboarding = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    localStorage.setItem('linkly_onboarded', 'true');
    onClose();
  };

  const steps = [
    {
      title: "Welcome to Linkly! 🚀",
      description: "You're just minutes away from creating a beautiful hub for all your content. Let's show you how it works.",
      icon: <Sparkles className="w-12 h-12 text-orange-500" />,
      color: "from-orange-500/20 to-orange-600/20"
    },
    {
      title: "Upload Your Photo 📸",
      description: "Click the circle avatar in the profile card or top navbar to upload your profile picture. A fresh photo makes your page pop!",
      icon: <User className="w-12 h-12 text-indigo-500" />,
      color: "from-indigo-500/20 to-indigo-600/20"
    },
    {
      title: "Add Unlimited Content 🔗",
      description: "Use 'Add Link' to include your socials, website, or portfolio. You can choose from icons and customize link titles anytime.",
      icon: <LinkIcon className="w-12 h-12 text-green-500" />,
      color: "from-green-500/20 to-green-600/20"
    },
    {
      title: "Themes & Real-time Preview 🎨",
      description: "Pick a theme in 'Appearance' and watch the phone mockup on the right update instantly. It's exactly what your visitors will see!",
      icon: <Palette className="w-12 h-12 text-pink-500" />,
      color: "from-pink-500/20 to-pink- pink-600/20"
    },
    {
      title: "Live Everywhere 🌍",
      description: "Once you're happy, hit 'Share' to copy your unique URL or generate a QR code. Your profile is live and ready for the world!",
      icon: <Share className="w-12 h-12 text-blue-500" />,
      color: "from-blue-500/20 to-blue-600/20"
    },
    {
      title: "Inbox & Anonymous Messages ✉️",
      description: "Enable the AMA feature to let fans send you anonymous messages! Manage your incoming questions directly from your new 'Messages' tab.",
      icon: <MessageSquare className="w-12 h-12 text-pink-500" />,
      color: "from-pink-500/20 to-pink-600/20"
    }
  ];

  const currentStep = steps[step - 1];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={handleComplete}
      ></div>

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#0a0a0c] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        
        {/* Decorative Background */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br ${currentStep.color} rounded-full blur-[80px] pointer-events-none`}></div>
        
        {/* Close Button */}
        <button 
          onClick={handleComplete}
          className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors z-20 group"
          title="Skip Tour"
        >
          <X className="w-5 h-5 text-gray-400 group-hover:text-white" />
        </button>

        <div className="p-8 sm:p-12 relative z-10">
          {/* Progress Bar */}
          <div className="flex gap-2 mb-10">
            {[...Array(totalSteps)].map((_, i) => (
              <div 
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                  i + 1 <= step ? 'bg-orange-500' : 'bg-white/10'
                }`}
              ></div>
            ))}
          </div>

          <div className="flex flex-col items-center text-center space-y-6">
            <div className="p-6 bg-white/5 rounded-3xl border border-white/10">
              {currentStep.icon}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold text-white tracking-tight">
                {currentStep.title}
              </h2>
              <p className="text-gray-400 text-lg leading-relaxed max-w-sm mx-auto">
                {currentStep.description}
              </p>
            </div>

            {step === totalSteps && (
              <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-full border border-green-500/20 animate-bounce mt-4">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm font-bold">You're ready to go!</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-12 gap-4">
            <button
              onClick={prevStep}
              className={`flex items-center gap-2 px-6 py-4 rounded-2xl font-bold transition-all ${
                step === 1 
                ? 'opacity-0 pointer-events-none' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>

            <button
              onClick={nextStep}
              className="group flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-2xl transition-all shadow-xl shadow-orange-600/20 active:scale-[0.98]"
            >
              {step === totalSteps ? 'Start Creating' : 'Next Step'}
              <ChevronRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          
          <p className="text-center text-gray-500 text-xs mt-6 uppercase tracking-widest font-bold">
            Step {step} of {totalSteps}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
