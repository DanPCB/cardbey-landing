// src/components/CayaPromo.tsx
import React from "react";
import step1 from "@/assets/slides/step1_upload.png";
import step2 from "@/assets/slides/step2_ai_create.png";
import step3 from "@/assets/slides/step3_review.png";
import step4 from "@/assets/slides/step4_share.png";

const slides = [
  { img: step1, caption: "Upload a menu, flyer, or business card" },
  { img: step2, caption: "Caya reads items, categories, prices, contacts" },
  { img: step3, caption: "Review & tweak your auto-built store" },
  { img: step4, caption: "Share the link or scan QR to go live" },
];

export default function CayaPromo(): JSX.Element {
  const [idx, setIdx] = React.useState(0);

  // autoplay
  React.useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 2500);
    return () => clearInterval(id);
  }, []);

  // preload images (avoids first-fade flash)
  React.useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.img;
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-sm aspect-[9/18] rounded-[2rem] border border-black/10 dark:border-white/10 bg-black text-white overflow-hidden relative">
      {/* Thin status bar */}
      <div className="p-3 flex items-center justify-between text-[11px] text-gray-400">
        <span>Cardbey Store</span>
        <span>9:41</span>
      </div>

      {/* Slide area */}
      <div className="relative h-[78%] pb-20">
        {slides.map((s, i) => (
          <img
            key={i}
            src={s.img}
            alt={s.caption}
            className={[
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ease-in-out",
              i === idx ? "opacity-100" : "opacity-0",
            ].join(" ")}
            draggable={false}
          />
        ))}

        {/* Caya chip (kept above footer + safe-area aware) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 rounded-2xl bg-white/95 text-black px-4 py-3 shadow-xl backdrop-blur-sm flex items-center gap-3 ring-1 ring-black/10"
          style={{
            // Lift ~56px above bottom + safe area inset (iOS)
            bottom: "calc(56px + env(safe-area-inset-bottom, 0px))",
          }}
          aria-live="polite"
        >
          <div className="relative h-8 w-8 rounded-full border border-black/10 grid place-items-center">
            <div className="h-5 w-5 rounded-full border-2 border-black/80" />
            <div className="absolute -right-1 -bottom-1 h-2 w-2 rounded-full bg-violet-500 animate-pulse" />
          </div>
          <div className="text-sm font-medium">Caya is working…</div>
          <div className="flex gap-1 ml-1" aria-hidden="true">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:120ms]" />
            <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-bounce [animation-delay:240ms]" />
          </div>
        </div>
      </div>

      {/* Caption + dots */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
        <div className="text-center text-[13px] text-gray-200" aria-live="polite">
          {slides[idx].caption}
        </div>
        <div className="mt-2 flex items-center justify-center gap-1.5">
          {slides.map((_, i) => (
            <span
              key={i}
              className={[
                "h-1.5 w-1.5 rounded-full",
                i === idx ? "bg-white" : "bg-white/40",
              ].join(" ")}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
