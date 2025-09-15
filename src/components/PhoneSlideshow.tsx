// src/components/PhoneSlideshow.tsx  (classic version)
import React, { useEffect, useRef, useState } from "react";

type Slide = { src: string; caption?: string };

export default function PhoneSlideshow({
  slides,
  barHeight = 22,
  intervalMs = 3500,
  showStatusBar = true,
  showFooterBar = true,
}: {
  slides: Slide[];
  barHeight?: number;
  intervalMs?: number;
  showStatusBar?: boolean;
  showFooterBar?: boolean;
}) {
  const [i, setI] = useState(0);
  const timer = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const next = () => setI((p) => (p + 1) % slides.length);
  const prev = () => setI((p) => (p - 1 + slides.length) % slides.length);

  // autoplay
  useEffect(() => {
    if (slides.length <= 1) return;
    timer.current = window.setInterval(next, intervalMs);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [intervalMs, slides.length]);

  const pause = () => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  };
  const resume = () => {
    if (!timer.current && slides.length > 1) {
      timer.current = window.setInterval(next, intervalMs);
    }
  };

  const onTouchStart: React.TouchEventHandler = (e) => {
    touchStartX.current = e.touches[0].clientX;
    pause();
  };
  const onTouchEnd: React.TouchEventHandler = (e) => {
    const start = touchStartX.current;
    if (start == null) return resume();
    const dx = e.changedTouches[0].clientX - start;
    if (Math.abs(dx) > 40) (dx > 0 ? prev() : next());
    touchStartX.current = null;
    resume();
  };

  return (
    <div
      className="mx-auto w-full max-w-sm aspect-[9/18] rounded-[2rem] border border-black/10 dark:border-white/10 bg-[#111] overflow-hidden relative"
      onMouseEnter={pause}
      onMouseLeave={resume}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Status bar (classic) */}
      {showStatusBar && (
        <div
          className="absolute left-0 right-0 top-0 z-10 px-3 flex items-center justify-between text-[11px] text-white/80"
          style={{ height: barHeight }}
        >
          <span>Cardbey Store</span>
          <span>9:41</span>
        </div>
      )}

      {/* Slides */}
      <div className="absolute inset-0">
        {slides.map((s, idx) => (
          <img
            key={idx}
            src={s.src}
            alt={s.caption || `Slide ${idx + 1}`}
            className={[
              "absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out",
              idx === i ? "opacity-100" : "opacity-0",
            ].join(" ")}
            draggable={false}
          />
        ))}

        {/* Classic dark gradient over the image */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/40 via-transparent via-70% to-black/65" />
      </div>

      {/* Footer bar with caption + dots */}
      {showFooterBar && (
        <div className="absolute bottom-0 left-0 right-0 z-20 h-16 bg-black/70 backdrop-blur-sm text-white">
          <div className="h-full px-4 flex items-center justify-between gap-3">
            <div className="text-[13px] leading-5 line-clamp-2">
              {slides[i]?.caption}
            </div>
            <div className="flex items-center gap-1.5">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setI(idx)}
                  className={[
                    "h-1.5 w-1.5 rounded-full transition",
                    idx === i ? "bg-white" : "bg-white/40 hover:bg-white/70",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Arrows */}
      <button
        aria-label="Previous"
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 grid place-items-center rounded-full bg-black/35 text-white hover:bg-black/45"
      >
        ‹
      </button>
      <button
        aria-label="Next"
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 w-8 h-8 grid place-items-center rounded-full bg-black/35 text-white hover:bg-black/45"
      >
        ›
      </button>
    </div>
  );
}
