// src/pages/Home.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { QRCodeSVG } from "qrcode.react";
import bgVideo from "../assets/sample.mp4";
import heroMp4 from "@/assets/hero.mp4";
import cardbeyLogo from "../assets/cardbey-logo.png";
import Pricing from "../components/Pricing";
import phoneVideo from "@/assets/phone-showcase.mp4";
import step1 from "../assets/slides/step1_upload.png";
import step2 from "../assets/slides/step2_ai_create.png";
import step3 from "../assets/slides/step3_review.png";
import step4 from "../assets/slides/step4_share.png";
import LanguageToggle from "../components/LanguageToggle";
// If you don't have path aliases, keep these relative imports:
import CayaChat from "../components/CayaChat";
import CayaButton from "../components/CayaButton";

function Page({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } }}
      exit={{ opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } }}
    >
      {children}
    </motion.div>
  );
}


// --- Replace these with live links before shipping ---
const STRIPE_LINK = "https://buy.stripe.com/5kQaEYbR6gNCgdZc3m9R601";
const DEMO_LINK = "https://cardbey.com/";
const SUPPORT_PHONE_TEL = "tel:+61451867365";
const SUPPORT_PHONE_DISPLAY = "+61 0451 867 365";
const QR_URL = "https://cardbey.com/signup/ocr";

// Minimal i18n dictionary
const i18n = {
  en: {
    "lang.label": "EN",
    "lang.alt": "Switch to Vietnamese",
    "nav.how": "How it works",
    "nav.why": "Why Cardbey",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact",
    "hero.title": "From Menu to Digital Store",
    "hero.sub":
      "Your gateway into Cardbey: ads, loyalty, and smart delivery — all from a single AI-created store.",
    "cta.buy": "Create Free Account",
    "cta.upload": "Upload menu / card to Test",
    "cta.demo": "See demo store →",
    "showcase.title": "AI builds your store. You just share the link.",
    "showcase.bullet1":
      "Snap a photo of your menu, flyer, or card to create store — no typing needed.",
    "showcase.bullet2":
      "Auto-organized categories, items, prices, contact details.",
    "showcase.bullet3": "Multi-language fields (EN/VI) out of the box.",
    "showcase.bullet4":
      "Upgrade later: screen ads, loyalty, delivery, CAI credits.",
    "how.title": "How it works",
    "how.sub":
      "From paper to pixels. Upgrade any time to ads, loyalty, or delivery.",
    "contact.title": "Questions? Want a callback?",
    "contact.sub":
      "Leave a note and we’ll get back within a business day. Or email",
  },
  vi: {
    "lang.label": "VI",
    "lang.alt": "Chuyển sang tiếng Anh",
    "nav.how": "Cách hoạt động",
    "nav.why": "Vì sao Cardbey",
    "nav.pricing": "Giá",
    "nav.contact": "Liên hệ",
    "hero.title": "Từ menu giấy đến cửa hàng số",
    "hero.sub":
      "Cổng vào Cardbey: quảng cáo, tích điểm và giao nhận — tất cả từ một cửa hàng do AI tạo.",
    "cta.buy": "Tạo Cửa Hàng Miễn Phí",
    "cta.upload": "Tải menu / danh thiếp",
    "cta.demo": "Xem cửa hàng mẫu →",
    "showcase.title": "AI dựng cửa hàng. Bạn chỉ cần chia sẻ liên kết.",
    "showcase.bullet1":
      "Chụp menu/tờ rơi/danh thiếp để tạo cửa hàng — không cần gõ.",
    "showcase.bullet2": "Tự sắp xếp danh mục, món hàng, giá, liên hệ.",
    "showcase.bullet3": "Sẵn trường đa ngôn ngữ (EN/VI).",
    "showcase.bullet4":
      "Nâng cấp sau: màn hình quảng cáo, tích điểm, giao hàng, CAI.",
    "how.title": "Cách hoạt động",
    "how.sub": "Từ giấy lên số. Có thể nâng cấp bất cứ lúc nào.",
    "contact.title": "Cần tư vấn? Muốn gọi lại?",
    "contact.sub":
      "Để lại lời nhắn, chúng tôi sẽ phản hồi trong 1 ngày làm việc. Hoặc email",
  },
} as const;

type Lang = keyof typeof i18n;

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li className="flex items-start gap-3 text-[15px] text-[#6e6e73] dark:text-zinc-300">
    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-[color:var(--brand-blue)]" aria-hidden />
    {children}
  </li>
);

const Tile: React.FC<{ title: string; href: string; children: React.ReactNode }> = ({
  title,
  href,
  children,
}) => (
  <a
    href={href}
    className="group tile rounded-3xl border border-black/10 dark:border-white/10 bg-[#f5f5f7] dark:bg-zinc-900 p-10 transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(0,0,0,.08)]"
  >
    <h3 className="text-2xl font-semibold">{title}</h3>
    <p className="mt-3 text-[#6e6e73] dark:text-zinc-300 text-[15px]">{children}</p>
    <span className="mt-6 inline-block text-[color:var(--brand-blue)] group-hover:underline">
      Learn more →
    </span>
  </a>
);

export default function Home(): JSX.Element {
  const [lang, setLang] = useState<Lang>("en");
  const [scrolled, setScrolled] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const t = useMemo(() => i18n[lang], [lang]);
  const year = new Date().getFullYear();

  /** ---------- Smooth section-by-section scrolling ---------- */
  const SECTION_IDS = ["sec-hero", "sec-showcase", "sec-features", "sec-how", "pricing", "sec-contact"];
  const [sections, setSections] = useState<HTMLElement[]>([]);

  // Auto-welcome once, with optional force param (?caya=welcome)
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const force = params.get("caya") === "welcome"; // ?caya=welcome
  if (force) localStorage.removeItem("caya-welcomed");

  const seen = localStorage.getItem("caya-welcomed");
  if (!seen || force) {
    const t = setTimeout(() => {
      setChatOpen(true);                          // opens the chat
      // If your CayaChat already seeds a first message, nothing else to do.
      // Otherwise you can push one via a custom event:
      window.dispatchEvent(new CustomEvent("caya:welcome", {
        detail: { text: "Hi, I’m Caya. Welcome to Cardbey! How can I help you today?" }
      }));
      localStorage.setItem("caya-welcomed", "1");
    }, 1500); // small, friendly delay
    return () => clearTimeout(t);
  }
}, []);

  useEffect(() => {
    const collect = () =>
      setSections(
        SECTION_IDS.map((id) => document.getElementById(id) as HTMLElement | null).filter(
          (el): el is HTMLElement => !!el
        )
      );
    collect();
    window.addEventListener("resize", collect);
    return () => window.removeEventListener("resize", collect);
  }, []);

  const smoothScrollToEl = (el: HTMLElement, duration = 1400) => {
    const start = window.scrollY;
    const end = el.getBoundingClientRect().top + window.scrollY;
    const change = end - start;
    const startTime = performance.now();
    const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / duration);
      window.scrollTo({ top: start + change * easeInOutCubic(t), left: 0 });
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const scrollToNextSection = () => {
    if (!sections.length) return;
    const y = window.scrollY + 1;
    let idx = sections.findIndex((el) => el.offsetTop > y + 10);
    if (idx === -1) idx = 0;
    smoothScrollToEl(sections[idx], 1400);
  };

  /** ---------- QR helpers ---------- */
  const qrSvgRef = useRef<SVGSVGElement | null>(null);
  const copyQrLink = async () => {
    try {
      await navigator.clipboard.writeText(QR_URL);
      alert("Link copied!");
    } catch {
      alert("Could not copy. Long-press the link to copy.");
    }
  };
  const downloadQrSvg = () => {
    const node = qrSvgRef.current;
    if (!node) return;
    const svg = new Blob([node.outerHTML], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svg);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cardbey-qr.svg";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  /** ---------- Language & header behavior ---------- */
  useEffect(() => {
    const prefersVI =
      typeof navigator !== "undefined" &&
      (navigator.language?.startsWith("vi") || navigator.languages?.some((l) => l.startsWith("vi")));
    if (prefersVI) setLang("vi");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <Page>
      <div className="min-h-screen bg-[#f5f5f7] dark:bg-zinc-950 text-[#1d1d1f] dark:text-white">
        {/* Top region bar */}
        <div className="hidden md:block bg-[#1d1d1f] text-gray-300 text-xs" aria-hidden>
          <div className="max-w-7xl mx-auto px-4 py-2 text-center">
            Choose another country or region to see content for your location.
          </div>
        </div>

        {/* Nav */}
        <header
          className={[
            "sticky top-0 z-50 transition-colors",
            scrolled
              ? "bg-[color:var(--brand-navy)]/95 border-b border-black/10 dark:border-white/10 backdrop-blur"
              : "bg-transparent",
          ].join(" ")}
        >
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
            <a href="#top" className="flex items-center gap-2">
              <img src={cardbeyLogo} alt="Cardbey logo" className="h-10 w-auto" />
            </a>

            <ul className="hidden md:flex items-center gap-6 text-[13px]">
              {[
                { label: t["nav.how"], href: "#sec-how" },
                { label: t["nav.why"], href: "#sec-features" },
                { label: t["nav.pricing"], href: "#pricing" },
                { label: t["nav.contact"], href: "#sec-contact" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="transition-colors text-black dark:text-white hover:text-[color:var(--brand-blue)]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <LanguageToggle lang={lang} onChange={setLang} />
              <a
                href="#pricing"
                className="text-[13px] bg-white text-[#1d1d1f] px-3 py-1.5 rounded-full font-medium hover:bg-gray-100"
              >
                Get started
              </a>
            </div>
          </nav>
        </header>

        {/* Smooth-step container */}
        <main id="top" className="snap-y snap-proximity">
          {/* HERO */}
          <section
            id="sec-hero"
            className="relative isolate h-screen pb-12 flex items-center justify-center snap-start"
          >
            
            <video
              className="absolute inset-0 -z-10 w-full h-full object-cover"
              src={bgVideo}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
            />
            <div className="absolute inset-0 bg-black/50 -z-10" />

            <div className="max-w-4xl mx-auto px-4 text-center text-white">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight tracking-tight">
                {t["hero.title"]}
              </h1>
              <p className="mt-4 text-lg sm:text-xl text-gray-200">{t["hero.sub"]}</p>

              <div className="mt-8 flex items-center justify-center gap-3">
                <a
                  href="https://cardbey.com/signup"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white px-6 h-11 text-[15px] font-medium transition"
                >
                  
                  {t["cta.buy"]}
                </a>

                <a
                  href="https://cardbey.com/signup/ocr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/30 text-white px-6 h-11 text-[15px] font-medium hover:bg-white/10"
                >
                  {t["cta.upload"]}
                </a>
              </div>

              <a
                href={DEMO_LINK}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-block text-[15px] text-blue-2 00 hover:text-white"
              >
                {t["cta.demo"]}
              </a>
            </div>
          </section>

          {/* SHOWCASE */}
          <section id="sec-showcase" className="bg-[#f5f5f7] dark:bg-zinc-900 snap-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">
                  {t["showcase.title"]}
                </h2>
                <ul className="mt-6 space-y-3">
                  <Bullet>{t["showcase.bullet1"]}</Bullet>
                  <Bullet>{t["showcase.bullet2"]}</Bullet>
                  <Bullet>{t["showcase.bullet3"]}</Bullet>
                  <Bullet>{t["showcase.bullet4"]}</Bullet>
                </ul>

                <div className="mt-8 flex items-center justify-center gap-3">
                  <a
                    href="https://cardbey.com/signup?utm_source=landing&from=caya"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue-600)] text-white px-6 h-11 text-[15px] font-medium transition"
                  >
                    {t["cta.buy"]}
                  </a>
                  <a
                    href="https://cardbey.com/signup/ocr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-[color:var(--brand-blue)] text-[color:var(--brand-blue)] px-6 h-11 text-[15px] font-medium hover:bg-[color:var(--brand-blue)] hover:text-white transition"
                  >
                    {t["cta.upload"]}
                  </a>
                </div>

                {/* QR */}
                <div className="mt-6 flex flex-col items-start md:items-center">
                  <div className="rounded-2xl bg-white p-4 shadow-sm">
                    <QRCodeSVG
                      value={QR_URL}
                      size={160}
                      includeMargin={false}
                      level="M"
                      fgColor="#111827"
                      bgColor="#ffffff"
                      ref={qrSvgRef}
                    />
                  </div>
                  <p className="mt-2 text-sm text-[#6e6e73] dark:text-zinc-300">Scan to start on your phone</p>
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button
                      onClick={copyQrLink}
                      className="h-9 px-3 rounded-lg border text-sm hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Copy link
                    </button>
                    <button
                      onClick={downloadQrSvg}
                      className="h-9 px-3 rounded-lg border text-sm hover:bg-black/5 dark:hover:bg-white/10"
                    >
                      Download QR
                    </button>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2">
  {/* Phone frame + video */}
  <div className="relative mx-auto w-full max-w-[380px]">
    <div className="relative aspect-[9/19.5] overflow-hidden rounded-[36px] border border-black/10 shadow-2xl bg-black">
      {/* optional: simple status bar */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black/30 to-transparent z-10" />

      <video
        className="h-full w-full object-cover"
        src={phoneVideo /* or heroMp4 */}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      />

      {/* optional: simple footer bar */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black/25 to-transparent z-10" />
    </div>
  </div>
</div>
</div>
          </section>

          {/* FEATURES */}
          <section id="sec-features" className="bg-white dark:bg-zinc-950 snap-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid md:grid-cols-3 gap-6">
              <Tile title="Zero setup" href="#sec-how">OCR → store in minutes. No plugins, no theme wrangling.</Tile>
              <Tile title="Beyond a website" href="#sec-features">Plug into screens, loyalty, delivery — when you’re ready.</Tile>
              <Tile title="Simple price" href="#pricing">One-time setup. Add-ons as you grow.</Tile>
            </div>
          </section>

          {/* HOW */}
          <section id="sec-how" className="bg-[#f5f5f7] dark:bg-zinc-900 snap-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1">
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t["how.title"]}</h2>
                <p className="mt-3 text-[#6e6e73] dark:text-zinc-300 text-[15px]">{t["how.sub"]}</p>
              </div>
              <div className="lg:col-span-2 grid md:grid-cols-3 gap-6">
                {[
                  { step: 1, title: lang === "vi" ? "Tải lên" : "Upload", desc: lang === "vi" ? "Ảnh/PDF menu, tờ rơi hoặc danh thiếp." : "Photo/PDF of your menu, flyer, or card." },
                  { step: 2, title: lang === "vi" ? "AI tạo" : "AI creates", desc: lang === "vi" ? "Món, danh mục, giá, liên hệ." : "Items, categories, prices, contact details." },
                  { step: 3, title: lang === "vi" ? "Chia sẻ" : "Share", desc: lang === "vi" ? "Nhận liên kết sẵn sàng trên di động." : "Get a mobile-ready link to post anywhere." },
                ].map((s) => (
                  <div key={s.step} className="rounded-3xl bg-white dark:bg-zinc-950 border border-black/10 dark:border-white/10 p-8">
                    <div className="text-sm font-medium text-[#6e6e73] dark:text-zinc-300">Step {s.step}</div>
                    <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                    <p className="mt-2 text-[15px] text-[#6e6e73] dark:text-zinc-300">{s.desc}</p>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-3 flex justify-center">
                <a
                  href="https://cardbey.com/signup/ocr"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 rounded-full bg-blue-600 text-white font-semibold shadow-md hover:bg-blue-700 transition"
                >
                  Try now
                </a>
              </div>
            </div>
          </section>

          {/* PRICING */}
          <section id="pricing" className="bg-white dark:bg-zinc-950 snap-start">
            <Pricing
              signupHref="https://cardbey.com/signup"
              standardHref="https://buy.stripe.com/5kQaEYbR6gNCgdZc3m9R601"
              contactHref="https://cardbey.com/contact"
              lang={lang}
              showLanguageToggle={false}
            />
          </section>

          {/* CONTACT */}
          <section id="sec-contact" className="bg-[#f5f5f7] dark:bg-zinc-900 snap-start">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">{t["contact.title"]}</h2>
                <p className="mt-3 text-[#6e6e73] dark:text-zinc-300 text-[15px]">
                  {t["contact.sub"]}{" "}
                  <a className="underline" href="mailto:hello@cardbey.com">hello@cardbey.com</a>.
                </p>
              </div>

              <form
                className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-950 p-6 space-y-3"
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Thanks! We'll be in touch.");
                }}
              >
                <div className="grid sm:grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-sm font-medium">{lang === "vi" ? "Tên của bạn" : "Your name"}</span>
                    <input
                      name="name"
                      type="text"
                      required
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                      placeholder={lang === "vi" ? "Nguyen Van A" : "Jane Nguyen"}
                    />
                  </label>

                  <label className="block">
                    <span className="text-sm font-medium">Email</span>
                    <input
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                      placeholder="you@example.com"
                    />
                  </label>
                </div>

                <label className="block">
                  <span className="text-sm font-medium">{lang === "vi" ? "Số điện thoại" : "Phone"}</span>
                  <input
                    name="phone"
                    type="tel"
                    inputMode="tel"
                    pattern="^[+0-9\s\-()]{7,}$"
                    required
                    className="mt-1 w-full h-11 px-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    placeholder={lang === "vi" ? "+84 912 345 678" : "+61 2 8000 1234"}
                  />
                </label>

                <label className="block">
                  <span className="text-sm font-medium">{lang === "vi" ? "Bạn có gì & mục tiêu" : "What do you have & goal"}</span>
                  <textarea
                    name="message"
                    rows={5}
                    className="mt-1 w-full px-3 py-2 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
                    placeholder={lang === "vi" ? "Menu/danh thiếp/tờ rơi và mục tiêu của bạn" : "Menu/card/flyer and what you want to achieve"}
                  />
                </label>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center h-11 w-full rounded-full bg-[color:var(--brand-blue)] hover:bg-[color:var(--brand-blue-600)] text-white text-[15px] font-medium"
                  >
                    {lang === "vi" ? "Gửi yêu cầu" : "Submit request"}
                  </button>

                  <a
                    href={SUPPORT_PHONE_TEL}
                    title={SUPPORT_PHONE_DISPLAY}
                    className="inline-flex items-center justify-center h-11 w-11 rounded-full border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10"
                    aria-label={lang === "vi" ? "Gọi chăm sóc khách hàng" : "Call customer care"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.09 4.18 2 2 0 0 1 4.05 2h3a2 2 0 0 1 2 1.72c.12.81.31 1.6.57 2.36a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.72-1.08a2 2 0 0 1 2.11-.45c.76.26 1.55.45 2.36.57A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span className="sr-only">{lang === "vi" ? "Gọi CSKH" : "Call customer care"}</span>
                  </a>
                </div>
              </form>
            </div>
          </section>

          {/* Floating scroll icon */}
          <button
            onClick={scrollToNextSection}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-1 text-white/90 hover:text-white transition-colors drop-shadow [filter:drop-shadow(0_2px_6px_rgba(0,0,0,.45))]"
            aria-label="Scroll to next section"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6 animate-bounce">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
            <span className="sr-only">Scroll</span>
          </button>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-zinc-950 border-t border-black/10 dark:border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-[#6e6e73] dark:text-zinc-300">
              © {year} Cardbey. Own the machine that builds and runs your business.
            </p>
            <a href="mailto:hello@cardbey.com" className="text-sm text-[#1d1d1f] dark:text-white hover:underline">
              hello@cardbey.com
            </a>
          </div>
        </footer>
      </div>

      {/* Caya launcher & chat (mounted once) */}
      <CayaChat open={chatOpen} onClose={() => setChatOpen(false)} />
      {!chatOpen && <CayaButton onClick={() => setChatOpen(true)} size={110} />}
    </Page>
  );
}
