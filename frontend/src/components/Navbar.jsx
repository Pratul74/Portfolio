import { useCallback, useEffect, useRef, useState } from "react";
import SystemStatus from "./SystemStatus";

const LINKS = [
  { id: "home", num: "01", label: "HOME", tag: "EXECUTE" },
  { id: "about", num: "02", label: "ABOUT", tag: "SYSTEM" },
  { id: "skills", num: "03", label: "SKILLS", tag: "STACK" },
  { id: "projects", num: "04", label: "PROJECTS", tag: "BUILDS" },
  { id: "contact", num: "05", label: "CONTACT", tag: "SIGNAL" },
];

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=VT323&display=swap');

.nv{--a:#ff9e00;--a-hi:#ffb703;--a-lo:#e07a00;--a-pale:#fde047;font-family:'Share Tech Mono',ui-monospace,monospace}
.nv-pixel{font-family:'VT323',ui-monospace,monospace}

/* power-on */
.nv-boot{animation:nvBoot .6s cubic-bezier(.2,.9,.3,1) both;transform-origin:center top}
@keyframes nvBoot{0%{transform:scale(1,.02);filter:brightness(4);opacity:.5}55%{transform:scale(1,.1);filter:brightness(2.5)}100%{transform:none;filter:none;opacity:1}}

/* pill */
.nv-pill{border-radius:9999px;border:1px solid rgba(224,122,0,.5);transition:box-shadow .3s,border-color .3s;
  box-shadow:0 15px 35px rgba(0,0,0,.85),0 0 20px rgba(255,158,0,.2),inset 0 0 15px rgba(255,158,0,.08)}
.nv-pill[data-scrolled="true"]{border-color:rgba(255,158,0,.75);
  box-shadow:0 10px 30px rgba(0,0,0,.9),0 0 30px rgba(255,158,0,.32),inset 0 0 15px rgba(255,158,0,.1)}
.nv-bg{position:absolute;inset:0;border-radius:inherit;overflow:hidden;background:rgba(22,11,4,.78);
  -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px)}
.nv-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.nv-sweep{position:absolute;top:0;bottom:0;left:0;width:28%;background:linear-gradient(90deg,transparent,rgba(255,190,110,.14),transparent);animation:nvSweep 7s linear infinite}
@keyframes nvSweep{0%{transform:translateX(-100%)}60%,100%{transform:translateX(450%)}}
.nv-progress{position:absolute;left:0;bottom:0;height:2px;width:100%;transform-origin:left center;transform:scaleX(0);
  background:linear-gradient(90deg,var(--a-lo),var(--a-pale));box-shadow:0 0 8px var(--a)}
.nv-row{transform:translateZ(16px)}

/* logo */
.nv-logo{display:flex;align-items:center;gap:.25rem;padding:.4rem .9rem;border-radius:9999px;text-decoration:none;transition:transform .15s}
.nv-logo:hover{transform:scale(1.04)}
.nv-logo:active{transform:scale(.96)}
.nv-glitch{position:relative;color:var(--a-hi);text-shadow:0 0 8px rgba(255,158,0,.7)}
.nv-glitch::before,.nv-glitch::after{content:attr(data-text);position:absolute;left:0;top:0;opacity:0;pointer-events:none}
.nv-logo:hover .nv-glitch::before{opacity:.9;color:#ff3d2e;animation:nvGlitchA .35s steps(2,end) infinite}
.nv-logo:hover .nv-glitch::after{opacity:.9;color:#2ee6c8;animation:nvGlitchB .35s steps(2,end) infinite}
@keyframes nvGlitchA{0%{clip-path:inset(0 0 60% 0);transform:translate(-2px,0)}50%{clip-path:inset(40% 0 20% 0);transform:translate(2px,0)}100%{clip-path:inset(70% 0 0 0);transform:translate(-1px,0)}}
@keyframes nvGlitchB{0%{clip-path:inset(60% 0 0 0);transform:translate(2px,0)}50%{clip-path:inset(10% 0 55% 0);transform:translate(-2px,0)}100%{clip-path:inset(30% 0 35% 0);transform:translate(1px,0)}}
.nv-cursor{display:inline-block;width:8px;height:16px;margin-left:4px;background:var(--a);box-shadow:0 0 8px var(--a);animation:nvBlink 1s steps(2,end) infinite}
@keyframes nvBlink{50%{opacity:.1}}

/* 3D flip cards */
.nv-card{position:relative;height:38px;perspective:600px}
.nv-inner{position:relative;display:block;width:100%;height:100%;outline:none;text-decoration:none;
  transform-style:preserve-3d;transition:transform .5s cubic-bezier(.3,1.4,.5,1)}
.nv-on .nv-inner,.nv-inner:focus-visible{transform:rotateX(180deg)}
@media (hover:hover){.nv-card:hover .nv-inner{transform:rotateX(180deg)}}
.nv-face{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:.4rem;padding:0 1rem;
  border-radius:9999px;font-size:.8rem;letter-spacing:.08em;white-space:nowrap;
  backface-visibility:hidden;-webkit-backface-visibility:hidden}
.nv-front{background:rgba(42,21,8,.5);border:1px solid rgba(255,158,0,.25);color:rgba(253,224,71,.85)}
.nv-front i{font-style:normal;font-size:10px;color:rgba(224,122,0,.95)}
.nv-back{transform:rotateX(180deg);font-weight:700;color:#fff;text-shadow:0 0 8px rgba(255,158,0,.7);
  background:linear-gradient(135deg,rgba(255,158,0,.35),rgba(255,85,0,.5));border:1px solid rgba(255,158,0,.85);
  box-shadow:0 0 15px rgba(255,158,0,.6),inset 0 0 8px rgba(255,158,0,.3)}
.nv-back i{font-style:normal;font-size:10px;color:var(--a-pale)}
.nv-pulse::after{content:"";position:absolute;inset:0;border-radius:9999px;border:1px solid var(--a-pale);pointer-events:none;animation:nvPulse .55s ease-out forwards}
@keyframes nvPulse{from{opacity:.9;transform:scale(1)}to{opacity:0;transform:scale(1.35,1.9)}}

/* utility controls */
.nv-ctrl{display:flex;align-items:center;gap:.375rem;padding-left:.5rem;border-left:1px solid rgba(74,38,8,.8)}
.nv-icon{position:relative;display:flex;align-items:center;justify-content:center;padding:.5rem;border:0;border-radius:9999px;
  background:transparent;color:var(--a);cursor:pointer;transition:color .2s,background .2s,transform .15s}
.nv-icon:hover{color:var(--a-pale);background:rgba(58,30,0,.55)}
.nv-icon:active{transform:scale(.9)}
.nv-icon:focus-visible,.nv-logo:focus-visible,.nv-m-link:focus-visible{outline:2px solid var(--a-hi);outline-offset:2px}
.nv-tip{position:absolute;top:calc(100% + 8px);left:50%;transform:translateX(-50%);padding:2px 8px;border:1px solid #7a3a1a;border-radius:4px;
  background:#000;color:var(--a-hi);font-size:10px;letter-spacing:.08em;white-space:nowrap;opacity:0;pointer-events:none;transition:opacity .2s}
.nv-icon:hover .nv-tip,.nv-icon:focus-visible .nv-tip{opacity:1}
.nv-led{display:inline-block;width:6px;height:6px;border-radius:9999px;background:var(--a);box-shadow:0 0 8px var(--a)}
.nv-led[data-off="true"]{background:#5a2410;box-shadow:none}

/* burger */
.nv-burger{position:relative;display:block;width:16px;height:12px}
.nv-burger span{position:absolute;left:0;width:100%;height:2px;border-radius:1px;background:currentColor;transition:transform .25s,top .25s,opacity .2s}
.nv-burger span:nth-child(1){top:0}
.nv-burger span:nth-child(2){top:5px}
.nv-burger span:nth-child(3){top:10px}
.nv-burger.is-open span:nth-child(1){top:5px;transform:rotate(45deg)}
.nv-burger.is-open span:nth-child(2){opacity:0}
.nv-burger.is-open span:nth-child(3){top:5px;transform:rotate(-45deg)}

/* mobile panel */
.nv-panel{display:grid;grid-template-rows:0fr;margin-top:0;visibility:hidden;
  transition:grid-template-rows .35s ease,margin-top .35s ease,visibility 0s linear .35s}
.nv-panel.is-open{grid-template-rows:1fr;margin-top:8px;visibility:visible;transition-delay:0s}
.nv-panel-inner{position:relative;border:1px solid rgba(255,158,0,.35);border-radius:1.25rem;background:rgba(14,7,3,.92);
  -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);box-shadow:0 15px 35px rgba(0,0,0,.85),0 0 20px rgba(255,158,0,.15)}
.nv-m-link{display:flex;align-items:center;justify-content:space-between;padding:.7rem .9rem;border-radius:.75rem;
  color:rgba(253,224,71,.8);text-decoration:none;font-size:.9rem;letter-spacing:.08em;transition:background .2s,color .2s,padding-left .2s}
.nv-m-link:hover{background:rgba(255,158,0,.1);padding-left:1.2rem}
.nv-m-link[aria-current="true"]{color:#fff;background:linear-gradient(90deg,rgba(255,158,0,.3),rgba(255,85,0,.12));text-shadow:0 0 8px rgba(255,158,0,.7)}
.nv-m-link small{font-size:10px;color:var(--a-lo)}
@media (min-width:1024px){.nv-panel{display:none}}

@media (prefers-reduced-motion:reduce){
  .nv-boot,.nv-sweep,.nv-cursor,.nv-pulse::after,.nv-glitch::before,.nv-glitch::after{animation:none!important}
  .nv-inner,.nv-panel,.nv-burger span{transition-duration:.01s!important}
}
`;

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [sfx, setSfx] = useState(() => {
    try {
      return localStorage.getItem("nv-sfx") !== "off";
    } catch {
      return true;
    }
  });
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [pulse, setPulse] = useState(null);

  const tiltRef = useRef(null);
  const barRef = useRef(null);
  const audioRef = useRef(null);
  const sfxRef = useRef(sfx);
  const pulseTimer = useRef(0);
  sfxRef.current = sfx;

  useEffect(() => {
    const unlock = () => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!audioRef.current && Ctx) audioRef.current = new Ctx();
        audioRef.current?.resume?.();
        window.removeEventListener("pointerdown", unlock);
        window.removeEventListener("keydown", unlock);
      } catch {
      }
    };
    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);
    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  const beep = useCallback((type, f1, f2 = f1, dur = 0.08, vol = 0.05, delay = 0) => {
    const ctx = audioRef.current;
    if (!sfxRef.current || !ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      const t = ctx.currentTime + delay;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(f1, t);
      osc.frequency.linearRampToValueAtTime(f2, t + dur);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur);
    } catch {
    }
  }, []);

  const sounds = {
    hover: () => beep("sine", 340, 380, 0.04, 0.03),
    click: () => {
      beep("triangle", 680, 680, 0.07, 0.05);
      beep("triangle", 920, 920, 0.1, 0.05, 0.07);
    },
    terminal: () => beep("sawtooth", 220, 560, 0.1, 0.035),
    menu: () => beep("square", 300, 520, 0.07, 0.03),
  };

  const toggleSfx = () => {
    const next = !sfx;
    if (!next) beep("square", 440, 200, 0.12, 0.05);
    sfxRef.current = next;
    setSfx(next);
    try {
      localStorage.setItem("nv-sfx", next ? "on" : "off");
    } catch {
    }
    if (next) beep("square", 660, 990, 0.12, 0.05);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setScrolled(y > 24);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  useEffect(() => {
    const el = tiltRef.current;
    if (!el) return undefined;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !fine) return undefined;

    const cur = { x: 0, y: 0 };
    const tgt = { x: 0, y: 0 };
    let raf = 0;

    const loop = () => {
      cur.x += (tgt.x - cur.x) * 0.12;
      cur.y += (tgt.y - cur.y) * 0.12;
      el.style.transform = `rotateX(${cur.x.toFixed(2)}deg) rotateY(${cur.y.toFixed(2)}deg)`;
      const settled = Math.abs(tgt.x - cur.x) < 0.01 && Math.abs(tgt.y - cur.y) < 0.01;
      raf = settled ? 0 : requestAnimationFrame(loop);
    };
    const kick = () => {
      if (!raf) raf = requestAnimationFrame(loop);
    };
    const clamp = (v) => Math.max(-1, Math.min(1, v));

    const onMove = (e) => {
      const r = el.parentElement.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      tgt.y = clamp(dx / (window.innerWidth / 2)) * 12;
      tgt.x = clamp(dy / (window.innerHeight / 2)) * -8;
      kick();
    };
    const onLeave = () => {
      tgt.x = 0;
      tgt.y = 0;
      kick();
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => () => clearTimeout(pulseTimer.current), []);

  const goTo = (id) => {
    setActive(id);
    setPulse(id);
    clearTimeout(pulseTimer.current);
    pulseTimer.current = setTimeout(() => setPulse(null), 600);
    sounds.click();
  };

  const hoverSound = (e) => {
    if (e.pointerType === "mouse") sounds.hover();
  };

  return (
    <header className="nv pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 sm:px-4">
      <style>{CSS}</style>

      <nav
        aria-label="Primary"
        className={`nv-boot pointer-events-auto relative w-full max-w-6xl transition-[margin] duration-300 ${scrolled ? "mt-2" : "mt-4"}`}
        style={{ perspective: 1400 }}
      >
        <div ref={tiltRef} className="nv-pill relative" data-scrolled={scrolled} style={{ transformStyle: "preserve-3d" }}>
          <div className="nv-bg" aria-hidden="true">
            <div className="nv-scan" />
            <div className="nv-sweep" />
            <div ref={barRef} className="nv-progress" />
          </div>

          <div className="nv-row relative flex items-center justify-between gap-3 p-2">
            {/* brand */}
            <a href="#home" className="nv-logo" onClick={() => goTo("home")} onPointerEnter={hoverSound} aria-label="Pratul dev, back to top">
              <span className="nv-pixel text-2xl" style={{ color: "var(--a)" }}>
                &gt;
              </span>
              <span className="nv-glitch nv-pixel text-2xl tracking-wide" data-text="PRATUL.DEV">
                PRATUL.DEV
              </span>
              <span className="nv-cursor" aria-hidden="true" />
            </a>

            {/* flip-card links */}
            <ul className="m-0 hidden list-none items-center gap-1 p-0 lg:flex xl:gap-2">
              {LINKS.map(({ id, num, label, tag }) => (
                <li
                  key={id}
                  className={`nv-card w-[100px] xl:w-[116px] ${active === id ? "nv-on" : ""} ${pulse === id ? "nv-pulse" : ""}`}
                  onPointerEnter={hoverSound}
                >
                  <a
                    href={`#${id}`}
                    className="nv-inner"
                    aria-label={label}
                    aria-current={active === id ? "true" : undefined}
                    onClick={() => goTo(id)}
                  >
                    <span className="nv-face nv-front" aria-hidden="true">
                      <i>{num}</i>
                      <span>{label}</span>
                    </span>
                    <span className="nv-face nv-back" aria-hidden="true">
                      <i>&gt;</i>
                      <span>[{tag}]</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            {/* controls */}
            <div className="nv-ctrl">
              <button
                type="button"
                className="nv-icon"
                onClick={toggleSfx}
                aria-label={sfx ? "Mute synth sound" : "Enable synth sound"}
                aria-pressed={sfx}
              >
                {sfx ? (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15zM17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                  </svg>
                )}
                <span className="nv-tip" aria-hidden="true">
                  <span className="nv-led mr-1.5" data-off={!sfx} />
                  SYNTH: {sfx ? "ON" : "OFF"}
                </span>
              </button>

              <a
                href="#system-status"
                className="nv-icon hidden lg:flex"
                aria-label="Open terminal"
                onClick={sounds.terminal}
                onPointerEnter={hoverSound}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="nv-tip" aria-hidden="true">TERMINAL</span>
              </a>

              <div className="hidden pl-1 xl:block">
                <SystemStatus />
              </div>

              <button
                type="button"
                className="nv-icon lg:hidden"
                onClick={() => {
                  sounds.menu();
                  setOpen((o) => !o);
                }}
                aria-label="Toggle menu"
                aria-expanded={open}
                aria-controls="nv-menu"
              >
                <span className={`nv-burger ${open ? "is-open" : ""}`} aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* mobile menu */}
        <div id="nv-menu" className={`nv-panel ${open ? "is-open" : ""}`}>
          <div className="overflow-hidden rounded-[1.25rem]">
            <div className="nv-panel-inner p-2">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {LINKS.map(({ id, num, label, tag }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className="nv-m-link"
                      aria-current={active === id ? "true" : undefined}
                      onClick={() => {
                        goTo(id);
                        setOpen(false);
                      }}
                    >
                      <span>
                        [{num}] {label}
                      </span>
                      <small>[{tag}]</small>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#system-status"
                    className="nv-m-link"
                    onClick={() => {
                      sounds.terminal();
                      setOpen(false);
                    }}
                  >
                    <span>&gt; TERMINAL</span>
                    <small>[OPEN]</small>
                  </a>
                </li>
                <li className="px-3 py-2">
                  <SystemStatus />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}