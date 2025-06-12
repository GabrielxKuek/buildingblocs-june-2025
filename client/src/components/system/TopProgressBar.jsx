// src/components/system/TopProgressBar.jsx
import { useState, useEffect } from 'react';
import { ImageIcon, Video, X, Brain } from 'lucide-react';

const TopProgressBar = ({ 
  isVisible, 
  type = 'image', 
  progress = 0, 
  stage = 'start',
  itemName = '',
  onClose
}) => {
  const [displayProgress, setDisplayProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (progress > displayProgress) {
      const timer = setTimeout(() => {
        setDisplayProgress(prev => Math.min(prev + 1, progress));
      }, 15);
      return () => clearTimeout(timer);
    }
  }, [progress, displayProgress]);

  // Reset progress when not visible
  useEffect(() => {
    if (!isVisible) {
      setDisplayProgress(0);
      setIsComplete(false);
    }
  }, [isVisible]);

  // Handle completion
  useEffect(() => {
    if (progress === 100 && stage === 'complete') {
      setIsComplete(true);
      const timer = setTimeout(() => {
        onClose && onClose();
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [progress, stage, onClose]);

  const getConfig = () => {
    if (type === 'video') {
      return {
        gradient: 'from-blue-500 to-purple-600',
        bgColor: 'bg-gradient-to-r from-blue-50/80 to-purple-50/80',
        textColor: 'text-blue-700',
        lightColor: 'text-blue-600',
        icon: Video,
        title: 'Video',
        emoji: '🎬'
      };
    } else {
      return {
        gradient: 'from-green-500 to-emerald-600',
        bgColor: 'bg-gradient-to-r from-green-50/80 to-emerald-50/80',
        textColor: 'text-green-700',
        lightColor: 'text-green-600',
        icon: ImageIcon,
        title: 'Image',
        emoji: '🎨'
      };
    }
  };

  const config = getConfig();
  const Icon = config.icon;

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50">
      {/* Main Progress Bar */}
      <div className="relative h-1">
        <div 
          className={`h-full bg-gradient-to-r ${config.gradient} transition-all duration-300 ease-out`}
          style={{ width: `${displayProgress}%` }}
        />
        
        {/* Animated shimmer overlay */}
        <div 
          className={`absolute top-0 h-full bg-gradient-to-r ${config.gradient} opacity-60 blur-sm transition-all duration-300`}
          style={{ width: `${displayProgress}%` }}
        />
        
        {/* Moving light effect */}
        {!isComplete && displayProgress > 0 && (
          <div 
            className={`absolute top-0 w-20 h-full bg-gradient-to-r from-transparent via-white/60 to-transparent transform transition-all duration-1000`}
            style={{ 
              left: `${Math.max(0, displayProgress - 10)}%`,
              animation: 'shimmer 2s infinite'
            }}
          />
        )}
      </div>

      {/* Info Bar */}
      <div className={`${config.bgColor} backdrop-blur-sm border-b border-white/20 px-4 py-2.5`}>
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            {/* Animated Icon */}
            <div className={`w-7 h-7 rounded-full bg-gradient-to-r ${config.gradient} flex items-center justify-center relative`}>
              <Icon className="w-3.5 h-3.5 text-white" />
              {!isComplete && (
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${config.gradient} animate-ping opacity-20`}></div>
              )}
            </div>
            
            {/* Status Text */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`font-semibold ${config.textColor}`}>
                {config.emoji} Generating {config.title.toLowerCase()}
              </span>
              {itemName && (
                <>
                  <span className="text-gray-400">•</span>
                  <span className={`${config.lightColor} font-medium`}>
                    "{itemName}"
                  </span>
                </>
              )}
              <span className="text-gray-400">•</span>
              <span className="text-gray-600 text-xs flex items-center gap-1">
                <Brain className="w-3 h-3" />
                {displayProgress}%
              </span>
            </div>
          </div>
          
          {/* Right Side Info */}
          <div className="flex items-center gap-4">
            {/* Time Estimate */}
            {!isComplete && (
              <span className="text-xs text-gray-500 hidden sm:block">
                ⏱️ {type === 'video' ? '2-5 min' : '30-60s'} remaining
              </span>
            )}
            
            {/* Success Message */}
            {isComplete && (
              <span className="text-xs text-green-600 font-medium animate-pulse">
                ✅ Complete!
              </span>
            )}
            
            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/50 rounded-md transition-colors group"
              title="Close"
            >
              <X className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      {/* CSS for shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(400%); }
        }
      `}</style>
    </div>
  );
};

export default TopProgressBar;