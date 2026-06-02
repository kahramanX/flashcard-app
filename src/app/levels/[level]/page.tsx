import Link from 'next/link';
import MarkUnknownButton from '@/components/MarkUnknownButton';
import { api } from '@/lib/api';

export default async function LevelPage(props: { params: Promise<{ level: string }> }) {
  await new Promise(resolve => setTimeout(resolve, 1000));
  const params = await props.params;
  const decodedLevel = decodeURIComponent(params.level);
  
  const levelWords = await api.getWordsByLevel(decodedLevel);
  const unknownWords = await api.getUnknownWords();
  const unknownIds = new Set(unknownWords.map(w => w.id));

  // To display the properly capitalized level name:
  const displayLevel = levelWords.length > 0 && levelWords[0].level 
    ? levelWords[0].level.trim() 
    : decodedLevel;

  return (
    <main className="min-h-screen p-4 sm:p-8 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white flex flex-col">
      <div className="max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-gray-300 dark:border-zinc-700">
          <h1 className="text-2xl sm:text-3xl font-bold">Words for Level: {displayLevel}</h1>
          <Link 
            href="/levels"
            className="px-4 py-2 bg-[#0078D7] hover:bg-[#005a9e] text-white transition-none text-sm font-normal border border-transparent focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded-none"
          >
            ← Back to Levels
          </Link>
        </div>

        {/* Content */}
        {levelWords.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none text-center">
            <h2 className="text-xl font-bold mb-2">No Words Found</h2>
            <p className="text-gray-600 dark:text-gray-400">No words found for level {decodedLevel}.</p>
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
                      <th className="p-3 font-semibold border-r border-gray-300 dark:border-zinc-600">Meaning</th>
                      <th className="p-3 font-semibold w-36 text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {levelWords.map((word, index) => (
                      <tr 
                        key={word.id} 
                        className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-none group"
                      >
                        <td className="p-3 text-center border-r border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400 group-hover:bg-gray-100 group-hover:dark:bg-zinc-600 transition-none">
                          {index + 1}
                        </td>
                        <td className="p-3 font-bold border-r border-gray-200 dark:border-zinc-700 text-win-blue dark:text-blue-400">
                          {word.word}
                        </td>
                        <td className="p-3 border-r border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200">
                          {word.type}
                        </td>
                        <td className="p-3 border-r border-gray-200 dark:border-zinc-700 text-gray-800 dark:text-gray-200">
                          {(word as any).meaning || ''}
                        </td>
                        <td className="p-2 flex justify-center items-center">
                          <MarkUnknownButton word={word} isInitiallyUnknown={unknownIds.has(word.id)} />
                        </td>
                      </tr>
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
