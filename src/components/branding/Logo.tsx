
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
          viewBox="0 0 500 500" 
          className={`${sizeClasses[size]} text-orange-500 glow-orange`}
          fill="none"
          stroke="currentColor"
          strokeWidth="12"
        >
          {/* Head outline */}
          <path d="M150,400 C100,380 70,340 60,280 C50,220 60,150 100,100 C140,50 200,30 260,40 C320,50 370,80 400,140 C430,200 430,280 400,340 C380,380 350,380 330,400 L150,400 Z" />
          
          {/* Candlestick charts inside head */}
          <line x1="170" y1="150" x2="170" y2="280" strokeWidth="15" />
          <line x1="170" y1="150" x2="170" y2="180" strokeWidth="30" />
          <line x1="170" y1="250" x2="170" y2="280" strokeWidth="30" />
          
          <line x1="250" y1="120" x2="250" y2="280" strokeWidth="15" />
          <line x1="250" y1="120" x2="250" y2="160" strokeWidth="30" />
          <line x1="250" y1="240" x2="250" y2="280" strokeWidth="30" />
          
          <line x1="330" y1="90" x2="330" y2="280" strokeWidth="15" />
          <line x1="330" y1="90" x2="330" y2="140" strokeWidth="30" />
          <line x1="330" y1="230" x2="330" y2="280" strokeWidth="30" />
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
