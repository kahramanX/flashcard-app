import fs from 'fs';
import path from 'path';
import Link from 'next/link';
import WordRow from '../WordRow';

export default async function UnknownLevelPage(props: { params: Promise<{ level: string }> }) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const params = await props.params;
  const decodedLevel = decodeURIComponent(params.level);
  
  let unknownWords: any[] = [];
  try {
    const unknownPath = path.join(process.cwd(), 'unknown_words.json');
    if (fs.existsSync(unknownPath)) {
      const unknownContents = await fs.promises.readFile(unknownPath, 'utf8');
      unknownWords = JSON.parse(unknownContents);
    }
  } catch (error) {
    console.error('Failed to load unknown_words.json:', error);
  }

  // Filter words by this level
  const levelWords = unknownWords.filter(w => {
    const wordStr = typeof w.word === 'string' ? w.word.trim() : "";
    if (!/^[a-zA-Z\-\s']+$/.test(wordStr)) return false;
    
    let wLevel = typeof w.level === 'string' ? w.level.trim() : "Unknown";
    if (wLevel === "") wLevel = "Unknown";
    
    return wLevel.toLowerCase() === decodedLevel.toLowerCase();
  });

  // Sort words alphabetically
  levelWords.sort((a, b) => {
    const wordA = a.word || "";
    const wordB = b.word || "";
    return wordA.localeCompare(wordB);
  });

  // To display the properly capitalized level name:
  const displayLevel = levelWords.length > 0 && levelWords[0].level 
    ? levelWords[0].level.trim() 
    : decodedLevel;

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white flex flex-col">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-300 dark:border-zinc-700">
          <h1 className="text-3xl font-bold">Unknown Words for Level: {displayLevel}</h1>
          <Link 
            href="/unknown"
            className="px-4 py-2 bg-[#0078D7] hover:bg-[#005a9e] text-white transition-none text-sm font-normal border border-transparent focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded-none"
          >
            ← Back to Unknown Levels
          </Link>
        </div>

        {/* Content */}
        {levelWords.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none text-center">
            <h2 className="text-xl font-bold mb-2">No Words Found</h2>
            <p className="text-gray-600 dark:text-gray-400">No unknown words found for level {decodedLevel}.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-4 border-b-2 border-[#0078D7] pb-2 inline-block">
                Level {displayLevel} <span className="text-gray-500 dark:text-gray-400 font-normal text-lg ml-2">({levelWords.length} Words)</span>
              </h2>
              
              <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-1 rounded-none overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-gray-200 dark:bg-zinc-700 border-b border-gray-300 dark:border-zinc-600">
                      <th className="p-3 font-semibold w-16 text-center border-r border-gray-300 dark:border-zinc-600">No.</th>
                      <th className="p-3 font-semibold border-r border-gray-300 dark:border-zinc-600">Word</th>
                      <th className="p-3 font-semibold border-r border-gray-300 dark:border-zinc-600">Type</th>
                      <th className="p-3 font-semibold w-32 text-center border-r border-gray-300 dark:border-zinc-600">Status</th>
                      <th className="p-3 font-semibold w-12 text-center"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelWords.map((word, index) => (
                      <WordRow key={word.id} word={word} index={index} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
