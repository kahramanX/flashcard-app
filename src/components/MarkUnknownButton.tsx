"use client";

import React, { useState } from 'react';
import { BookmarkPlus, BookmarkCheck } from 'lucide-react';
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

export default function MarkUnknownButton({ word, isInitiallyUnknown }: { word: Word, isInitiallyUnknown: boolean }) {
  const [isUnknown, setIsUnknown] = useState(isInitiallyUnknown);
  const [isMarking, setIsMarking] = useState(false);

  const handleToggleUnknown = async () => {
    if (isMarking) return;
    setIsMarking(true);
    
    try {
      const res = await fetch('/api/unknown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(word),
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.status === 'added') {
          setIsUnknown(true);
        } else {
          setIsUnknown(false);
        }
      }
    } catch (e) {
      console.error("Failed to mark as unknown:", e);
    } finally {
      setIsMarking(false);
    }
  };

  return (
    <button
      onClick={handleToggleUnknown}
      disabled={isMarking}
      className={cn(
        "px-3 py-1.5 transition-none flex items-center justify-center gap-2 disabled:opacity-50 font-normal border rounded-none shadow-none text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white w-32",
        isUnknown 
          ? "bg-gray-200 dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 hover:bg-gray-300 dark:hover:bg-zinc-600 text-black dark:text-white" 
          : "bg-[#0078D7] hover:bg-[#005a9e] border-transparent text-white"
      )}
    >
      {isUnknown ? (
        <BookmarkCheck className="w-4 h-4" />
      ) : (
        <BookmarkPlus className="w-4 h-4" />
      )}
      <span>
        {isUnknown ? "Added" : "Unknown"}
      </span>
    </button>
  );
}
