export type CayaMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export async function chatCaya(
  messages: CayaMessage[],
  { model = "grok-2-1212", signal }: { model?: string; signal?: AbortSignal } = {}
) {
  const base = import.meta.env.VITE_CAYA_API_BASE ?? "";
  const res = await fetch(`${base}/api/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages, stream: false }),
    signal,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(
      data?.error?.message || data?.error || data?.upstream?.error || "Caya request failed"
    );
  }
  // Your proxy returns { content, raw }
  return (data.content as string) ?? "";
}
