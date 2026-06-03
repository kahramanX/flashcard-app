'use client';

import { useState } from 'react';

export default function PdfDownloadButton({ filename = 'document.pdf' }: { filename?: string }) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      // Dinamik import ile Server-Side Rendering (SSR) hatalarını önlüyoruz
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.getElementById('pdf-content');
      
      if (!element) {
        console.error('PDF content element not found');
        return;
      }

      const opt = {
        margin:       10,
        filename:     filename,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true,
          onclone: (clonedDoc: Document) => {
            // ACİL DÜZELTME: html2canvas DOM'u gezerken hesaplanmış stilleri okur.
            // Tailwind v4 arkaplan/metin renkleri için oklch döndürür ve parser çöker.
            // Bunu aşmak için klonlanan tüm elementlere zorla HEX inline stilleri basıyoruz.
            const allElements = clonedDoc.querySelectorAll('*');
            allElements.forEach((el: any) => {
              const cn = typeof el.className === 'string' ? el.className : '';
              
              // Varsayılan PDF arkaplanı ve metin rengi
              el.style.backgroundColor = '#ffffff';
              el.style.color = '#000000';
              
              // Gri tonları
              if (cn.includes('text-gray-400')) el.style.color = '#9ca3af';
              else if (cn.includes('text-gray-500')) el.style.color = '#6b7280';
              
              // Çerçeveler
              if (cn.includes('border')) {
                if (cn.includes('border-black')) el.style.borderColor = '#000000';
                else if (cn.includes('border-gray-100')) el.style.borderColor = '#f3f4f6';
                else el.style.borderColor = '#e5e7eb';
              }
            });
            
            // Stil etiketlerindeki oklch referanslarını da temizleyelim
            const styles = Array.from(clonedDoc.querySelectorAll('style'));
            styles.forEach(style => {
              if (style.innerHTML) {
                style.innerHTML = style.innerHTML.replace(/oklch\([^)]+\)/gi, 'rgb(0,0,0)');
              }
            });
          }
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      className="text-sm bg-blue-600 text-white px-4 py-1 hover:bg-blue-700 transition-colors disabled:opacity-50"
      onClick={handleDownload}
      disabled={isDownloading}
    >
      {isDownloading ? '⏳ İndiriliyor...' : '📥 PDF İndir'}
    </button>
  );
}
