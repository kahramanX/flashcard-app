import React from "react";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100/50 dark:bg-zinc-900/50 z-50 backdrop-blur-sm">
      <Loader2 className="w-16 h-16 text-[#0078D7] animate-spin" />
    </div>
  );
}
