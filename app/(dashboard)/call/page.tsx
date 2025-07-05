"use client"
import { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';

export default function BuddyProfile() {
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-sm text-center flex items-center justify-center flex-col">
        {/* Avatar */}
        <div className="mb-6">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-black overflow-hidden">
            <img 
              src="/avatar.svg" 
              alt="Buddy Avatar" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Name */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ev
        </h1>

        {/* Status */}
        <p className="text-gray-600 mb-4">
          AI Buddy
        </p>

        {/* Timer */}
        <div className="text-2xl font-mono text-gray-700 mb-8">
          {formatTime(timer)}
        </div>

        {/* Call Button */}
        <button className="w-16 h-16 bg-red-400 hover:bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-colors">
          <Phone className="w-8 h-8 -rotate-225 text-white" />
        </button>
      </div>
    </div>
  );
}