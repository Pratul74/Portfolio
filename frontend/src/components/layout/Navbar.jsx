import { useCallback, useEffect, useRef, useState } from "react";
import SystemStatus from "../effects/SystemStatus";

const LINKS = [
  { id: "home", num: "01", label: "HOME", tag: "EXECUTE" },
  { id: "about", num: "02", label: "ABOUT", tag: "SYSTEM" },
  { id: "skills", num: "03", label: "SKILLS", tag: "STACK" },
  { id: "projects", num: "04", label: "PROJECTS", tag: "BUILDS" },
  { id: "contact", num: "05", label: "CONTACT", tag: "SIGNAL" },
];


const FOCUS_RING =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-nv-hi";

const GLITCH =
  "before:pointer-events-none before:absolute before:top-0 before:left-0 before:opacity-0 before:content-[attr(data-text)] " +
  "after:pointer-events-none after:absolute after:top-0 after:left-0 after:opacity-0 after:content-[attr(data-text)] " +
  "group-hover/logo:before:text-[#ff3d2e] group-hover/logo:before:opacity-90 " +
  "group-hover/logo:after:text-[#2ee6c8] group-hover/logo:after:opacity-90 " +
  "motion-safe:group-hover/logo:before:animate-nv-glitch-a motion-safe:group-hover/logo:after:animate-nv-glitch-b";

const ICON_BTN =
  "group/tip relative cursor-pointer items-center justify-center rounded-full bg-transparent p-2 text-nv " +
  "transition-[color,background-color,scale] duration-200 hover:bg-[#3a1e00]/55 hover:text-nv-pale active:scale-90 " +
  FOCUS_RING;

const TIP =
  "pointer-events-none absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 rounded border border-[#7a3a1a] bg-black " +
  "px-2 py-0.5 text-[10px] tracking-[.08em] whitespace-nowrap text-nv-hi opacity-0 transition-opacity duration-200 " +
  "group-hover/tip:opacity-100 group-focus-visible/tip:opacity-100";


const FACE =
  "absolute inset-0 flex items-center justify-center gap-[.4rem] rounded-full px-4 text-[.8rem] tracking-[.08em] whitespace-nowrap backface-hidden";


const BAR =
  "absolute left-0 h-0.5 w-full rounded-[1px] bg-current transition-[rotate,top,opacity] duration-250 motion-reduce:duration-10";


const M_LINK =
  "flex items-center justify-between rounded-xl px-[.9rem] py-[.7rem] text-[.9rem] tracking-[.08em] text-nv-pale/80 no-underline " +
  "transition-[background-color,color,padding] duration-200 hover:bg-nv/10 hover:pl-[1.2rem] " +
  "aria-[current=true]:bg-linear-to-r aria-[current=true]:from-nv/30 aria-[current=true]:to-[#ff5500]/12 " +
  "aria-[current=true]:text-white aria-[current=true]:text-glow " +
  FOCUS_RING;

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
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 font-tech sm:px-4">
      <nav
        aria-label="Primary"
        className={`pointer-events-auto relative w-full max-w-6xl origin-top perspective-[1400px] transition-[margin] duration-300 motion-safe:animate-nv-boot ${
          scrolled ? "mt-2" : "mt-4"
        }`}
      >

        <div
          ref={tiltRef}
          data-scrolled={scrolled}
          className="relative transform-3d rounded-full border border-nv-lo/50 shadow-nv-pill transition-[box-shadow,border-color] duration-300 data-[scrolled=true]:border-nv/75 data-[scrolled=true]:shadow-nv-pill-hot"
        >
          <div
            className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#160b04]/78 backdrop-blur-[14px]"
            aria-hidden="true"
          >
            <div className="absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(0,0,0,.28)_0_1px,transparent_1px_3px)]" />
            <div className="absolute inset-y-0 left-0 w-[28%] bg-linear-to-r from-transparent via-[rgba(255,190,110,.14)] to-transparent motion-safe:animate-nv-sweep" />
            <div
              ref={barRef}
              style={{ transform: "scaleX(0)" }}
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-linear-to-r from-nv-lo to-nv-pale shadow-[0_0_8px_var(--color-nv)]"
            />
          </div>

          <div className="relative flex translate-z-4 items-center justify-between gap-3 p-2">
            <a
              href="#home"
              className={`group/logo flex items-center gap-1 rounded-full px-[.9rem] py-[.4rem] no-underline transition-transform duration-150 hover:scale-[1.04] active:scale-[.96] ${FOCUS_RING}`}
              onClick={() => goTo("home")}
              onPointerEnter={hoverSound}
              aria-label="Pratul dev, back to top"
            >
              <span className="font-pixel text-2xl text-nv">&gt;</span>
              <span
                className={`relative font-pixel text-2xl tracking-wide text-nv-hi text-glow ${GLITCH}`}
                data-text="PRATUL.DEV"
              >
                PRATUL.DEV
              </span>
              <span
                className="ml-1 inline-block h-4 w-2 bg-nv shadow-[0_0_8px_var(--color-nv)] motion-safe:animate-nv-blink"
                aria-hidden="true"
              />
            </a>

            <ul className="m-0 hidden list-none items-center gap-1 p-0 lg:flex xl:gap-2">
              {LINKS.map(({ id, num, label, tag }) => (
                <li
                  key={id}
                  className={`group/card relative h-[38px] w-[100px] perspective-[600px] xl:w-[116px] ${
                    pulse === id
                      ? "after:pointer-events-none after:absolute after:inset-0 after:rounded-full after:border after:border-nv-pale motion-safe:after:animate-nv-pulse"
                      : ""
                  }`}
                  onPointerEnter={hoverSound}
                >
                  <a
                    href={`#${id}`}
                    className={`relative block h-full w-full transform-3d no-underline outline-none transition-transform duration-500 ease-nv-spring group-hover/card:rotate-x-180 focus-visible:rotate-x-180 motion-reduce:duration-10 ${
                      active === id ? "rotate-x-180" : ""
                    }`}
                    aria-label={label}
                    aria-current={active === id ? "true" : undefined}
                    onClick={() => goTo(id)}
                  >
                    <span
                      className={`${FACE} border border-nv/25 bg-[#2a1508]/50 text-nv-pale/85`}
                      aria-hidden="true"
                    >
                      <span className="text-[10px] text-nv-lo/95">{num}</span>
                      <span>{label}</span>
                    </span>
                    <span
                      className={`${FACE} rotate-x-180 border border-nv/85 bg-linear-135 from-nv/35 to-[#ff5500]/50 font-bold text-white text-glow shadow-[0_0_15px_rgba(255,158,0,.6),inset_0_0_8px_rgba(255,158,0,.3)]`}
                      aria-hidden="true"
                    >
                      <span className="text-[10px] text-nv-pale">&gt;</span>
                      <span>[{tag}]</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-1.5 border-l border-[#4a2608]/80 pl-2">
              <button
                type="button"
                className={`${ICON_BTN} flex`}
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
                <span className={TIP} aria-hidden="true">
                  <span
                    className="mr-1.5 inline-block size-1.5 rounded-full bg-nv shadow-[0_0_8px_var(--color-nv)] data-[off=true]:bg-[#5a2410] data-[off=true]:shadow-none"
                    data-off={!sfx}
                  />
                  SYNTH: {sfx ? "ON" : "OFF"}
                </span>
              </button>

              <a
                href="#system-status"
                className={`${ICON_BTN} hidden lg:flex`}
                aria-label="Open terminal"
                onClick={sounds.terminal}
                onPointerEnter={hoverSound}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className={TIP} aria-hidden="true">TERMINAL</span>
              </a>

              <div className="hidden pl-1 xl:block">
                <SystemStatus />
              </div>

              <button
                type="button"
                className={`${ICON_BTN} flex lg:hidden`}
                onClick={() => {
                  sounds.menu();
                  setOpen((o) => !o);
                }}
                aria-label="Toggle menu"
                aria-expanded={open}
                aria-controls="nv-menu"
              >
                <span className="relative block h-3 w-4" aria-hidden="true">
                  <span className={`${BAR} ${open ? "top-[5px] rotate-45" : "top-0"}`} />
                  <span className={`${BAR} top-[5px] ${open ? "opacity-0" : ""}`} />
                  <span className={`${BAR} ${open ? "top-[5px] -rotate-45" : "top-[10px]"}`} />
                </span>
              </button>
            </div>
          </div>
        </div>

        <div
          id="nv-menu"
          className={`grid lg:hidden motion-reduce:[transition-duration:.01s]! ${
            open
              ? "visible mt-2 grid-rows-[1fr] [transition:grid-template-rows_.35s_ease,margin-top_.35s_ease,visibility_0s_linear_0s]"
              : "invisible mt-0 grid-rows-[0fr] [transition:grid-template-rows_.35s_ease,margin-top_.35s_ease,visibility_0s_linear_.35s]"
          }`}
        >
          <div className="overflow-hidden rounded-[1.25rem]">
            <div className="relative rounded-[1.25rem] border border-nv/35 bg-[#0e0703]/92 p-2 shadow-nv-panel backdrop-blur-[14px]">
              <ul className="m-0 flex list-none flex-col gap-1 p-0">
                {LINKS.map(({ id, num, label, tag }) => (
                  <li key={id}>
                    <a
                      href={`#${id}`}
                      className={M_LINK}
                      aria-current={active === id ? "true" : undefined}
                      onClick={() => {
                        goTo(id);
                        setOpen(false);
                      }}
                    >
                      <span>
                        [{num}] {label}
                      </span>
                      <small className="text-[10px] text-nv-lo">[{tag}]</small>
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="#system-status"
                    className={M_LINK}
                    onClick={() => {
                      sounds.terminal();
                      setOpen(false);
                    }}
                  >
                    <span>&gt; TERMINAL</span>
                    <small className="text-[10px] text-nv-lo">[OPEN]</small>
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