import Link from 'next/link';
import { api } from '@/lib/api';
import PrintButton from '../PrintButton';

export default async function PdfAllWordsPage() {
  const allWords = await api.getAllWords();

  // Group by level
  const grouped: Record<string, { word: string; type: string; meaning: string }[]> = {};

  allWords.forEach(w => {
    const wordStr = typeof w.word === 'string' ? w.word.trim() : '';
    if (!wordStr || !/^[a-zA-Z\-\s']+$/.test(wordStr)) return;

    let level = typeof w.level === 'string' ? w.level.trim() : 'Unknown';
    if (level === '') level = 'Unknown';

    if (!grouped[level]) grouped[level] = [];
    grouped[level].push({
      word: wordStr,
      type: w.type || '',
      meaning: '', // Türkçe anlam sonra eklenecek
    });
  });

  // Sort levels: A1, A2, B1, B2, C1, C2, Unknown
  const levelOrder = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Unknown'];
  const sortedLevels = Object.keys(grouped).sort((a, b) => {
    const ia = levelOrder.indexOf(a);
    const ib = levelOrder.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });

  // Sort words alphabetically within each level
  sortedLevels.forEach(level => {
    grouped[level].sort((a, b) => a.word.localeCompare(b.word));
  });

  const totalWords = Object.values(grouped).reduce((sum, arr) => sum + arr.length, 0);

  return (
    <main className="bg-white text-black font-sans print:text-[11px]" style={{ colorScheme: 'light' }}>
      {/* Screen-only navigation */}
      <div className="p-4 border-b border-gray-200 flex justify-between items-center print:hidden">
        <h1 className="text-lg font-bold">All Words ({totalWords})</h1>
        <div className="flex gap-3">
          <Link href="/pdf" className="text-sm text-gray-500 hover:text-black transition-colors">
            ← PDF Sayfası
          </Link>
          <PrintButton />
        </div>
      </div>

      {/* Printable content */}
      <div className="px-6 py-4 print:px-2 print:py-0">
        {sortedLevels.map(level => (
          <div key={level} className="mb-4 print:mb-2 break-inside-avoid-page">
            {/* Level header */}
            <h2 className="text-base font-bold border-b-2 border-black pb-1 mb-2 print:text-sm print:mb-1 print:pb-0.5 uppercase tracking-wide">
              Level {level}
              <span className="font-normal text-gray-500 text-xs ml-2 normal-case tracking-normal">
                ({grouped[level].length} kelime)
              </span>
            </h2>

            {/* Words in compact multi-column layout */}
            <div className="columns-2 sm:columns-3 md:columns-4 print:columns-4 gap-x-4 text-[12px] print:text-[10px] leading-tight">
              {grouped[level].map((item, i) => (
                <div key={`${level}-${i}`} className="break-inside-avoid py-[1px] flex justify-between border-b border-gray-100 print:border-gray-200">
                  <span className="font-medium text-black">{item.word}</span>
                  <span className="text-gray-400 ml-1 text-[10px] print:text-[9px] italic shrink-0">
                    {item.meaning || item.type || '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
