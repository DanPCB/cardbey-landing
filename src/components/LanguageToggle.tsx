import React from "react";

export type Lang = "en" | "vi";

export default function LanguageToggle({
  lang,
  onChange,
  className = "",
}: {
  lang: Lang;
  onChange: (next: Lang) => void;
  className?: string;
}) {
  return (
    <div className={`inline-flex rounded-full border bg-white p-1 ${className}`}>
      <button
        type="button"
        onClick={() => onChange("en")}
        className={`rounded-full px-3 py-1 text-[13px] ${
          lang === "en" ? "bg-neutral-900 text-white" : "text-neutral-700"
        }`}
        aria-pressed={lang === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => onChange("vi")}
        className={`rounded-full px-3 py-1 text-[13px] ${
          lang === "vi" ? "bg-neutral-900 text-white" : "text-neutral-700"
        }`}
        aria-pressed={lang === "vi"}
      >
        VI
      </button>
    </div>
  );
}
