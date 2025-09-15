// src/components/Pricing.tsx
import React from "react";

type Lang = "en" | "vi";

type Props = {
  signupHref?: string;            // Free plan CTA
  standardHref?: string;          // Standard plan CTA (Stripe link)
  contactHref?: string;           // Network / Enterprise contact CTA
  lang?: Lang;                    // Controlled by parent (Home)
  showLanguageToggle?: boolean;   // Optional internal toggle
};

const i18n: Record<Lang, any> = {
  en: {
    title: "Simple, fair pricing",
    subtitle: "Start free. Upgrade when the store pays for itself.",
    free: {
      badge: "Free",
      tagline: "Everything you need to get started",
      price: "Free",
      features: [
        "1 store • up to 50 items",
        "1 OCR import / month (2–3 pages)",
        "Cardbey subdomain & branding",
        "1 language (EN or VI)",
        "Shareable link & basic editing",
        "Start to sell with Cardbey",
      ],
      cta: "Create Free Account",
    },
    std: {
      badge: "Standard",
      popular: "Popular",
      tagline: "For growing stores that want speed & polish",
      price: "$49.90",
      currency: "AUD / mo",
      includes: "Everything in Free, plus:",
      features: [
        "Up to 3 stores • unlimited items",
        "10 OCR imports / month",
        "Faster & higher-accuracy AI",
        "2 languages (EN + VI)",
        "Remove branding • custom domain",
        "CSV import/export • basic analytics",
        "Priority support",
        "Start to sell with Cardbey",
      ],
      savingsHint: "Save 15% on yearly",
      cta: "Choose Standard",
    },
    net: {
      badge: "Network",
      tagline: "For multi-location brands & partners",
      price: "Custom",
      features: [
        "Multi-location & team roles",
        "C-Net screen ads",
        "Smart delivery & SmartBox",
        "API & integrations",
        "Dedicated success manager",
        "Start to sell with Cardbey",
      ],
      cta: "Talk to us →",
    },
    footnote:
      "Need more OCR? Add credit packs anytime. Cancel or switch plans anytime. Taxes may apply.",
    langLabel: "Language",
  },
  vi: {
    title: "Giá đơn giản & hợp lý",
    subtitle: "Bắt đầu miễn phí. Nâng cấp khi cửa hàng tạo doanh thu.",
    free: {
      badge: "Miễn phí",
      tagline: "Đầy đủ để khởi đầu",
      price: "Miễn phí",
      features: [
        "1 cửa hàng • tối đa 50 sản phẩm",
        "1 lần OCR / tháng (2–3 trang)",
        "Tên miền phụ & nhãn Cardbey",
        "1 ngôn ngữ (EN hoặc VI)",
        "Liên kết chia sẻ & chỉnh sửa cơ bản",
         "Bắt đầu bán hàng với Cardbey",
      ],
      cta: "Tạo tài khoản miễn phí",
    },
    std: {
      badge: "Tiêu chuẩn",
      popular: "Phổ biến",
      tagline: "Cho cửa hàng tăng trưởng, cần tốc độ & độ mượt",
      price: "$49.90",
      currency: "AUD / tháng",
      includes: "Bao gồm tất cả trong gói Miễn phí, thêm:",
      features: [
        "Tối đa 3 cửa hàng • không giới hạn sản phẩm",
        "10 lần OCR / tháng",
        "AI nhanh & chính xác hơn",
        "2 ngôn ngữ (EN + VI)",
        "Gỡ nhãn • tên miền riêng",
        "Nhập/xuất CSV • phân tích cơ bản",
        "Hỗ trợ ưu tiên",
         "Bắt đầu bán hàng với Cardbey",
      ],
      savingsHint: "Tiết kiệm 15% khi trả năm",
      cta: "Chọn gói Tiêu chuẩn",
    },
    net: {
      badge: "Mạng lưới",
      tagline: "Cho chuỗi nhiều điểm & đối tác",
      price: "Tùy chỉnh",
      features: [
        "Nhiều điểm bán & phân quyền",
        "Quảng cáo màn hình C-Net",
        "Giao hàng thông minh & SmartBox",
        "API & tích hợp",
        "CSKH chuyên trách",
         "Bắt đầu bán hàng với Cardbey",
      ],
      cta: "Liên hệ →",
    },
    footnote:
      "Cần OCR thêm? Mua gói tín dụng bất kỳ lúc nào. Có thể hủy/đổi gói bất cứ lúc nào. Giá chưa gồm thuế.",
    langLabel: "Ngôn ngữ",
  },
};

export default function Pricing({
  signupHref = "/signup",
  standardHref = "/checkout?plan=standard",
  contactHref = "/contact",
  lang = "en",
  showLanguageToggle = false,
}: Props) {
  const [localLang, setLocalLang] = React.useState<Lang>(lang);
  const L = i18n[showLanguageToggle ? localLang : lang];

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      {/* Header */}
      <div className="mb-10 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{L.title}</h2>
          <p className="mt-2 text-neutral-600 dark:text-neutral-300">
            {L.subtitle}
          </p>
        </div>

        {showLanguageToggle && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-neutral-500">{L.langLabel}:</span>
            <div className="inline-flex rounded-full border bg-white p-1 dark:bg-zinc-900 dark:border-white/10">
              {(["en", "vi"] as Lang[]).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => setLocalLang(code)}
                  className={`rounded-full px-3 py-1 text-sm transition ${
                    localLang === code
                      ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                  aria-pressed={localLang === code}
                >
                  {code.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Free */}
        {/* Free */}
<PlanCard
  badge={L.free.badge}
  tagline={L.free.tagline}
  price={L.free.price}
  currency=""
  features={L.free.features}
  ctaLabel={L.free.cta}
  ctaHref={signupHref}
  emphasis="primary"   // <- was "soft"
/>


        {/* Standard */}
        <PlanCard
          badge={L.std.badge}
          popular={L.std.popular}
          tagline={L.std.tagline}
          price={L.std.price}
          currency={L.std.currency}
          includes={L.std.includes}
          features={L.std.features}
          savingsHint={L.std.savingsHint}
          ctaLabel={L.std.cta}
          ctaHref={standardHref}
          emphasis="primary"
        />

        {/* Network */}
        <PlanCard
          badge={L.net.badge}
          tagline={L.net.tagline}
          price={L.net.price}
          currency=""
          features={L.net.features}
          ctaLabel={L.net.cta}
          ctaHref={contactHref}
          emphasis="outline"
        />
      </div>

      {/* Footnote */}
      <p className="mt-8 text-sm text-neutral-500 dark:text-neutral-400">
        {L.footnote}
      </p>
    </section>
  );
}

/* ---------- Subcomponent ---------- */

type PlanCardProps = {
  badge: string;
  tagline?: string;
  popular?: string;
  price: string;
  currency?: string;
  includes?: string;
  features: string[];
  savingsHint?: string;
  ctaLabel: string;
  ctaHref: string;
  emphasis?: "primary" | "soft" | "outline";
};

function PlanCard({
  badge,
  tagline,
  popular,
  price,
  currency,
  includes,
  features,
  savingsHint,
  ctaLabel,
  ctaHref,
  emphasis = "soft",
}: PlanCardProps) {
  const base =
    "rounded-2xl border p-6 bg-white dark:bg-zinc-950 dark:border-white/10";
  const ring =
  emphasis === "primary" && popular
    ? "ring-1 ring-blue-600/10 shadow-[0_6px_24px_rgba(37,99,235,.08)]"
    : "";
  return (
    <div className={`${base} ${ring}`}>
      <div className="mb-2 flex items-center gap-3">
        <div className="text-lg font-semibold">{badge}</div>
        {popular && (
          <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-200">
            {popular}
          </span>
        )}
      </div>

      {tagline && (
        <div className="mb-3 text-sm text-neutral-600 dark:text-neutral-300">
          {tagline}
        </div>
      )}

      <div className="mb-1 text-4xl font-bold">{price}</div>
      {currency && (
        <div className="mb-6 text-sm text-neutral-500">{currency}</div>
      )}

      {includes && <p className="mb-2 font-medium">{includes}</p>}

      <ul className="mb-6 space-y-2 text-neutral-700 dark:text-neutral-200">
        {features.map((f) => (
          <li key={f} className="flex items-start gap-2">
            <span className="mt-1 text-neutral-400">•</span>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {savingsHint && (
        <div className="mb-3 text-xs text-blue-700 dark:text-blue-300">
          {savingsHint}
        </div>
      )}

      <a
        href={ctaHref}
        target={ctaHref.startsWith("http") ? "_blank" : undefined}
        rel={ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
        className={
          emphasis === "primary"
            ? "block rounded-full bg-blue-600 px-6 py-3 text-center font-medium text-white hover:bg-blue-700"
            : emphasis === "outline"
            ? "block rounded-full border border-neutral-300 px-6 py-3 text-center font-medium hover:bg-neutral-50 dark:hover:bg-white/5"
            : "block rounded-full bg-neutral-900 px-6 py-3 text-center font-medium text-white dark:bg-white dark:text-black hover:opacity-90"
        }
      >
        {ctaLabel}
      </a>
    </div>
  );
}
