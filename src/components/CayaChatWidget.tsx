import React, { useEffect, useRef, useState } from "react";
import cayaAvatar from "@/assets/caya-avatar.png";

type Msg = { role: "user" | "assistant" | "system"; content: string };

export default function CayaChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I’m Caya 🤖 — your AI store companion. I can help you create a store from a menu, explain pricing, or fix a stuck generation. How can I help?",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, open]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    const next = [...msgs, { role: "user" as const, content: text }];
    setMsgs(next);
    setInput("");
    setLoading(true);

    const res = await fetch("/api/caya", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: next }),
    });

    if (!res.ok || !res.body) {
      setMsgs((m) => [...m, { role: "assistant", content: "Sorry—something went wrong." }]);
      setLoading(false);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistant = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      assistant += decoder.decode(value, { stream: true });
      setMsgs((m) => {
        const base = m.slice(0, next.length);
        const last = { role: "assistant" as const, content: assistant };
        return [...base, last];
      });
    }
    setLoading(false);
  }

  return (
    <>
      {/* FAB (avatar button) */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Open Caya chat"
        className="fixed bottom-6 right-6 z-[60] h-16 w-16 rounded-full overflow-hidden
                   bg-transparent ring-1 ring-black/10 shadow-xl hover:shadow-2xl transition relative"
      >
        <img src={cayaAvatar} alt="Caya" className="h-full w-full object-cover" />
        {/* Remove or restyle the badge below. If you want dots, keep it with a non-white bg. */}
        {/* <span className="absolute bottom-0 right-0 translate-y-1/3 translate-x-1/3
                       h-7 min-w-7 px-2 rounded-full bg-violet-600/90 text-white shadow
                       ring-1 ring-black/10 flex items-center justify-center gap-1">
          <i className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:0ms]" />
          <i className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:120ms]" />
          <i className="h-1.5 w-1.5 rounded-full bg-white/90 animate-bounce [animation-delay:240ms]" />
        </span> */}
      </button>

      {/* Panel */}
      {open && (
        <div className="fixed bottom-20 right-5 z-50 w-[360px] max-w-[calc(100vw-2rem)] rounded-2xl overflow-hidden border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl">
          <div className="px-4 py-3 border-b border-black/10 dark:border-white/10 flex items-center justify-between">
            <div className="font-semibold">Caya Assistant</div>
            <button onClick={() => setOpen(false)} className="opacity-70 hover:opacity-100">✕</button>
          </div>

          <div className="h-[380px] overflow-y-auto p-3 space-y-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                <div
                  className={[
                    "inline-block rounded-2xl px-3 py-2",
                    m.role === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-black/5 dark:bg-white/10 text-black dark:text-white",
                  ].join(" ")}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-left">
                <div className="inline-flex items-center gap-2 rounded-2xl px-3 py-2 bg-black/5 dark:bg-white/10">
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce" />
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:240ms]" />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <form onSubmit={sendMessage} className="p-3 border-t border-black/10 dark:border-white/10 flex gap-2">
            <input
              className="flex-1 h-10 px-3 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-zinc-800 outline-none"
              placeholder="Ask about pricing, store-gen, OCR limits…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              className="h-10 px-4 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </form>
        </div>
      )}
    </>
  );
}
