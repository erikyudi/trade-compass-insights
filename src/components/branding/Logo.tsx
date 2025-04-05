
import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = "", size = "md" }) => {
  const sizeClasses = {
    sm: "h-8",
    md: "h-12",
    lg: "h-20"
  };

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative mb-2">
        <svg 
          viewBox="0 0 240 240" 
          className={`${sizeClasses[size]} text-orange-500 glow-orange`}
          fill="currentColor"
        >
          <path d="M120,10 C60,10 10,60 10,120 C10,180 60,230 120,230 C180,230 230,180 230,120 C230,60 180,10 120,10 Z M120,210 C70,210 30,170 30,120 C30,70 70,30 120,30 C170,30 210,70 210,120 C210,170 170,210 120,210 Z" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none" />
          <path d="M140,50 C140,50 155,70 155,85 L155,155 C155,170 140,190 140,190" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" />
          <path d="M100,80 C100,80 115,100 115,115 L115,155 C115,170 100,190 100,190" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" />
          <path d="M60,110 C60,110 75,130 75,145 L75,155 C75,170 60,190 60,190" 
                stroke="currentColor" 
                strokeWidth="8" 
                fill="none" />
          <path d="M90,40 C90,40 55,65 45,100 C35,135 40,160 80,190" 
                stroke="currentColor" 
                strokeWidth="2" 
                fill="none" 
                opacity="0.5" />
        </svg>
      </div>
      <div className="text-white font-bold text-center">
        {size === "sm" ? null : (
          <span className="text-xl md:text-2xl">MyTradingMind</span>
        )}
      </div>
    </div>
  );
};

export default Logo;
