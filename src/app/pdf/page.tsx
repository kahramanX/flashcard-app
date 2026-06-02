import Link from 'next/link';

export default function PdfIndexPage() {
  return (
    <main className="min-h-screen bg-white text-black font-sans p-8 print:p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">PDF Word Lists</h1>
        <p className="text-center text-gray-500 mb-10 text-sm">
          Yazdırmak için bir liste seçin
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-xl mx-auto">
          <Link
            href="/pdf/unknown"
            className="block border border-gray-300 p-8 text-center hover:border-black transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">Unknown Words</h2>
            <p className="text-gray-500 text-sm">Bilinmeyen kelimeler – level bazlı</p>
          </Link>

          <Link
            href="/pdf/all-words"
            className="block border border-gray-300 p-8 text-center hover:border-black transition-colors"
          >
            <h2 className="text-xl font-bold mb-2">All Words</h2>
            <p className="text-gray-500 text-sm">Tüm kelimeler – level bazlı</p>
          </Link>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-gray-400 hover:text-black transition-colors"
          >
            ← Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    </main>
  );
}
