"use client";

import { Geist_Mono } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const geistMono = Geist_Mono({
  subsets: ["latin"],
});

const codeLines = [
  "$ sudo apt-get install coffee",
  "Reading package lists... ☕",
  "$ coffee --run",
  "// Behind every successful program there is coffee.",
];

export default function TerminalJoke() {
  const [displayedLines, setDisplayedLines] = useState<string[]>([""]);
  const [currentLine, setCurrentLine] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (currentLine >= codeLines.length) {
      // Loop: reset after a short delay
      setTimeout(() => {
        setDisplayedLines([""]);
        setCurrentLine(0);
        setCharIndex(0);
        setIsDone(false);
      }, 1200);
      return;
    }
    if (charIndex <= codeLines[currentLine].length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedLines((prev) => {
          const newLines = [...prev];
          newLines[currentLine] = codeLines[currentLine].slice(0, charIndex);
          return newLines;
        });
        setCharIndex((c) => c + 1);
      }, 40);
    } else {
      setTimeout(() => {
        setDisplayedLines((prev) => [...prev, ""]);
        setCurrentLine((l) => l + 1);
        setCharIndex(0);
      }, 500);
    }
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current);
    };
  }, [charIndex, currentLine]);

  return (
    <div className="w-full flex items-center justify-center">
      <div className="bg-[#18181b] border border-border rounded-xl shadow-lg p-6 w-full max-w-xl min-h-[220px] relative font-mono text-base text-green-400">
        {/* Terminal header */}
        <div className="absolute left-0 top-0 w-full flex items-center gap-2 px-4 py-2 bg-[#232326] rounded-t-xl border-b border-border">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-400 inline-block"></span>
          <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
          <span className="ml-4 text-xs text-gray-400">
            terminal-joke@dev:~
          </span>
        </div>
        <div className={`${geistMono.className} pt-8 pb-2 min-h-[140px]`}>
          {displayedLines.map((line, i) => (
            <div key={i} className="leading-relaxed">
              <span>{line}</span>
              {i === currentLine && !isDone && (
                <span className="animate-pulse">█</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
