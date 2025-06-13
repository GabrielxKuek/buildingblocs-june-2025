import { useState, useEffect } from 'react';
import { ImageIcon, Video, X, Minimize2, CheckCircle, Sparkles } from 'lucide-react';

const FloatingProgressCard = ({ 
  isVisible, 
  type = 'image', 
  progress = 0, 
  stage = 'start',
  itemName = '',
  onClose,
  onMinimize,
  isMinimized = false
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }, 25);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  useEffect(() => {
    if (progress === 100 && stage === 'complete') {
      setIsComplete(true);
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [progress, stage, onClose]);

  useEffect(() => {
    if (!isVisible) {
      setDisplayProgress(0);
      setIsComplete(false);
    }
  }, [isVisible]);

  const getConfig = () => {
    if (type === 'video') {
      return {
        gradient: 'from-blue-500 to-purple-600',
        lightGradient: 'from-blue-100 to-purple-100',
        textColor: 'text-blue-700',
        icon: Video,
        title: 'Generating Video',
        emoji: '🎬',
        stages: {
          start: 'Initializing video generation...',
          processing: 'Creating video with AI...',
          uploading: 'Saving video...',
          complete: 'Video ready!'
        }
      };
    } else {
      return {
        gradient: 'from-green-500 to-emerald-600',
        lightGradient: 'from-green-100 to-emerald-100',
        textColor: 'text-green-700',
        icon: ImageIcon,
        title: 'Generating Image',
        emoji: '🎨',
        stages: {
          start: 'Initializing image generation...',
          processing: 'Creating image with AI...',
          uploading: 'Saving image...',
          complete: 'Image ready!'
        }
      };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out ${
      isMinimized ? 'w-16 h-16' : 'w-80'
    }`}>
      <div className={`bg-white/95 backdrop-blur-lg rounded-xl shadow-2xl border border-gray-200/50 overflow-hidden transition-all duration-300 ${
        isMinimized ? 'p-3' : 'p-4'
      }`}>
        
        {/* Minimized View */}
        {isMinimized ? (
          <div 
            className="flex items-center justify-center cursor-pointer group"
            onClick={onMinimize}
            title={`${config.title}: ${displayProgress}%`}
          >
            <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center relative group-hover:scale-110 transition-transform`}>
              <Icon className="w-5 h-5 text-white" />
              
              {/* Animated Progress Ring */}
              <svg className="absolute inset-0 w-10 h-10 transform -rotate-90">
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="rgba(255,255,255,0.2)"
                  strokeWidth="2"
                  fill="none"
                />
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray={`${displayProgress * 1.13} 113`}
                  className="transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              
              {/* Sparkle effect on completion */}
              {isComplete && (
                <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-400 animate-ping" />
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center relative`}>
                  {isComplete ? (
                    <CheckCircle className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className="w-5 h-5 text-white" />
                  )}
                  
                  {/* Pulse effect while processing */}
                  {!isComplete && (
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} animate-ping opacity-20`}></div>
                  )}
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1">
                    {config.emoji} {config.title}
                  </h3>
                  {itemName && (
                    <p className="text-xs text-gray-500 font-medium">"{itemName}"</p>
                  )}
                </div>
              </div>
              
              {/* Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={onMinimize}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                  title="Minimize"
                >
                  <Minimize2 className="w-3 h-3 text-gray-400" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 hover:bg-gray-100 rounded-md transition-colors"
                  title="Close"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Progress Section */}
            <div className="space-y-3">
              {/* Stage and Percentage */}
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">
                  {config.stages[stage] || 'Processing...'}
                </span>
                <span className={`text-sm font-bold ${config.textColor}`}>
                  {displayProgress}%
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="relative">
                <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${config.gradient} rounded-full transition-all duration-300 ease-out relative`}
                    style={{ width: `${displayProgress}%` }}
                  >
                    {/* Animated shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform skew-x-12 animate-pulse"></div>
                  </div>
                </div>
                
                {/* Glow effect */}
                <div 
                  className={`absolute top-0 h-2.5 bg-gradient-to-r ${config.gradient} rounded-full blur-sm opacity-50 transition-all duration-300`}
                  style={{ width: `${displayProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="mt-3 pt-3 border-t border-gray-100">
              {!isComplete ? (
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    ⏱️ {type === 'video' ? '2-5 minutes' : '30-60 seconds'}
                  </span>
                  <span className="flex items-center gap-1">
                    🤖 AI Powered
                  </span>
                </div>
              ) : (
                <div className="text-xs text-green-600 font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Successfully generated! 🎉
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FloatingProgressCard;