import { useState } from "react";
import Home from "@/pages/Home";
import CayaChat from "@/components/CayaChat";

export default function App() {
  const [open, setOpen] = useState(false); // closed by default

  return (
    <>
      <Home />

      {/* small launcher button */}
      <button
        aria-label="Open chat"
        onClick={() => setOpen(true)}
        style={{
          position: "fixed", right: 24, bottom: 24, width: 56, height: 56,
          borderRadius: 9999, boxShadow: "0 6px 20px rgba(0,0,0,.2)",
        }}
      >
        💬
      </button>

      {/* chat modal */}
      <CayaChat open={open} onClose={() => setOpen(false)} />
    </>
  );
}
