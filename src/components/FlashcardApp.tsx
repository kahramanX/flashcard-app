"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookmarkPlus, BookmarkCheck } from 'lucide-react';
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
  
  // Track unknown IDs in client state
  const [unknownIds, setUnknownIds] = useState<Set<number>>(new Set(initialUnknownIds));

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

  const handleToggleUnknown = async () => {
    if (initialWords.length === 0 || isMarking) return;
    setIsMarking(true);
    
    const word = initialWords[currentIndex];
    // Optimistic toggle
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
      <div className="glass-panel p-8 rounded-2xl text-center">
        <h2 className="text-2xl font-bold mb-2">No Words Found</h2>
        <p className="opacity-70">Please check your words.json file.</p>
      </div>
    );
  }

  const currentWord = initialWords[currentIndex];
  const remainingCount = initialWords.length - (currentIndex + 1);
  const progressPercentage = ((currentIndex + 1) / initialWords.length) * 100;
  
  // Check if current word is in our unknown list
  const isUnknown = unknownIds.has(currentWord.id);

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col items-center">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-8 px-6 py-3 rounded-full glass-panel border-blue-500/30 text-sm font-medium shadow-2xl z-50 flex items-center gap-2"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="w-full mb-8 glass-panel rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-center text-sm font-medium opacity-80 pb-3 border-b border-white/10">
          <span>Total: <span className="font-bold text-white">{initialWords.length}</span></span>
          <span className="text-blue-400 font-semibold">{currentIndex + 1} / {initialWords.length}</span>
          <span>Remaining: <span className="font-bold text-white">{remainingCount}</span></span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Static Single Card Area */}
      <div className="relative w-full h-[320px] lg:h-[400px] mb-8 group">
        <div className="absolute inset-0 glass-panel rounded-3xl flex flex-col items-center justify-center p-8 shadow-xl border-t border-l border-white/20 transition-transform group-hover:scale-[1.02]">
          
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-white/70 mb-10 text-center tracking-tight">
            {currentWord.word}
          </h1>
          
          <div className="flex flex-row flex-wrap items-center justify-center gap-4">
            <span className="text-xl font-medium px-5 py-2 rounded-full bg-white/5 border border-white/10 shadow-sm">
              {currentWord.type}
            </span>
            <span className={`text-xl font-bold px-5 py-2 rounded-full border shadow-sm ${
                currentWord.level.includes('C') ? 'bg-red-500/10 border-red-500/30 text-red-300' 
              : currentWord.level.includes('B') ? 'bg-orange-500/10 border-orange-500/30 text-orange-300' 
              : 'bg-green-500/10 border-green-500/30 text-green-300'
            }`}>
              Level: {currentWord.level}
            </span>
          </div>

        </div>
      </div>

      {/* Controls */}
      <div className="flex w-full items-center justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="p-4 rounded-full glass-panel flex-shrink-0 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center justify-center group"
          aria-label="Previous Word"
        >
          <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
        </button>

        {/* Animated Toggle Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.02 }}
          onClick={handleToggleUnknown}
          disabled={isMarking}
          className={cn(
            "flex-1 py-4 px-6 rounded-2xl glass-panel transition-all flex items-center justify-center gap-2 group shadow-lg disabled:opacity-50",
            isUnknown 
              ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 border-emerald-500/30 shadow-emerald-500/10" 
              : "bg-gradient-to-r from-rose-500/20 to-orange-500/20 hover:from-rose-500/30 hover:to-orange-500/30 border-rose-500/30 shadow-rose-500/10"
          )}
        >
          <motion.div animate={{ rotate: isUnknown ? [0, -10, 10, 0] : 0 }} transition={{ duration: 0.4 }}>
            {isUnknown ? (
              <BookmarkCheck className="w-5 h-5 group-hover:scale-110 transition-transform text-emerald-300" />
            ) : (
              <BookmarkPlus className="w-5 h-5 group-hover:scale-110 transition-transform text-rose-300" />
            )}
          </motion.div>

          <span className={cn(
            "font-semibold whitespace-nowrap",
            isUnknown ? "text-emerald-100" : "text-rose-100"
          )}>
            {isUnknown ? "Marked as Unknown" : "Mark as Unknown"}
          </span>
        </motion.button>

        <button
          onClick={handleNext}
          disabled={currentIndex === initialWords.length - 1}
          className="p-4 rounded-full glass-panel flex-shrink-0 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-all flex items-center justify-center group"
          aria-label="Next Word"
        >
          <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
}
