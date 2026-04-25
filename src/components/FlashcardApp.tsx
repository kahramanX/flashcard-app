"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookmarkPlus, BookmarkCheck, Sun, Moon, History } from 'lucide-react';
import Link from 'next/link';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

type Word = {
  id: number;
  word: string;
  type: string;
  level: string;
};

export default function FlashcardApp({ initialWords, initialUnknownIds }: { initialWords: Word[], initialUnknownIds: number[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMarking, setIsMarking] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [savedIndex, setSavedIndex] = useState<number | null>(null);
  
  // Track unknown IDs in client state
  const [unknownIds, setUnknownIds] = useState<Set<number>>(new Set(initialUnknownIds));

  // Theme state
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }

    // Load Last Viewed Index from JSON API
    fetch('/api/progress')
      .then(res => res.json())
      .then(data => {
        if (data && typeof data.currentIndex === 'number') {
          setSavedIndex(data.currentIndex);
        }
      })
      .catch(err => console.error('Failed to load progress', err));
  }, []);

  // Save progress dynamically whenever currentIndex changes
  useEffect(() => {
    if (initialWords.length === 0) return;
    
    // Using a simple timeout to debounce saves and avoid spamming the local file
    const timeout = setTimeout(() => {
      fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentIndex }),
      }).catch(err => console.error('Failed to save progress', err));
    }, 1000);

    return () => clearTimeout(timeout);
  }, [currentIndex, initialWords.length]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNext = () => {
    if (currentIndex < initialWords.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleGoToLastViewed = () => {
    if (savedIndex !== null && savedIndex >= 0 && savedIndex < initialWords.length) {
      setCurrentIndex(savedIndex);
      showToast(`Jumped to last viewed card (#${savedIndex + 1})`);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const targetIndex = Math.floor(percentage * initialWords.length);
    setCurrentIndex(Math.max(0, Math.min(targetIndex, initialWords.length - 1)));
  };

  const handleToggleUnknown = async () => {
    if (initialWords.length === 0 || isMarking) return;
    setIsMarking(true);
    
    const word = initialWords[currentIndex];
    const isCurrentlyUnknown = unknownIds.has(word.id);
    
    try {
      const res = await fetch('/api/unknown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      });
      const data = await res.json();
      
      if (data.success) {
        setUnknownIds(prev => {
          const next = new Set(prev);
          if (data.status === 'added') {
            next.add(word.id);
            showToast(`"${word.word}" added to unknown words!`);
          } else {
            next.delete(word.id);
            showToast(`"${word.word}" removed from list.`);
          }
          return next;
        });
      } else {
        showToast("An error occurred.");
      }
    } catch (e) {
      console.error("Failed to mark as unknown:", e);
      showToast("Network error.");
    } finally {
      setIsMarking(false);
    }
  };

  if (initialWords.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none text-center">
        <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">No Words Found</h2>
        <p className="text-gray-600 dark:text-gray-400">Please check your words.json file.</p>
      </div>
    );
  }

  const currentWord = initialWords[currentIndex];
  const remainingCount = initialWords.length - (currentIndex + 1);
  const progressPercentage = ((currentIndex + 1) / initialWords.length) * 100;
  
  const isUnknown = unknownIds.has(currentWord.id);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center relative min-h-[80vh]">
      
      {/* Top Action Bar (Theme + Last Viewed) */}
      <div className="absolute -top-12 right-0 flex gap-2">
        {savedIndex !== null && savedIndex !== currentIndex && (
          <button 
            onClick={handleGoToLastViewed}
            className="px-3 py-2 bg-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 border border-transparent hover:border-gray-300 dark:hover:border-zinc-600 transition-colors text-sm text-gray-800 dark:text-gray-200 cursor-pointer flex items-center gap-2"
            title="Go to Last Viewed"
          >
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">Last Viewed: {savedIndex + 1}</span>
          </button>
        )}

        <button 
          onClick={toggleTheme}
          className="p-2 bg-transparent hover:bg-gray-200 dark:hover:bg-zinc-700 border border-transparent hover:border-gray-300 dark:hover:border-zinc-600 transition-colors text-gray-800 dark:text-gray-200 cursor-pointer"
          aria-label="Toggle Dark Mode"
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Toast Notification (Windows 10 Style flyout) */}
      {toastMessage && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 border-l-4 border-win-blue text-white px-4 py-3 shadow-none z-50 transition-opacity">
          <p className="text-sm font-medium">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="w-full mb-6 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-4 flex flex-col gap-3 rounded-none shadow-none">
        <div className="flex justify-between items-center text-sm font-semibold text-gray-700 dark:text-gray-300 pb-2 border-b border-gray-200 dark:border-zinc-700">
          <span>Total: <span className="text-black dark:text-white">{initialWords.length}</span></span>
          <span className="text-win-blue">{currentIndex + 1} / {initialWords.length}</span>
          <span>Remaining: <span className="text-black dark:text-white">{remainingCount}</span></span>
        </div>
        
        {/* Clickable Progress Bar */}
        <div 
          className="w-full h-2 bg-gray-200 dark:bg-zinc-700 rounded-none overflow-hidden cursor-pointer hover:h-3 hover:bg-gray-300 dark:hover:bg-zinc-600 transition-all active:bg-gray-400 relative"
          onClick={handleProgressBarClick}
          title="Click to jump to a specific word"
        >
          <div 
            className="h-full bg-win-blue transition-all duration-200 pointer-events-none"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Static Single Card Area */}
      <div className="w-full min-h-[300px] mb-6 bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none shadow-none flex flex-col items-center justify-center transition-colors">
        <h1 className="text-5xl md:text-6xl font-bold text-black dark:text-white mb-10 text-center tracking-normal">
          {currentWord.word}
        </h1>
        
        <div className="flex flex-row flex-wrap items-center justify-center gap-3">
          <span className="text-lg font-semibold px-4 py-1 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 text-gray-800 dark:text-gray-200 rounded-none">
            {currentWord.type}
          </span>
          <span className={cn(
             "text-lg font-bold px-4 py-1 border rounded-none",
             currentWord.level.includes('C') ? 'bg-red-50 dark:bg-red-900/30 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300' 
           : currentWord.level.includes('B') ? 'bg-orange-50 dark:bg-orange-900/30 border-orange-300 dark:border-orange-800 text-orange-800 dark:text-orange-300' 
           : 'bg-green-50 dark:bg-green-900/30 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300'
          )}>
            Level: {currentWord.level}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full items-stretch justify-between gap-2 h-12">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="w-12 h-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 disabled:opacity-50 disabled:hover:bg-gray-200 dark:disabled:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-none text-gray-900 dark:text-white shrink-0"
          aria-label="Previous Word"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Toggle Button */}
        <button
          onClick={handleToggleUnknown}
          disabled={isMarking}
          className={cn(
            "flex-1 h-full px-6 transition-none flex items-center justify-center gap-2 disabled:opacity-50 font-normal border rounded-none shadow-none text-sm md:text-base focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white",
            isUnknown 
              ? "bg-[#CCCCCC] dark:bg-[#333333] border-transparent hover:bg-[#B3B3B3] dark:hover:bg-[#444444] text-black dark:text-white" 
              : "bg-win-blue hover:bg-win-blue-hover border-transparent text-white"
          )}
        >
          {isUnknown ? (
            <BookmarkCheck className="w-5 h-5" />
          ) : (
            <BookmarkPlus className="w-5 h-5" />
          )}
          <span>
            {isUnknown ? "Marked as Unknown" : "Mark as Unknown"}
          </span>
        </button>

        <button
          onClick={handleNext}
          disabled={currentIndex === initialWords.length - 1}
          className="w-12 h-full bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 disabled:opacity-50 disabled:hover:bg-gray-200 dark:disabled:hover:bg-zinc-800 transition-colors flex items-center justify-center rounded-none text-gray-900 dark:text-white shrink-0"
          aria-label="Next Word"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Links Container */}
      <div className="w-full mt-6 flex flex-col md:flex-row items-center justify-center gap-4">
        <Link 
          href="/levels"
          className="inline-flex items-center justify-center py-2 px-6 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 transition-none rounded-none text-gray-900 dark:text-white font-normal text-sm w-full md:w-auto"
        >
          View All Words by Level
        </Link>
        <Link 
          href="/unknown"
          className="inline-flex items-center justify-center py-2 px-6 bg-gray-200 dark:bg-zinc-800 hover:bg-gray-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-600 transition-none rounded-none text-gray-900 dark:text-white font-normal text-sm w-full md:w-auto"
        >
          View Unknown Words List
        </Link>
      </div>

    </div>
  );
}
