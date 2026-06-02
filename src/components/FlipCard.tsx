import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  meaning?: string;
};

export default function FlipCard({ currentWord }: { currentWord: Word }) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="w-full relative cursor-pointer group"
      onClick={() => setIsFlipped(!isFlipped)}
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="w-full relative preserve-3d transition-all duration-500 ease-in-out grid"
        animate={{ rotateX: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, animationDirection: "normal" }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front */}
        <div 
          className="col-start-1 row-start-1 w-full min-h-[250px] backface-hidden flex flex-col items-center justify-center p-4 sm:p-8 bg-transparent"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white mb-6 sm:mb-10 text-center tracking-normal px-4 sm:px-12">
            {currentWord.word}
          </h1>
          
          <div className="flex flex-row flex-wrap items-center justify-center gap-2 sm:gap-3 px-4 sm:px-12">
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
          
          <p className="mt-8 text-sm text-gray-400 dark:text-gray-500 italic animate-pulse">
            Click to reveal meaning
          </p>
        </div>

        {/* Back */}
        <div 
          className="col-start-1 row-start-1 w-full min-h-[250px] backface-hidden flex flex-col items-center justify-center p-4 sm:p-8 bg-transparent"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
        >
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold text-win-blue dark:text-win-blue mb-4 text-center px-4">
            {currentWord.meaning || "Anlamı bulunamadı"}
          </h2>
          <p className="mt-8 text-sm text-gray-400 dark:text-gray-500 italic">
            Click to flip back
          </p>
        </div>
      </motion.div>
    </div>
  );
}
