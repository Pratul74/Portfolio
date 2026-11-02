import { useRef, useState, useCallback } from "react";

const C = {
  bg: "#0a0405",
  panel: "#120607",
  orange: "#ff8a1f",
  ember: "#ff4d2e",
  amber: "#ffb347",
  dim: "#7a2a1a",
};

const MAX_LEN = 600;
const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function SignalRings({ active }) {
  return (
    <div className="relative h-24 w-24">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="sc-ring absolute inset-0 rounded-full border-2"
          style={{
            borderColor: C.orange,
            animationDelay: `${i * 0.6}s`,
            animationPlayState: active ? "running" : "paused",
            opacity: active ? undefined : 0.15,
          }}
        />
      ))}
      <span
        className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2"
        style={{ background: C.orange, boxShadow: `0 0 14px ${C.orange}` }}
      />
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <div className="sc-field">
      <label
        htmlFor={id}
        className="mb-1 flex items-center justify-between text-xs"
        style={{ color: C.amber }}
      >
        <span>&gt; {label}</span>
        {error && (
          <span role="alert" style={{ color: C.ember }}>
            {error}
          </span>
        )}
      </label>
      {children}
    </div>
  );
}

export default function SignalContact({ endpoint = "" }) {
  const wrapRef = useRef(null);
  const tiltRef = useRef(null);

  const [values, setValues] = useState({ name: "", email: "", message: "", company: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");
  const [flipped, setFlipped] = useState(false);
  const [ripples, setRipples] = useState([]);
  const [shakeKey, setShakeKey] = useState(0);

  const addRipple = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setRipples((rs) => [...rs, { id, x: e.clientX - r.left, y: e.clientY - r.top, size: Math.max(r.width, r.height) * 2.2 }]);
    setTimeout(() => setRipples((rs) => rs.filter((x) => x.id !== id)), 650);
  };

  const handleMove = useCallback(
    (e) => {
      if (flipped || status === "sending" || !tiltRef.current || !wrapRef.current) return;
      if (e.pointerType === "touch") return;
      const r = wrapRef.current.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tiltRef.current.style.transform = `rotateX(${(-y * 9).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
    },
    [flipped, status]
  );

  const resetTilt = useCallback(() => {
    if (tiltRef.current) tiltRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
  }, []);
  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: name === "message" ? value.slice(0, MAX_LEN) : value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: undefined }));
  };

  const validate = () => {
    const er = {};
    if (values.name.trim().length < 2) er.name = "Enter your name";
    if (!emailOk(values.email)) er.email = "Enter a valid email";
    if (values.message.trim().length < 10) er.message = "Write at least 10 characters";
    setErrors(er);
    if (Object.keys(er).length) setShakeKey((k) => k + 1);
    return Object.keys(er).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === "sending" || values.company) return;
    if (!validate()) return;

    setStatus("sending");
    try {
      if (endpoint) {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            message: values.message,
          }),
        });
        if (!res.ok) throw new Error("Request failed");
      } else {
        await new Promise((r) => setTimeout(r, 1800));
      }
      setStatus("sent");
      resetTilt();
      setTimeout(() => setFlipped(true), 450);
    } catch {
      setStatus("error");
      setShakeKey((k) => k + 1);
    }
  };

  const sendAnother = () => {
    setFlipped(false);
    setTimeout(() => {
      setValues({ name: "", email: "", message: "", company: "" });
      setErrors({});
      setStatus("idle");
    }, 700);
  };

  const sending = status === "sending";

  return (
    <section
      id="signal"
      className="relative flex min-h-screen items-center justify-center px-4 py-28 font-mono"
      style={{ color: C.orange }}
    >
      <style>{`
        .sc-ring { animation: sc-ping 1.8s cubic-bezier(.2,.6,.3,1) infinite; }
        @keyframes sc-ping { 0% { transform: scale(.15); opacity: .9; } 100% { transform: scale(1.5); opacity: 0; } }
        .sc-caret { animation: sc-blink 1s steps(1) infinite; }
        @keyframes sc-blink { 50% { opacity: 0; } }
        .sc-scan { background: repeating-linear-gradient(0deg, rgba(255,138,31,.05) 0 1px, transparent 1px 3px); }
        .sc-sweep { animation: sc-sweep 5s linear infinite; }
        @keyframes sc-sweep { 0% { transform: translateY(-120%); } 100% { transform: translateY(1100%); } }
        .sc-input { background: rgba(255,138,31,.04); border: 1px solid ${C.dim}; color: ${C.amber};
          outline: none; transition: border-color .2s, box-shadow .2s, background .2s; }
        .sc-input::placeholder { color: ${C.dim}; }
        .sc-input:focus { border-color: ${C.orange}; background: rgba(255,138,31,.09);
          box-shadow: 0 0 0 1px ${C.orange}, 0 0 18px rgba(255,138,31,.35); }
        .sc-input[aria-invalid="true"] { border-color: ${C.ember}; }
        .sc-btn { transition: transform .15s, box-shadow .2s; }
        .sc-btn:hover:not(:disabled) { transform: translateZ(46px) translateY(-2px); box-shadow: 0 8px 28px rgba(255,138,31,.45); }
        .sc-btn:active:not(:disabled) { transform: translateZ(30px) translateY(1px); }
        .sc-btn:focus-visible, .sc-link:focus-visible { outline: 2px solid ${C.amber}; outline-offset: 3px; }
        .sc-bar { animation: sc-fill 1.8s ease-in-out forwards; }
        @keyframes sc-fill { from { width: 0; } to { width: 92%; } }

        /* --- send button animations --- */
        .sc-shine { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
        .sc-shine::after { content: ""; position: absolute; top: 0; bottom: 0; width: 40%; left: -60%;
          background: linear-gradient(100deg, transparent, rgba(255,255,255,.45), transparent);
          transform: skewX(-20deg); animation: sc-shine 3.6s ease-in-out infinite; }
        @keyframes sc-shine { 0%, 55% { left: -60%; } 80%, 100% { left: 130%; } }

        .sc-corner { position: absolute; width: 8px; height: 8px; border: 2px solid ${C.amber};
          transition: transform .25s, opacity .25s; opacity: 0; pointer-events: none; }
        .sc-btn:hover:not(:disabled) .sc-corner { opacity: 1; }
        .sc-corner.tl { top: 3px; left: 3px; border-right: 0; border-bottom: 0; transform: translate(4px,4px); }
        .sc-corner.tr { top: 3px; right: 3px; border-left: 0; border-bottom: 0; transform: translate(-4px,4px); }
        .sc-corner.bl { bottom: 3px; left: 3px; border-right: 0; border-top: 0; transform: translate(4px,-4px); }
        .sc-corner.br { bottom: 3px; right: 3px; border-left: 0; border-top: 0; transform: translate(-4px,-4px); }
        .sc-btn:hover:not(:disabled) .sc-corner { transform: translate(0,0); }

        .sc-plane { transition: transform .35s cubic-bezier(.4,0,.2,1); }
        .sc-btn:hover:not(:disabled) .sc-plane { transform: translate(5px,-5px) rotate(-8deg); }
        .sc-plane-fly { animation: sc-fly 1.1s ease-in infinite; }
        @keyframes sc-fly {
          0% { transform: translate(-6px,6px) scale(.8); opacity: 0; }
          30% { opacity: 1; }
          100% { transform: translate(18px,-18px) scale(1.1); opacity: 0; }
        }

        .sc-packets { position: absolute; left: 0; right: 0; top: 50%; height: 2px; pointer-events: none; }
        .sc-packets i { position: absolute; top: -2px; left: -10px; width: 6px; height: 6px; background: ${C.bg};
          animation: sc-packet 1.2s linear infinite; }
        .sc-packets i:nth-child(2) { animation-delay: .3s; }
        .sc-packets i:nth-child(3) { animation-delay: .6s; }
        .sc-packets i:nth-child(4) { animation-delay: .9s; }
        @keyframes sc-packet { from { left: -10px; opacity: 0; } 15% { opacity: 1; } 85% { opacity: 1; } to { left: 100%; opacity: 0; } }

        .sc-dots::after { content: ""; animation: sc-dots 1.2s steps(1) infinite; }
        @keyframes sc-dots { 0% { content: ""; } 25% { content: "."; } 50% { content: ".."; } 75% { content: "..."; } }

        .sc-ripple { position: absolute; border-radius: 9999px; background: rgba(255,255,255,.55); pointer-events: none;
          transform: translate(-50%,-50%) scale(0); animation: sc-ripple .6s ease-out forwards; }
        @keyframes sc-ripple { to { transform: translate(-50%,-50%) scale(1); opacity: 0; } }

        .sc-check path { stroke-dasharray: 26; stroke-dashoffset: 26; animation: sc-draw .45s .05s ease-out forwards; }
        @keyframes sc-draw { to { stroke-dashoffset: 0; } }
        .sc-pop { animation: sc-pop .4s cubic-bezier(.3,1.6,.5,1); }
        @keyframes sc-pop { from { transform: scale(.92); } to { transform: scale(1); } }

        .sc-shake { animation: sc-shake .45s; }
        @keyframes sc-shake { 20% { transform: translateX(-6px); } 40% { transform: translateX(6px); } 60% { transform: translateX(-4px); } 80% { transform: translateX(3px); } }

        @media (prefers-reduced-motion: reduce) {
          .sc-shine::after, .sc-plane-fly, .sc-packets i, .sc-dots::after, .sc-ripple, .sc-check path, .sc-pop, .sc-shake { animation: none !important; }
          .sc-check path { stroke-dashoffset: 0; }
          .sc-ring, .sc-caret, .sc-sweep, .sc-bar { animation: none !important; }
          .sc-tilt, .sc-flip { transition: none !important; }
        }
      `}</style>

      <div
        ref={wrapRef}
        onPointerMove={handleMove}
        onPointerLeave={resetTilt}
        className="w-full max-w-xl"
        style={{ perspective: "1400px" }}
      >
        <div
          ref={tiltRef}
          className="sc-tilt relative"
          style={{
            transformStyle: "preserve-3d",
            transition: "transform .18s ease-out",
          }}
        >
          {[-18, -36].map((z, i) => (
            <div
              key={z}
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                transform: `translateZ(${z}px)`,
                border: `1px solid ${C.dim}`,
                background: i === 0 ? "rgba(255,77,46,.05)" : "transparent",
                opacity: 0.7 - i * 0.3,
              }}
            />
          ))}

          <div
            className="sc-flip relative"
            style={{
              transformStyle: "preserve-3d",
              transition: "transform .9s cubic-bezier(.5,-0.1,.2,1.1)",
              transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            }}
          >
            <form
              onSubmit={onSubmit}
              noValidate
              aria-hidden={flipped}
              className="relative overflow-hidden"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                background: C.panel,
                border: `1px solid ${C.orange}`,
                boxShadow: `0 0 40px rgba(255,138,31,.18), inset 0 0 40px rgba(255,77,46,.06)`,
              }}
            >
              <div className="sc-scan pointer-events-none absolute inset-0" />
              <div
                className="sc-sweep pointer-events-none absolute left-0 right-0 h-8"
                style={{ background: "linear-gradient(transparent, rgba(255,138,31,.10), transparent)" }}
              />

              <div
                className="flex items-center justify-between px-5 py-3 text-xs"
                style={{ borderBottom: `1px solid ${C.dim}`, color: C.amber }}
              >
                <span>&gt; OPEN_CHANNEL</span>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: sending ? C.amber : "#22c55e", boxShadow: `0 0 8px ${sending ? C.amber : "#22c55e"}` }}
                  />
                  {sending ? "TRANSMITTING" : "LINE READY"}
                </span>
              </div>

              <div className="relative space-y-5 p-6 sm:p-8" style={{ transformStyle: "preserve-3d" }}>
                <div style={{ transform: "translateZ(38px)" }}>
                  <h2 className="text-2xl font-bold sm:text-3xl" style={{ color: C.orange, textShadow: `0 0 14px rgba(255,138,31,.55)` }}>
                    Send a message<span className="sc-caret ml-1 inline-block h-6 w-3 align-middle" style={{ background: C.orange }} />
                  </h2>
                  <p className="mt-2 text-sm" style={{ color: C.dim }}>
                    Got a project, role or idea? I reply within two days.
                  </p>
                </div>

                <div style={{ transform: "translateZ(22px)" }} className="space-y-5">
                  <Field id="sc-name" label="name" error={errors.name}>
                    <input
                      id="sc-name"
                      name="name"
                      autoComplete="name"
                      value={values.name}
                      onChange={onChange}
                      disabled={sending}
                      aria-invalid={!!errors.name}
                      placeholder="Your name"
                      className="sc-input w-full px-3 py-2.5 text-sm"
                    />
                  </Field>

                  <Field id="sc-email" label="email" error={errors.email}>
                    <input
                      id="sc-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={values.email}
                      onChange={onChange}
                      disabled={sending}
                      aria-invalid={!!errors.email}
                      placeholder="you@example.com"
                      className="sc-input w-full px-3 py-2.5 text-sm"
                    />
                  </Field>

                  <Field id="sc-message" label="message" error={errors.message}>
                    <textarea
                      id="sc-message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={onChange}
                      disabled={sending}
                      aria-invalid={!!errors.message}
                      placeholder="What are you building?"
                      className="sc-input w-full resize-none px-3 py-2.5 text-sm"
                    />
                    <div className="mt-1 text-right text-[11px]" style={{ color: values.message.length > MAX_LEN - 50 ? C.ember : C.dim }}>
                      {values.message.length}/{MAX_LEN}
                    </div>
                  </Field>

                  <input
                    name="company"
                    value={values.company}
                    onChange={onChange}
                    tabIndex={-1}
                    autoComplete="off"
                    aria-hidden="true"
                    className="absolute -left-[9999px] h-0 w-0 opacity-0"
                  />
                </div>

                <div style={{ transform: "translateZ(30px)", transformStyle: "preserve-3d" }}>
                  <button
                    key={shakeKey}
                    type="submit"
                    disabled={sending || status === "sent"}
                    onClick={addRipple}
                    className={`sc-btn relative w-full overflow-hidden px-6 py-3.5 text-sm font-bold disabled:cursor-wait ${
                      shakeKey ? "sc-shake" : ""
                    } ${status === "sent" ? "sc-pop" : ""}`}
                    style={{
                      background:
                        status === "sent"
                          ? `linear-gradient(135deg, ${C.amber}, ${C.orange})`
                          : `linear-gradient(135deg, ${C.orange}, ${C.ember})`,
                      color: C.bg,
                      boxShadow: `0 4px 20px rgba(255,138,31,.3)`,
                    }}
                  >
                    {status === "idle" || status === "error" ? <span className="sc-shine" /> : null}

                    <span className="sc-corner tl" />
                    <span className="sc-corner tr" />
                    <span className="sc-corner bl" />
                    <span className="sc-corner br" />

                    {sending && (
                      <>
                        <span className="sc-bar absolute inset-y-0 left-0" style={{ background: "rgba(10,4,5,.28)" }} />
                        <span className="sc-packets">
                          <i /><i /><i /><i />
                        </span>
                      </>
                    )}

                    {ripples.map((r) => (
                      <span key={r.id} className="sc-ripple" style={{ left: r.x, top: r.y, width: r.size, height: r.size }} />
                    ))}

                    <span className="relative flex items-center justify-center gap-2">
                      {status === "sent" ? (
                        <>
                          <svg className="sc-check" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="square">
                            <path d="M4 12.5l5 5L20 6.5" />
                          </svg>
                          Sent
                        </>
                      ) : sending ? (
                        <>
                          <svg className="sc-plane-fly" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                          </svg>
                          <span className="sc-dots">Sending</span>
                        </>
                      ) : (
                        <>
                          {status === "error" ? "Try again" : "Send message"}
                          <svg className="sc-plane" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
                          </svg>
                        </>
                      )}
                    </span>
                  </button>

                  {status === "error" && (
                    <p role="alert" className="mt-3 text-xs" style={{ color: C.ember }}>
                      The message didn't go through. Check your connection and try again, or email me directly.
                    </p>
                  )}
                </div>
              </div>
            </form>

            <div
              aria-hidden={!flipped}
              className="absolute inset-0 flex flex-col items-center justify-center gap-6 overflow-hidden px-8 text-center"
              style={{
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
                background: C.panel,
                border: `1px solid ${C.orange}`,
                boxShadow: `0 0 50px rgba(255,138,31,.25)`,
              }}
            >
              <div className="sc-scan pointer-events-none absolute inset-0" />
              <SignalRings active={flipped} />
              <div className="relative">
                <h3 className="text-2xl font-bold" style={{ textShadow: `0 0 14px rgba(255,138,31,.55)` }}>
                  Message sent
                </h3>
                <p className="mt-3 text-sm" style={{ color: C.amber }}>
                  Thanks{values.name ? `, ${values.name.split(" ")[0]}` : ""}. I'll reply to
                  <br />
                  <span style={{ color: C.orange }}>{values.email}</span> within two days.
                </p>
              </div>
              <button
                type="button"
                onClick={sendAnother}
                tabIndex={flipped ? 0 : -1}
                className="sc-link relative px-5 py-2 text-sm transition-colors hover:bg-[rgba(255,138,31,.12)]"
                style={{ border: `1px solid ${C.orange}`, color: C.orange }}
              >
                Send another message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}