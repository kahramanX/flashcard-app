import fs from 'fs';
import path from 'path';
import FlashcardApp from '@/components/FlashcardApp';

export default async function Page() {
  let initialWords = [];
  let initialUnknownIds = [];
  
  try {
    const filePath = path.join(process.cwd(), 'words.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    initialWords = JSON.parse(fileContents);
  } catch (error) {
    console.error('Failed to load words.json:', error);
  }

  try {
    const unknownPath = path.join(process.cwd(), 'unknown_words.json');
    const unknownContents = fs.readFileSync(unknownPath, 'utf8');
    const unknownWords = JSON.parse(unknownContents);
    initialUnknownIds = unknownWords.map((w: any) => w.id);
  } catch (error) {
    console.error('Failed to load unknown_words.json:', error);
  }

  return (
    <main className="min-h-screen p-4 flex flex-col justify-center items-center">
      <FlashcardApp initialWords={initialWords} initialUnknownIds={initialUnknownIds} />
    </main>
  );
}
