import fs from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function UnknownWordsPage() {
  let unknownWords = [];
  try {
    const filePath = path.join(process.cwd(), 'unknown_words.json');
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      unknownWords = JSON.parse(fileContents);
    }
  } catch (error) {
    console.error('Failed to load unknown_words.json:', error);
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-white flex flex-col">
      <div className="max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-300 dark:border-zinc-700">
          <h1 className="text-3xl font-bold">Unknown Words List</h1>
          <Link 
            href="/"
            className="px-4 py-2 bg-[#0078D7] hover:bg-[#005a9e] text-white transition-none text-sm font-normal border border-transparent focus:outline-none focus:ring-1 focus:ring-black dark:focus:ring-white rounded-none"
          >
            ← Back to Flashcards
          </Link>
        </div>

        {/* Content */}
        {unknownWords.length === 0 ? (
          <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-8 rounded-none text-center">
            <h2 className="text-xl font-bold mb-2">No Unknown Words</h2>
            <p className="text-gray-600 dark:text-gray-400">You haven't marked any words as unknown yet.</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 p-1 rounded-none">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-200 dark:bg-zinc-700 border-b border-gray-300 dark:border-zinc-600">
                  <th className="p-3 font-semibold w-12 text-center border-r border-gray-300 dark:border-zinc-600">#</th>
                  <th className="p-3 font-semibold border-r border-gray-300 dark:border-zinc-600">Word</th>
                  <th className="p-3 font-semibold border-r border-gray-300 dark:border-zinc-600">Type</th>
                  <th className="p-3 font-semibold">Level</th>
                </tr>
              </thead>
              <tbody>
                {unknownWords.map((word: any, index: number) => (
                  <tr 
                    key={word.id} 
                    className="border-b border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700/50 transition-colors"
                  >
                    <td className="p-3 text-center border-r border-gray-200 dark:border-zinc-700 text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="p-3 font-bold border-r border-gray-200 dark:border-zinc-700">
                      {word.word}
                    </td>
                    <td className="p-3 border-r border-gray-200 dark:border-zinc-700">
                      {word.type}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-zinc-900 border border-gray-300 dark:border-zinc-600 text-sm">
                        {word.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
