import FlashcardApp from '@/components/FlashcardApp';
import { api } from '@/lib/api';

export default async function Page() {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const initialWords = await api.getAllWords();
  const unknownWords = await api.getUnknownWords();
  const initialUnknownIds = unknownWords.map(w => w.id);

  return (
    <main className="min-h-screen p-4 flex flex-col justify-center items-center">
      <FlashcardApp initialWords={initialWords} initialUnknownIds={initialUnknownIds} />
    </main>
  );
}
