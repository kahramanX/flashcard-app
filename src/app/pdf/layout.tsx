import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PDF Word Lists",
  description: "Printable word lists organized by level",
};

export default function PdfLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="!bg-white !text-black" style={{ colorScheme: 'light' }}>
      {children}
    </div>
  );
}
