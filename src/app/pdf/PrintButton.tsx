'use client';

export default function PrintButton() {
  return (
    <button
      className="text-sm bg-black text-white px-4 py-1 hover:bg-gray-800 transition-colors"
      onClick={() => window.print()}
    >
      🖨️ Yazdır
    </button>
  );
}
