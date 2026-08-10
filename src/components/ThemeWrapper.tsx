import React from 'react';

const ThemeWrapper: React.FC<{ theme: 'cloud' | 'starry' | 'forest'; children: React.ReactNode }> = ({ theme, children }) => {
  const bgClass = 
    theme === 'cloud' ? 'bg-sky-300' :
    theme === 'starry' ? 'bg-slate-900' :
    'bg-lime-400';
  return (
    <div className={`${bgClass} w-full h-full transition-colors duration-500`}>
      {children}
    </div>
  );
};

export default ThemeWrapper;
