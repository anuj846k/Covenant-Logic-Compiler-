"use client";

import { cn } from "@/lib/utils";

export function ClassicLoader({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border-primary flex h-10 w-10 animate-spin items-center justify-center rounded-full border-4 border-t-transparent",
        className
      )}
    />
  );
}

export function ConcentricLoader() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      <div className="flex h-16 w-16 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-cyan-400 text-4xl text-cyan-400">
        <div className="flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-transparent border-t-rose-400 text-2xl text-rose-400"></div>
      </div>
    </div>
  );
}
