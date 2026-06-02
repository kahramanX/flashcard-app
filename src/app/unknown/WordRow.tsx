"use client";

import { useState } from 'react';
import { createPortal } from 'react-dom';

type WordRowProps = {
  word: any;
  index: number;
};

export default function WordRow({ word, index }: WordRowProps) {
  const [learned, setLearned] = useState(false);
  const [removed, setRemoved] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleRemove = async () => {
    // Optimistic UI update
    setRemoved(true);
    setShowPopup(true);
    
    // Auto hide popup after 2.5 seconds (matching other pages)
    setTimeout(() => {
      setShowPopup(false);
    }, 2500);

    try {
      await fetch('/api/unknown', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(word),
      });
    } catch (e) {
      console.error('Failed to remove word', e);
    }
  };

  if (removed) {
    if (!showPopup) return null;

    return createPortal(
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-zinc-800 border-l-4 border-[#0078D7] text-white px-4 py-3 shadow-none z-[9999] transition-opacity animate-fade-in flex items-center gap-4">
        <p className="text-sm font-medium">"{word.word}" listeden kaldırıldı.</p>
        <button onClick={() => setShowPopup(false)} className="text-gray-400 hover:text-white transition-none text-lg leading-none">
          ✕
        </button>
      </div>,
      document.body
    );
  }

  // Windows 10 list item styling
  // Selected (learned): Accent color background (light blue for light mode, dark blue for dark mode)
  // Hover: Light blue hover
  const rowClass = learned
    ? "border-b border-gray-200 dark:border-zinc-700 bg-[#cce8ff] dark:bg-[#003e73] hover:bg-[#bfe0ff] dark:hover:bg-[#004a8a] transition-none group"
    : "border-b border-gray-200 dark:border-zinc-700 hover:bg-[#e5f3fb] dark:hover:bg-zinc-700/50 transition-none group";

  const numClass = learned
    ? "p-3 text-center border-r border-gray-200 dark:border-zinc-700 text-[#005a9e] dark:text-blue-200 transition-none"
    : "p-3 text-center border-r border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 group-hover:bg-[#e5f3fb] group-hover:dark:bg-zinc-600 transition-none";

  return (
    <tr className={rowClass}>
      <td className={numClass}>
        {index + 1}
      </td>
      <td className={`p-3 font-bold border-r border-gray-200 dark:border-zinc-700 ${learned ? 'text-[#005a9e] dark:text-blue-200' : 'text-[#0078D7] dark:text-blue-400'}`}>
        {word.word}
      </td>
      <td className={`p-3 border-r border-gray-200 dark:border-zinc-700 ${learned ? 'text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
        {word.type}
      </td>
      <td className={`p-3 border-r border-gray-200 dark:border-zinc-700 ${learned ? 'text-gray-900 dark:text-gray-100' : 'text-gray-800 dark:text-gray-200'}`}>
        {word.meaning || ''}
      </td>
      <td className="p-3 text-center border-r border-gray-200 dark:border-zinc-700">
        <button
          onClick={() => setLearned(!learned)}
          className={`px-4 py-1.5 text-sm font-medium rounded-none border-2 transition-none focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white ${
            learned
              ? 'bg-[#0078D7] text-white border-[#0078D7] hover:bg-[#005a9e] hover:border-[#005a9e] dark:bg-[#0078D7] dark:hover:bg-[#005a9e]'
              : 'bg-[#e1e1e1] text-black border-transparent hover:bg-[#d8d8d8] hover:border-[#cccccc] dark:bg-zinc-800 dark:text-white dark:border-zinc-600 dark:hover:border-zinc-500 dark:hover:bg-zinc-700'
          }`}
        >
          {learned ? 'Known' : 'Mark as Known'}
        </button>
      </td>
      <td className="p-1 text-center w-12">
        <button
          onClick={handleRemove}
          title="Listeden Kaldır"
          className="w-full h-full min-h-[40px] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-white hover:bg-[#e81123] transition-none"
        >
          ✕
        </button>
      </td>
    </tr>
  );
}
