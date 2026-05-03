import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function LevelsIndexPage() {
  let allWords: any[] = [];
  try {
    const filePath = path.join(process.cwd(), 'words.json');
    if (fs.existsSync(filePath)) {
      const fileContents = await fs.promises.readFile(filePath, 'utf8');
      allWords = JSON.parse(fileContents);
    }
  } catch (error) {
    console.error('Failed to load words.json:', error);
  }

  // Find all unique levels
  const levelCounts: Record<string, number> = {};
  
  allWords.forEach(w => {
    const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
    if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) {
      return;
    }

    let level = typeof w.level === 'string' ? w.level.trim() : "Unknown";
    if (level === "") level = "Unknown";

    if (!levelCounts[level]) {
      levelCounts[level] = 0;
    }
    levelCounts[level]++;
  });

  const sortedLevels = Object.keys(levelCounts).sort();

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white flex flex-col">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 dark:border-zinc-700">
          <h1 className="text-3xl font-bold">All Words by Level</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-[#0078D7] hover:bg-[#005a9e] text-white transition-none text-sm font-normal border border-transparent focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded-none"
          >
            ← Back to Flashcards
          </Link>
        </div>

        {/* Content */}
        {sortedLevels.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none text-center">
            <h2 className="text-xl font-bold mb-2">No Words Found</h2>
            <p className="text-gray-600 dark:text-gray-400">words.json is empty or not loaded.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedLevels.map(level => (
              <Link
                key={level}
                href={`/levels/${encodeURIComponent(level)}`}
                className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-6 rounded-none hover:border-[#0078D7] dark:hover:border-[#0078D7] hover:shadow-md transition-all group flex justify-between items-center"
              >
                <div className="flex flex-col">
                  <span className="text-2xl font-bold group-hover:text-[#0078D7] transition-colors">Level {level}</span>
                  <span className="text-gray-500 dark:text-gray-400 mt-1">{levelCounts[level]} Words</span>
                </div>
                <div className="text-gray-400 group-hover:text-[#0078D7] group-hover:translate-x-1 transition-transform">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"></path>
                    <path d="m12 5 7 7-7 7"></path>
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
