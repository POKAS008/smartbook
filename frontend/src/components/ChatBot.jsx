import { useState, useRef, useEffect } from "react";

const GEMINI_KEY = import.meta.env.VITE_GEMINI_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_KEY}`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600&display=swap');
.sb-fab{position:fixed;bottom:28px;right:28px;width:58px;height:58px;border-radius:50%;background:#6c63ff;color:#fff;border:none;font-size:24px;cursor:pointer;box-shadow:0 4px 20px rgba(108,99,255,.45);z-index:9999;transition:transform .2s,box-shadow .2s;display:flex;align-items:center;justify-content:center}
.sb-fab:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(108,99,255,.55)}
.sb-win{position:fixed;bottom:100px;right:28px;width:370px;height:540px;background:#fff;border-radius:18px;box-shadow:0 12px 48px rgba(0,0,0,.18);display:flex;flex-direction:column;z-index:9998;overflow:hidden;font-family:'DM Sans',sans-serif;animation:sbSlide .22s ease}
@keyframes sbSlide{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
.sb-head{display:flex;align-items:center;gap:10px;padding:14px 16px;background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#fff;flex-shrink:0}
.sb-head-icon{width:36px;height:36px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0}
.sb-head-info strong{display:block;font-size:14px;font-weight:600}
.sb-head-info small{font-size:11px;opacity:.85}
.sb-head-close{margin-left:auto;background:none;border:none;color:#fff;font-size:18px;cursor:pointer;opacity:.8;line-height:1}
.sb-head-close:hover{opacity:1}
.sb-msgs{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:12px;scrollbar-width:thin;scrollbar-color:#ddd transparent}
.sb-msg{display:flex;align-items:flex-end;gap:8px}
.sb-msg.user{flex-direction:row-reverse}
.sb-avi{width:28px;height:28px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600}
.sb-avi.bot{background:linear-gradient(135deg,#6c63ff,#a78bfa);color:#fff}
.sb-avi.user{background:#e8e8f4;color:#6c63ff}
.sb-bub{max-width:78%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.6;white-space:pre-wrap;word-break:break-word}
.sb-msg.bot .sb-bub{background:#f4f4fb;color:#1a1a2e;border-bottom-left-radius:4px}
.sb-msg.user .sb-bub{background:#6c63ff;color:#fff;border-bottom-right-radius:4px}
.sb-typing{display:flex;gap:4px;align-items:center;padding:4px 0}
.sb-typing span{width:6px;height:6px;border-radius:50%;background:#aaa;animation:sbBounce .9s infinite}
.sb-typing span:nth-child(2){animation-delay:.18s}
.sb-typing span:nth-child(3){animation-delay:.36s}
@keyframes sbBounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}
.sb-chips{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;border-top:1px solid #f0f0f8;flex-shrink:0}
.sb-chip{padding:5px 12px;border-radius:20px;border:1px solid #d8d8f0;background:#fff;font-size:12px;cursor:pointer;color:#6c63ff;font-family:'DM Sans',sans-serif;transition:all .15s}
.sb-chip:hover{background:#6c63ff;color:#fff;border-color:#6c63ff}
.sb-bottom{display:flex;gap:8px;padding:12px 14px;border-top:1px solid #f0f0f8;flex-shrink:0}
.sb-bottom input{flex:1;border:1.5px solid #e0e0f0;border-radius:10px;padding:9px 13px;font-size:13.5px;font-family:'DM Sans',sans-serif;outline:none;transition:border-color .15s}
.sb-bottom input:focus{border-color:#6c63ff}
.sb-bottom input:disabled{background:#f8f8fc}
.sb-send{width:38px;height:38px;border-radius:10px;background:#6c63ff;border:none;color:#fff;font-size:17px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;transition:opacity .15s}
.sb-send:hover{opacity:.88}
.sb-send:disabled{opacity:.38;cursor:not-allowed}
`;

const SYSTEM = `You are SmartBook Assistant, a friendly AI support agent for SmartBook — a real-time event booking platform built with Spring Boot, React, and PostgreSQL.
You help users with finding events, checking availability, booking tickets, cancellations (free up to 24hrs before event), QR code check-in, and account questions.
Keep responses concise, warm, and helpful. Use plain text.`;

const QUICK = [
  "Show upcoming events",
  "How do I cancel a booking?",
  "Check seat availability",
  "How does QR check-in work?",
];

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState([
    { role: "assistant", text: "Hi! 👋 I'm your SmartBook assistant. Ask me anything about events, bookings, or tickets!" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChips, setShowChips] = useState(true);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!document.getElementById("sb-css")) {
      const s = document.createElement("style");
      s.id = "sb-css";
      s.textContent = CSS;
      document.head.appendChild(s);
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, loading]);

  const send = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");
    setLoading(true);
    setShowChips(false);

    const history = [...msgs, { role: "user", text: userText }];
    setMsgs(history);

    // Build Gemini-format contents (skip initial greeting)
    const contents = history
      .filter((m) => !(m.role === "assistant" && m.text.startsWith("Hi! 👋")))
      .map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.text }],
      }));

    try {
      const res = await fetch(GEMINI_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM }] },
          contents,
          generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
        }),
      });
      const data = await res.json();
      const reply =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a response. Please try again.";
      setMsgs([...history, { role: "assistant", text: reply }]);
    } catch {
      setMsgs([...history, { role: "assistant", text: "Connection issue. Please try again in a moment." }]);
    }
    setLoading(false);
  };

  return (
    <>
      <button className="sb-fab" onClick={() => setOpen((o) => !o)} aria-label="Open chat">
        {open ? "✕" : "💬"}
      </button>

      {open && (
        <div className="sb-win">
          <div className="sb-head">
            <div className="sb-head-icon">🎟</div>
            <div className="sb-head-info">
              <strong>SmartBook Assistant</strong>
              <small>Powered by Gemini AI</small>
            </div>
            <button className="sb-head-close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="sb-msgs">
            {msgs.map((m, i) => (
              <div key={i} className={`sb-msg ${m.role === "user" ? "user" : "bot"}`}>
                <div className={`sb-avi ${m.role === "user" ? "user" : "bot"}`}>
                  {m.role === "user" ? "U" : "SB"}
                </div>
                <div className="sb-bub">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="sb-msg bot">
                <div className="sb-avi bot">SB</div>
                <div className="sb-bub">
                  <div className="sb-typing"><span /><span /><span /></div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {showChips && (
            <div className="sb-chips">
              {QUICK.map((q) => (
                <button key={q} className="sb-chip" onClick={() => send(q)}>{q}</button>
              ))}
            </div>
          )}

          <div className="sb-bottom">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Ask about events, bookings..."
              disabled={loading}
            />
            <button className="sb-send" onClick={() => send()} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>
      )}
    </>
  );
}