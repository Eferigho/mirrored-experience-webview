import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className = "", showText = true }) => {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative w-10 h-10">
        {/* VR Headset silhouette */}
        <svg viewBox="0 0 40 40" className="w-full h-full">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e3a8a" />
              <stop offset="100%" stopColor="#3730a3" />
            </linearGradient>
          </defs>
          
          {/* Steering wheel base circle */}
          <circle cx="20" cy="20" r="16" fill="none" stroke="url(#logoGradient)" strokeWidth="2" />
          
          {/* Steering wheel spokes */}
          <line x1="20" y1="8" x2="20" y2="14" stroke="url(#logoGradient)" strokeWidth="2" />
          <line x1="32" y1="20" x2="26" y2="20" stroke="url(#logoGradient)" strokeWidth="2" />
          <line x1="20" y1="32" x2="20" y2="26" stroke="url(#logoGradient)" strokeWidth="2" />
          <line x1="8" y1="20" x2="14" y2="20" stroke="url(#logoGradient)" strokeWidth="2" />
          
          {/* VR headset top curve */}
          <path d="M12 12 Q20 8 28 12" fill="none" stroke="#0d9488" strokeWidth="2" strokeLinecap="round" />
          
          {/* VR headset side elements */}
          <circle cx="12" cy="16" r="2" fill="#f97316" />
          <circle cx="28" cy="16" r="2" fill="#f97316" />
          
          {/* Center hub */}
          <circle cx="20" cy="20" r="3" fill="url(#logoGradient)" />
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className="font-semibold text-lg leading-none font-['Raleway']">VRDrive</span>
          <span className="text-xs text-muted-foreground font-['Montserrat'] tracking-wide">VIRTUAL TOURS</span>
        </div>
      )}
    </div>
  );
};