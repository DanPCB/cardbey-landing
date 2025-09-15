// src/components/CayaButton.tsx
import React from "react";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cayaAvatar from "@/assets/caya-avatar.png";

export default function CayaFab({ onClick }: { onClick: () => void }) {

  // Show nudge if user arrived "from Caya"
  useEffect(() => {
    const url = new URL(window.location.href);
    const fromCaya =
      url.searchParams.get("from") === "caya" || url.searchParams.get("caya") === "1";
    if (!fromCaya) return;

    setShowNudge(true);
    const t = setTimeout(() => setShowNudge(false), 7000);
    const onScroll = () => setShowNudge(false);
    window.addEventListener("scroll", onScroll, { once: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const openChat = () => {
    setShowNudge(false);
    onClick();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60]">
  <div className="relative">
    {/* Avatar 2× */}
    <button
      onClick={onClick}
      aria-label="Chat with Caya"
      className="block h-32 w-32 rounded-full bg-white overflow-hidden
                 ring-1 ring-black/10 shadow-xl hover:shadow-2xl transition"
    >
      <img src={cayaAvatar} alt="Caya" className="h-full w-full object-cover" />
    </button>

    {/* Pill outside */}
    <button
      onClick={onClick}
      aria-label="Open chat"
      className="absolute -bottom-3 -right-3 h-9 min-w-[44px] px-3 rounded-full bg-white
                 shadow ring-1 ring-black/10 flex items-center justify-center gap-1"
    >
      <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
      <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:120ms]" />
      <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:240ms]" />
    </button>
  </div>
</div>

  );
}