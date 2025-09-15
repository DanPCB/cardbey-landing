// CayaChat.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cayaAvatar from "@/assets/caya-avatar.png";

type Role = "system" | "user" | "assistant";
type Reactions = Record<string, number>;
type Msg = { role: Role; content: string; reactions?: Reactions };

const CHAT_ENDPOINT = import.meta.env?.VITE_CHAT_ENDPOINT || "/api/chat";
const MODEL = "grok-2-1212";
const QUICK_EMOJIS = ["👍", "✅", "😊", "🎉", "❤️", "🤔", "🔥", "👏", "👌", "🙌"];

export default function CayaChat({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Hi! I’m Caya. What would you like to set up first?" },
  ]);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [reactPickerFor, setReactPickerFor] = useState<number | null>(null);

  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiBtnRef = useRef<HTMLButtonElement>(null);

  // ----- helpers -----
  useEffect(() => {
    if (!open) return;
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [open, messages.length, loading]);

  const payloadMessages = useMemo<Msg[]>(
    () => [{ role: "system", content: "You are Caya, Cardbey’s helpful AI assistant." }, ...messages],
    [messages]
  );
  
  // Very defensive extraction across API shapes
  const extractText = (raw: any): string => {
    try {
      if (!raw) return "";
      // if server returned a JSON string
      if (typeof raw === "string") {
        try {
          const j = JSON.parse(raw);
          return extractText(j);
        } catch {
          return raw; // plain text
        }
      }
      // OpenAI / xAI-ish
      const c0 = raw.choices?.[0];
      const m = c0?.message?.content ?? c0?.delta?.content;
      if (typeof m === "string" && m.trim()) return m;

      // Other common shapes
      if (typeof raw.output_text === "string" && raw.output_text.trim()) return raw.output_text;
      if (typeof raw.message?.content === "string" && raw.message.content.trim()) return raw.message.content;
      if (typeof raw.content === "string" && raw.content.trim()) return raw.content;
      if (typeof raw.text === "string" && raw.text.trim()) return raw.text;
      if (typeof raw.data?.content === "string" && raw.data.content.trim()) return raw.data.content;

      return "";
    } catch {
      return "";
    }
  };

  const insertEmojiAtCursor = (emoji: string) => {
    const el = inputRef.current;
    if (!el) {
      setInput((v) => v + emoji);
      return;
    }
    const start = el.selectionStart ?? el.value.length;
    const end = el.selectionEnd ?? el.value.length;
    const next = el.value.slice(0, start) + emoji + el.value.slice(end);
    setInput(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + emoji.length, start + emoji.length);
    });
  };

  const addReaction = (idx: number, emoji: string) => {
    setMessages((prev) => {
      const next = [...prev];
      const msg = { ...next[idx] };
      const r: Reactions = { ...(msg.reactions || {}) };
      r[emoji] = (r[emoji] || 0) + 1;
      msg.reactions = r;
      next[idx] = msg;
      return next;
    });
    setReactPickerFor(null);
  };

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    // close emoji picker so it doesn't overlap while sending
    setPickerOpen(false);

    const userMsg: Msg = { role: "user", content: text };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: MODEL,
          stream: false,
          messages: [...payloadMessages, userMsg],
        }),
      });

      const bodyText = await res.text();
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${bodyText?.slice(0, 180)}`);
      }

      let reply = extractText(bodyText);
      if (!reply) {
        // try parsing again just in case
        try {
          reply = extractText(JSON.parse(bodyText));
        } catch {
          /* ignore */
        }
      }

      if (!reply) {
        throw new Error("Empty reply from server");
      }

      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch (err: any) {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "Sorry — I couldn’t get a reply just now. Please try again in a moment."
            + (err?.message ? `\n\n(${err.message})` : ""),
        },
      ]);
    } finally {
      setLoading(false);
      requestAnimationFrame(() => {
        if (listRef.current) listRef.current.scrollTop = listRef.current.scrollHeight;
      });
    }
  };

  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send();
    }
  };

  // ----- UI -----
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[9998] bg-black/30"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed bottom-6 right-6 z-[9999] w-[380px] sm:w-[420px] max-w-[94vw]
                       rounded-2xl bg-white shadow-2xl ring-1 ring-black/10 flex flex-col"
            style={{ height: "min(72vh, 640px)" }}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 24, mass: 0.6 }}
          >
            {/* Header */}
            <div className="relative flex items-center gap-3 p-3 pl-4 border-b border-black/10">
              <motion.div layoutId="caya-avatar" className="h-7 w-7 rounded-full overflow-hidden ring-1 ring-black/10">
                <img src={cayaAvatar} alt="Caya" className="h-full w-full object-cover" />
              </motion.div>
              <div className="font-medium">Chat with Caya</div>
              <button onClick={onClose} className="ml-auto rounded-full p-1 hover:bg-black/5" aria-label="Close chat">
                ✕
              </button>
            </div>

            {/* Messages */}
            <div ref={listRef} className="flex-1 min-h-0 overflow-y-auto p-3 space-y-5">
              {messages.map((m, idx) => {
                const isAssistant = m.role === "assistant";
                const reactionEntries = Object.entries(m.reactions || {});
                return (
                  <div key={idx} className={`group relative flex ${isAssistant ? "justify-start" : "justify-end"}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={[
                        "max-w-[82%] rounded-2xl px-3 py-2 text-[15px] whitespace-pre-wrap shadow-sm",
                        isAssistant ? "bg-zinc-100 text-zinc-900" : "bg-[color:var(--brand-blue)] text-white",
                      ].join(" ")}
                    >
                      {m.content}
                    </motion.div>

                    {/* react button */}
                    <button
                      className={[
                        "absolute -top-3",
                        isAssistant ? "left-2" : "right-2",
                        "hidden group-hover:flex items-center justify-center h-6 w-6 rounded-full bg-white",
                        "shadow ring-1 ring-black/10 text-sm",
                      ].join(" ")}
                      title="React"
                      onClick={() => setReactPickerFor(idx)}
                    >
                      🙂
                    </button>

                    {/* reactions chips */}
                    {reactionEntries.length > 0 && (
                      <div
                        className={[
                          "absolute mt-1 text-xs flex gap-1",
                          isAssistant ? "left-3" : "right-3",
                          "bottom-[-18px]",
                        ].join(" ")}
                      >
                        {reactionEntries.map(([e, c]) => (
                          <span
                            key={e}
                            className="px-1.5 h-5 rounded-full bg-white text-zinc-800 ring-1 ring-black/10 grid place-items-center shadow-sm"
                          >
                            {e} {c > 1 ? c : ""}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* reaction picker */}
                    <AnimatePresence>
                      {reactPickerFor === idx && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 4 }}
                          className={[
                            "absolute z-10 -top-12",
                            isAssistant ? "left-2" : "right-2",
                            "rounded-xl bg-white shadow-xl ring-1 ring-black/10 px-1 py-1 flex gap-1",
                          ].join(" ")}
                          onMouseLeave={() => setReactPickerFor(null)}
                        >
                          {QUICK_EMOJIS.slice(0, 7).map((e) => (
                            <button
                              key={e}
                              className="h-7 w-7 rounded-md hover:bg-black/5"
                              onClick={() => addReaction(idx, e)}
                              title={e}
                            >
                              {e}
                            </button>
                          ))}
                          <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-white ring-1 ring-black/10" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              {loading && (
                <div className="inline-flex items-center gap-1 rounded-2xl bg-zinc-100 px-3 py-2 shadow-sm">
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:0ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:120ms]" />
                  <span className="h-2 w-2 rounded-full bg-violet-500 animate-bounce [animation-delay:240ms]" />
                </div>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void send();
              }}
              className="p-3 border-t border-black/10"
            >
              <div className="flex items-end gap-2">
                {/* Emoji toggle */}
                <div className="relative shrink-0">
                  <button
                    ref={emojiBtnRef}
                    type="button"
                    aria-label="Insert emoji"
                    className="h-11 w-11 rounded-xl border border-black/10 grid place-items-center hover:bg-black/5"
                    onClick={() => setPickerOpen((s) => !s)}
                  >
                    🙂
                  </button>

                  {/* Picker above the button (doesn't cover the input) */}
                  <AnimatePresence>
                    {pickerOpen && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 6 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 6 }}
                        className="absolute bottom-12 left-0 z-20 rounded-xl bg-white shadow-2xl ring-1 ring-black/10 p-2 grid grid-cols-6 gap-1"
                        onMouseLeave={() => setPickerOpen(false)}
                      >
                        {QUICK_EMOJIS.map((e) => (
                          <button
                            key={e}
                            className="h-8 w-8 rounded-md hover:bg-black/5"
                            onClick={() => insertEmojiAtCursor(e)}
                            type="button"
                            title={e}
                          >
                            {e}
                          </button>
                        ))}
                        <div className="absolute -bottom-1 left-4 h-2 w-2 rotate-45 bg-white ring-1 ring-black/10" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Input + Send */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 rounded-2xl border border-black/10 px-3 pr-2 h-12 focus-within:ring-2 focus-within:ring-black/10 bg-white">
                    <input
                      ref={inputRef}
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={onKeyDown}
                      placeholder="Ask Caya anything about setting up your store"
                      className="flex-1 h-10 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={loading || !input.trim()}
                      className="h-9 px-4 rounded-xl bg-[color:var(--brand-blue)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Send
                    </button>
                  </div>

                  {/* Quick emoji row */}
                  <div className="mt-2 flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {QUICK_EMOJIS.slice(0, 6).map((e) => (
                      <button
                        key={e}
                        type="button"
                        className="px-2 h-8 rounded-full bg-zinc-100 ring-1 ring-black/10 hover:bg-zinc-200 shadow-sm"
                        onClick={() => insertEmojiAtCursor(e)}
                        title={e}
                      >
                        {e}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
