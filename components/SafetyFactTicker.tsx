
import React, { useState, useEffect } from 'react';
import { SAFETY_FACTS, ISHA_PRIMARY_COLOR } from '../constants';

const SafetyFactTicker: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // Start fading out
      
      setTimeout(() => {
        setIndex((prevIndex) => (prevIndex + 1) % SAFETY_FACTS.length);
        setFade(true); // Fade back in with new content
      }, 500); // Wait for fade out duration

    }, 7000); // Total 7 seconds per fact

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 shadow-inner min-h-[160px] flex flex-col items-center justify-center text-center transition-all">
      <div className="flex items-center gap-2 mb-4 text-green-800 font-bold uppercase tracking-wider text-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        工安法規小知識
      </div>
      <p 
        className={`text-lg md:text-xl text-gray-700 font-medium leading-relaxed transition-opacity duration-500 ${fade ? 'opacity-100' : 'opacity-0'}`}
        style={{ color: ISHA_PRIMARY_COLOR }}
      >
        「 {SAFETY_FACTS[index]} 」
      </p>
      <div className="mt-6 flex gap-1">
        {SAFETY_FACTS.map((_, i) => (
          <div 
            key={i} 
            className={`h-1.5 rounded-full transition-all duration-300 ${i === index ? 'w-6 bg-green-600' : 'w-1.5 bg-green-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default SafetyFactTicker;
