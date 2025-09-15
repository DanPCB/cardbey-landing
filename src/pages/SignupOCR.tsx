import React, { useState } from "react";
import Page from "../components/Page";


export default function SignupOCR() {
  const methods = [
    { id: "photo",   label: "Create Store with Menu photo", hint: "Best for menus (≈20s)" },
    { id: "ai",      label: "Create Store with AI",         hint: "Describe your items" },
    { id: "library", label: "Create Store from library",    hint: "Pick a template" },
    { id: "account", label: "Create your account",          hint: "Setup first, add later" },
  ] as const;

  type MethodId = typeof methods[number]["id"];

  const [selected, setSelected] = useState<MethodId | null>(null);
  const [agree, setAgree] = useState(false);
  const canContinue = !!selected && agree;

  const DEST: Record<MethodId, string> = {
    photo:   "https://cardbey.com/signup/ocr?flow=photo",
    ai:      "https://cardbey.com/signup/ocr?flow=ai",
    library: "https://cardbey.com/signup/ocr?flow=library",
    account: "https://cardbey.com/signup",
  };

  const handleContinue = () => {
    if (!canContinue || !selected) return;
    window.location.href = DEST[selected];
  };

  return (
    <Page>
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-md p-5 pb-28">
          <h1 className="mt-6 text-center text-2xl font-bold leading-tight">
            Choose a Store Creation Method
          </h1>

          <ul className="mt-6 space-y-3">
            {methods.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m.id)}
                  className={[
                    "w-full text-left rounded-2xl border p-4 transition",
                    selected === m.id
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-black/10 hover:border-black/20",
                  ].join(" ")}
                >
                  <div className="font-medium">{m.label}</div>
                  <div className="text-sm text-neutral-500">{m.hint}</div>
                </button>
              </li>
            ))}
          </ul>

          <label className="mt-5 flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="h-4 w-4"
            />
            <span>
              I have read and agree to the{" "}
              <a
                href="https://cardbey.com/terms"
                target="_blank"
                rel="noreferrer"
                className="underline"
              >
                Terms and Conditions
              </a>
              .
            </span>
          </label>

          <p className="mt-6 text-center text-xs text-neutral-500">
            AI reads items, categories, prices, contacts
          </p>
        </div>

        {/* sticky footer action */}
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-black/10 bg-white/95 backdrop-blur supports-[padding:max(0px)]:pb-[max(0px,env(safe-area-inset-bottom))]">
          <div className="mx-auto max-w-md p-4">
            <button
              type="button"
              onClick={handleContinue}
              disabled={!canContinue}
              className={[
                "w-full rounded-full px-6 py-3 font-semibold",
                canContinue
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-neutral-200 text-neutral-500 cursor-not-allowed",
              ].join(" ")}
            >
              CONTINUE
            </button>
            <p className="mt-3 text-center text-sm">
              Already registered?{" "}
              <a href="https://cardbey.com/login" className="font-medium underline">
                Login
              </a>
            </p>
          </div>
        </div>
      </main>
    </Page>
  );
}
