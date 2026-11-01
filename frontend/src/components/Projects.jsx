import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Pause,
  Play,
  Server,
  Terminal,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA – replace with your real projects                             */
/* ------------------------------------------------------------------ */
const ICONS = { zap: Zap, cpu: Cpu, server: Server, terminal: Terminal, activity: Activity, database: Database };

const PROJECTS = [
  {
    id: "MOD 01",
    title: "EDGE GATEWAY",
    tagline: "API gateway that routes 100K+ requests a minute",
    icon: "zap",
    accent: "#ff6a00",
    status: "LIVE",
    power: 96,
    desc: "A Python API gateway that sits in front of internal services. It handles auth, rate limiting, request shaping and circuit breaking, and it stays fast under heavy traffic.",
    highlights: [
      "Handles 100K+ requests per minute on a small cluster",
      "Token-bucket rate limiting backed by Redis Lua scripts",
      "Circuit breakers and retries cut P99 latency by 30%",
    ],
    tech: ["Python", "FastAPI", "Redis", "Docker", "Nginx"],
    metrics: [
      { label: "THROUGHPUT", display: "100K+/min", value: 94 },
      { label: "P99 LATENCY", display: "-30%", value: 70 },
      { label: "UPTIME", display: "99.98%", value: 99 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "MOD 02",
    title: "AI RESPONSE ENGINE",
    tagline: "LLM serving layer with streaming and smart caching",
    icon: "cpu",
    accent: "#ffb000",
    status: "LIVE",
    power: 93,
    desc: "A service that sits between your SaaS product and the model providers. It streams tokens, caches semantically similar prompts and falls back between providers when one is slow.",
    highlights: [
      "AI responses arrive 60% faster through streaming and caching",
      "Semantic cache reuses answers for near-identical prompts",
      "Automatic provider fallback when latency spikes",
    ],
    tech: ["Python", "Async IO", "Redis", "OpenAI API", "SSE"],
    metrics: [
      { label: "FASTER REPLIES", display: "60%", value: 60 },
      { label: "CACHE HIT RATE", display: "82%", value: 82 },
      { label: "FALLBACK SUCCESS", display: "99.5%", value: 99 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "MOD 03",
    title: "JOBFORGE QUEUE",
    tagline: "Distributed task queue with priority lanes",
    icon: "server",
    accent: "#ff3d2e",
    status: "STABLE",
    power: 90,
    desc: "A distributed job runner for long background work. Workers scale on queue depth, failed jobs retry with backoff, and every job leaves a traceable audit log.",
    highlights: [
      "Priority lanes keep urgent jobs ahead of bulk work",
      "Idempotent workers make retries safe",
      "Autoscaling on queue depth, not CPU",
    ],
    tech: ["Python", "Celery", "RabbitMQ", "PostgreSQL", "K8s"],
    metrics: [
      { label: "JOBS / DAY", display: "4.2M", value: 88 },
      { label: "RETRY SUCCESS", display: "97%", value: 97 },
      { label: "WORKER IDLE", display: "6%", value: 12 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "MOD 04",
    title: "TENANTLY CORE",
    tagline: "Multi-tenant SaaS backend with billing built in",
    icon: "terminal",
    accent: "#ff8c42",
    status: "LIVE",
    power: 91,
    desc: "A reusable backend foundation for SaaS products: tenant isolation, role-based access, usage metering and subscription billing, ready to plug into a new product.",
    highlights: [
      "Row-level tenant isolation enforced in the database",
      "Usage metering feeds Stripe invoices automatically",
      "Role and permission model with full audit trail",
    ],
    tech: ["Python", "Django", "PostgreSQL", "Stripe", "Celery"],
    metrics: [
      { label: "TENANTS", display: "1,200+", value: 80 },
      { label: "BILLING ACCURACY", display: "100%", value: 100 },
      { label: "API COVERAGE", display: "94%", value: 94 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "MOD 05",
    title: "STREAMLINE PIPE",
    tagline: "Real-time event pipeline for product analytics",
    icon: "activity",
    accent: "#ffd166",
    status: "STABLE",
    power: 88,
    desc: "An event pipeline that ingests clickstream data, enriches it in flight and lands it in a warehouse within seconds, so dashboards stay live instead of a day behind.",
    highlights: [
      "Kafka partitions keyed for ordered, parallel processing",
      "Schema registry blocks bad events before they spread",
      "End-to-end delay under 3 seconds",
    ],
    tech: ["Python", "Kafka", "ClickHouse", "Pydantic", "Grafana"],
    metrics: [
      { label: "EVENTS / SEC", display: "25K", value: 75 },
      { label: "END-TO-END", display: "< 3s", value: 90 },
      { label: "DATA LOSS", display: "0", value: 100 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
  {
    id: "MOD 06",
    title: "RAGBASE SEARCH",
    tagline: "Retrieval service that grounds AI answers in your docs",
    icon: "database",
    accent: "#2ee6c8",
    status: "BETA",
    power: 86,
    desc: "A retrieval-augmented generation service. It chunks documents, embeds them, ranks results with a re-ranker and hands the model only what it needs, with citations.",
    highlights: [
      "Hybrid keyword and vector search with re-ranking",
      "Source citations returned with every answer",
      "Incremental indexing, no full rebuilds",
    ],
    tech: ["Python", "pgvector", "LangChain", "FastAPI", "Redis"],
    metrics: [
      { label: "RECALL@10", display: "93%", value: 93 },
      { label: "QUERY TIME", display: "120ms", value: 80 },
      { label: "DOCS INDEXED", display: "2M", value: 70 },
    ],
    demoUrl: "#",
    repoUrl: "#",
  },
];

const N = PROJECTS.length;
const STEP = 360 / N;
const BASE_TILT = 10;
const SLANT = -9;
const AUTO_SPEED = 0.006;
const snap = (a) => Math.round(a / STEP) * STEP;
const EDGE_FADE = "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)";
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;


const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');
.pj-arcade{font-family:'Press Start 2P',ui-monospace,monospace}
.pj-mono{font-family:'Share Tech Mono',ui-monospace,monospace}
.pj-notch{clip-path:polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))}
.pj-scan{background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.pj-grid{background-image:linear-gradient(rgba(255,106,0,.45) 1px,transparent 1px),linear-gradient(90deg,rgba(255,106,0,.45) 1px,transparent 1px);background-size:46px 46px;animation:pjGrid 4s linear infinite;-webkit-mask-image:radial-gradient(closest-side,#000 20%,transparent 100%);mask-image:radial-gradient(closest-side,#000 20%,transparent 100%)}
.pj-ticks{background:repeating-conic-gradient(from 0deg,rgba(255,170,80,.95) 0 .7deg,transparent .7deg 5deg);-webkit-mask-image:radial-gradient(closest-side,transparent 0 91%,#000 92% 99%,transparent 100%);mask-image:radial-gradient(closest-side,transparent 0 91%,#000 92% 99%,transparent 100%)}
.pj-beam{background:linear-gradient(180deg,rgba(255,120,40,.2),transparent 85%);filter:blur(2px);transform-origin:top center}
.pj-sweep{background:linear-gradient(180deg,transparent,rgba(255,200,140,.22),transparent);animation:pjSweep 3.2s linear infinite}
.pj-led{animation:pjBlink 1.4s steps(2,end) infinite}
.pj-cursor{animation:pjBlink 1s steps(2,end) infinite}
.pj-win{animation:pjWin 3s steps(2,end) infinite}
.pj-crt-on{animation:pjCrtOn .45s cubic-bezier(.2,.9,.3,1) both}
.pj-fade{animation:pjFade .25s ease-out both}
.pj-rise{animation:pjRise .45s ease-out both}
.pj-float{animation:pjFloat 5s ease-in-out infinite}
@keyframes pjGrid{to{background-position:0 46px}}
@keyframes pjSweep{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
@keyframes pjBlink{50%{opacity:.15}}
@keyframes pjWin{50%{opacity:.25}}
@keyframes pjFade{from{opacity:0}to{opacity:1}}
@keyframes pjRise{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes pjFloat{50%{transform:translateY(-6px)}}
@keyframes pjCrtOn{0%{transform:scale(1,.004);filter:brightness(4);opacity:.6}55%{transform:scale(1,.04);filter:brightness(3)}100%{transform:none;filter:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.pj-grid,.pj-sweep,.pj-led,.pj-cursor,.pj-win,.pj-crt-on,.pj-fade,.pj-rise,.pj-float{animation:none!important}}
`;

/* ------------------------------------------------------------------ */
/*  Small helpers                                                      */
/* ------------------------------------------------------------------ */
function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Procedural pixel skyline, same city feel as the hero section */
function Skyline({ seed, accent }) {
  const shapes = useMemo(() => {
    const r = rng(seed * 9973 + 17);
    const out = { blds: [], wins: [] };
    let x = 0;
    while (x < 120) {
      const w = 9 + Math.floor(r() * 9);
      const h = 14 + Math.floor(r() * 26);
      const b = { x, w: Math.min(w, 120 - x), h, ant: r() > 0.72 };
      out.blds.push(b);
      for (let wx = x + 2; wx < x + b.w - 2; wx += 4) {
        for (let wy = 56 - h + 3; wy < 54; wy += 4) {
          if (r() > 0.62) out.wins.push({ x: wx, y: wy, flick: r() > 0.82, d: Math.floor(r() * 30) / 10, hot: r() > 0.7 });
        }
      }
      x += w + 1;
    }
    return out;
  }, [seed]);

  return (
    <svg viewBox="0 0 120 56" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges" className="absolute inset-0 h-full w-full">
      <defs>
        <linearGradient id={`sky${seed}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a0405" />
          <stop offset="1" stopColor={accent} stopOpacity=".38" />
        </linearGradient>
      </defs>
      <rect width="120" height="56" fill={`url(#sky${seed})`} />
      <circle cx="98" cy="14" r="7" fill={accent} opacity=".9" />
      <circle cx="101" cy="12" r="6.5" fill="#12070a" />
      {shapes.blds.map((b, i) => (
        <g key={i}>
          <rect x={b.x} y={56 - b.h} width={b.w} height={b.h} fill="#140807" stroke="#2a0f08" strokeWidth=".6" />
          {b.ant && (
            <>
              <rect x={b.x + b.w / 2 - 0.5} y={56 - b.h - 6} width="1" height="6" fill="#4a1a0c" />
              <rect x={b.x + b.w / 2 - 1} y={56 - b.h - 7} width="2" height="2" fill={accent} className="pj-led" />
            </>
          )}
        </g>
      ))}
      {shapes.wins.map((w, i) => (
        <rect
          key={i}
          x={w.x}
          y={w.y}
          width="2"
          height="2"
          fill={w.hot ? "#ffd9a8" : accent}
          opacity=".85"
          className={w.flick ? "pj-win" : undefined}
          style={w.flick ? { animationDelay: `${w.d}s` } : undefined}
        />
      ))}
    </svg>
  );
}

function PowerBar({ value, accent }) {
  const on = Math.round(value / 10);
  return (
    <div className="flex items-center gap-2">
      <span className="pj-arcade text-[7px] text-[#c9906a]">PWR</span>
      <div className="flex flex-1 gap-[2px]">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className="h-2 flex-1" style={{ background: i < on ? accent : "#26110a" }} />
        ))}
      </div>
      <span className="pj-mono text-[11px]" style={{ color: accent }}>
        {value}
      </span>
    </div>
  );
}

function useTypewriter(text, speed = 12) {
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0));
  useEffect(() => {
    if (reducedMotion()) {
      setN(text.length);
      return undefined;
    }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return text.slice(0, n);
}

/** Floating ember particles behind the stage */
function Embers() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || reducedMotion()) return undefined;
    const ctx = c.getContext("2d");
    let raf;
    let visible = true;
    let parts = [];
    const resize = () => {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      parts = Array.from({ length: Math.round(c.width / 28) }, () => spawn(true));
    };
    const spawn = (anywhere) => ({
      x: Math.random() * c.width,
      y: anywhere ? Math.random() * c.height : c.height + 6,
      s: Math.random() > 0.8 ? 4 : 2,
      v: 0.15 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.25,
      ph: Math.random() * 6.28,
      col: Math.random() > 0.5 ? "255,106,0" : Math.random() > 0.5 ? "255,176,0" : "255,61,46",
    });
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);
    const tick = (t) => {
      raf = requestAnimationFrame(tick);
      if (!visible) return;
      ctx.clearRect(0, 0, c.width, c.height);
      parts.forEach((p, i) => {
        p.y -= p.v;
        p.x += p.drift + Math.sin(t / 900 + p.ph) * 0.15;
        if (p.y < -6) parts[i] = spawn(false);
        const a = (0.25 + 0.5 * Math.abs(Math.sin(t / 600 + p.ph))) * Math.min(1, p.y / 120);
        ctx.fillStyle = `rgba(${p.col},${a})`;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      });
    };
    resize();
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={ref} className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true" />;
}

/* ------------------------------------------------------------------ */
/*  Card faces                                                         */
/* ------------------------------------------------------------------ */
function CardFront({ p, idx, isFront, innerRef, glowRef, onActivate, onHover }) {
  const Icon = ICONS[p.icon];
  const glare = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
    e.currentTarget.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
  };
  return (
    <div
      className="absolute inset-0 cursor-pointer"
      style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
      onPointerMove={glare}
      onPointerEnter={() => onHover(true)}
      onPointerLeave={() => onHover(false)}
      onClick={() => onActivate(idx)}
    >
      <div
        ref={glowRef}
        className="pointer-events-none absolute -inset-4 opacity-0"
        style={{ background: `radial-gradient(closest-side, ${p.accent}88, transparent 78%)`, filter: "blur(16px)" }}
      />
      <div
        ref={innerRef}
        className="pj-notch absolute inset-0"
        style={{ background: `linear-gradient(160deg, ${p.accent}, #5a2410 55%, ${p.accent})` }}
      >
        <div className="pj-notch absolute flex flex-col gap-2.5 p-3" style={{ inset: 3, background: "#0b0605" }}>
          <div className="flex items-center justify-between">
            <span className="pj-arcade text-[9px]" style={{ color: p.accent }}>
              {p.id}
            </span>
            <span className="pj-mono flex items-center gap-1.5 text-[11px] text-[#ffcfa3]">
              <span className="pj-led inline-block h-2 w-2" style={{ background: p.status === "BETA" ? "#ffd166" : "#3dff8b" }} />
              {p.status}
            </span>
          </div>

          <div className="relative h-[118px] shrink-0 overflow-hidden border border-[#3a1808]">
            <Skyline seed={idx + 3} accent={p.accent} />
            <div className="pj-sweep absolute inset-x-0 top-0 h-1/2" />
            <div className="pj-scan absolute inset-0" />
            <div
              className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center border-2 bg-[#0b0605]/80"
              style={{ borderColor: p.accent, color: p.accent }}
            >
              <Icon className="h-4 w-4" />
            </div>
          </div>

          <div>
            <h3 className="pj-arcade text-[10px] leading-[1.6] text-[#fff1e0]">{p.title}</h3>
            <p className="pj-mono mt-1.5 line-clamp-2 text-[12px] leading-snug text-[#c9906a]">{p.tagline}</p>
          </div>

          <PowerBar value={p.power} accent={p.accent} />

          <div className="mt-auto flex flex-wrap gap-1">
            {p.tech.slice(0, 3).map((t) => (
              <span key={t} className="pj-mono border border-[#5a2410] bg-[#150a07] px-1.5 py-0.5 text-[10px] text-[#ffb066]">
                {t}
              </span>
            ))}
          </div>

          <div className="pj-arcade text-[7px]" style={{ color: isFront ? p.accent : "#6b3a22" }}>
            <span className={isFront ? "pj-cursor" : ""}>&gt;</span> {isFront ? "CLICK TO OPEN" : "CLICK TO FOCUS"}
          </div>
        </div>

        {/* holographic glare following the pointer */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{ background: "radial-gradient(circle at var(--gx,50%) var(--gy,0%), rgba(255,225,190,.2), transparent 55%)" }}
        />
      </div>
    </div>
  );
}

function CardBack({ p }) {
  return (
    <div
      className="absolute inset-0"
      style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
    >
      <div className="pj-notch absolute inset-0" style={{ background: "#3a1808", filter: "brightness(.7)" }}>
        <div
          className="pj-notch absolute flex flex-col items-center justify-center gap-3"
          style={{
            inset: 3,
            background: `repeating-linear-gradient(45deg, ${p.accent}22 0 2px, #0b0605 2px 9px)`,
          }}
        >
          <span className="pj-arcade text-[10px] text-[#ffb066]">PRATUL.DEV</span>
          <span className="pj-arcade text-[8px]" style={{ color: p.accent }}>
            {p.id}
          </span>
          <div className="flex h-6 items-end gap-[2px]">
            {[5, 12, 8, 16, 6, 14, 9, 18, 7, 12, 5, 15].map((h, i) => (
              <span key={i} className="w-[3px]" style={{ height: h, background: "#7a3a1a" }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Detail modal                                                       */
/* ------------------------------------------------------------------ */
function ProjectModal({ index, onClose, onStep }) {
  const p = PROJECTS[index];
  const Icon = ICONS[p.icon];
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const [armed, setArmed] = useState(false);
  const typed = useTypewriter(p.desc, 12);

  useEffect(() => {
    setArmed(false);
    const id = setTimeout(() => setArmed(true), 120);
    return () => clearTimeout(id);
  }, [index]);

  useEffect(() => {
    const prev = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = prevOverflow;
      prev?.focus?.();
    };
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") onStep(1);
      else if (e.key === "ArrowLeft") onStep(-1);
      else if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll("a[href],button:not([disabled])");
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onStep]);

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="pj-fade absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        key={p.id}
        className="pj-crt-on relative max-h-[92vh] w-full max-w-4xl overflow-y-auto bg-[#0b0605]"
        style={{ boxShadow: `0 0 0 2px ${p.accent}, 0 0 0 6px #0b0605, 0 0 0 8px ${p.accent}66, 0 0 70px ${p.accent}44` }}
      >
        <div className="pj-scan pointer-events-none absolute inset-0 z-10" />

        {/* title bar */}
        <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: `${p.accent}66`, background: `${p.accent}18` }}>
          <span className="pj-arcade text-[9px]" style={{ color: p.accent }}>
            {p.id.replace(" ", "_")}.EXE
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="pj-arcade flex items-center gap-2 border border-[#ff3d2e] bg-[#2a0d0a] px-2.5 py-1.5 text-[8px] text-[#ffd9c9] hover:bg-[#ff3d2e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
          >
            CLOSE [ESC] <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-6 p-5 md:grid-cols-5 md:p-7">
          <div className="space-y-6 md:col-span-3">
            <div className="flex items-start gap-4">
              <div className="pj-float flex h-14 w-14 shrink-0 items-center justify-center border-2" style={{ borderColor: p.accent, color: p.accent, background: "#150a07" }}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <h2 className="pj-arcade text-base leading-snug text-[#fff1e0] sm:text-xl">{p.title}</h2>
                <p className="pj-mono mt-2 text-sm" style={{ color: p.accent }}>
                  {p.tagline}
                </p>
              </div>
            </div>

            <div>
              <h4 className="pj-arcade mb-2.5 text-[9px] text-[#ff6a00]">WHAT IT DOES</h4>
              <p className="pj-mono min-h-[6.5rem] text-[15px] leading-relaxed text-[#ffe2c4]">
                {typed}
                <span className="pj-cursor ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-[#ffb000]" />
              </p>
            </div>

            <div>
              <h4 className="pj-arcade mb-2.5 text-[9px] text-[#ff6a00]">KEY FEATURES</h4>
              <ul className="space-y-2">
                {p.highlights.map((h, i) => (
                  <li key={h} className="pj-rise pj-mono flex gap-2.5 text-[14px] text-[#e6b793]" style={{ animationDelay: `${350 + i * 150}ms` }}>
                    <span className="mt-[7px] h-2 w-2 shrink-0" style={{ background: p.accent }} />
                    {h}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="pj-arcade mb-2.5 text-[9px] text-[#ff6a00]">TECH STACK</h4>
              <div className="flex flex-wrap gap-2">
                {p.tech.map((t, i) => (
                  <span key={t} className="pj-rise pj-mono border border-[#7a3a1a] bg-[#150a07] px-2.5 py-1 text-[13px] text-[#ffb066]" style={{ animationDelay: `${600 + i * 70}ms` }}>
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex flex-col gap-5 border border-[#3a1808] bg-[#080403] p-4 md:col-span-2">
            <h4 className="pj-arcade border-b border-[#3a1808] pb-2 text-[9px] text-[#ff6a00]">RESULTS</h4>
            {p.metrics.map((m) => (
              <div key={m.label}>
                <div className="pj-mono mb-1.5 flex justify-between text-[13px]">
                  <span className="text-[#c9906a]">{m.label}</span>
                  <span style={{ color: p.accent }}>{m.display}</span>
                </div>
                <div className="h-3 border border-[#3a1808] bg-[#150a07]">
                  <div
                    className="h-full"
                    style={{
                      width: armed ? `${m.value}%` : "0%",
                      transition: "width 1000ms steps(20, end)",
                      background: `repeating-linear-gradient(90deg, ${p.accent} 0 6px, transparent 6px 8px)`,
                    }}
                  />
                </div>
              </div>
            ))}

            <div className="mt-auto flex flex-col gap-2.5 pt-2">
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-arcade flex items-center justify-center gap-2 bg-[#ff6a00] px-3 py-3 text-[9px] text-black transition-colors hover:bg-[#ffb000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
              >
                <ExternalLink className="h-4 w-4" /> LIVE DEMO
              </a>
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-arcade flex items-center justify-center gap-2 border border-[#ff6a00] px-3 py-3 text-[9px] text-[#ffb066] transition-colors hover:bg-[#ff6a00]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
              >
                <Code2 className="h-4 w-4" /> SOURCE CODE
              </a>
              <div className="flex gap-2.5 pt-1">
                <button onClick={() => onStep(-1)} className="pj-arcade flex flex-1 items-center justify-center gap-1 border border-[#5a2410] py-2 text-[8px] text-[#c9906a] hover:border-[#ff6a00] hover:text-[#ffb066]">
                  <ChevronLeft className="h-3.5 w-3.5" /> PREV
                </button>
                <button onClick={() => onStep(1)} className="pj-arcade flex flex-1 items-center justify-center gap-1 border border-[#5a2410] py-2 text-[8px] text-[#c9906a] hover:border-[#ff6a00] hover:text-[#ffb066]">
                  NEXT <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ------------------------------------------------------------------ */
/*  Main section                                                       */
/* ------------------------------------------------------------------ */
export default function Projects3D() {
  const stageRef = useRef(null);
  const tiltRef = useRef(null);
  const ringRef = useRef(null);
  const floorSpinRef = useRef(null);
  const angleTextRef = useRef(null);
  const inners = useRef([]);
  const glows = useRef([]);
  const audio = useRef(null);

  const [dims, setDims] = useState({ cardW: 260, cardH: 370, radius: 330, h: 580 });
  const [front, setFront] = useState(0);
  const [openIdx, setOpenIdx] = useState(null);
  const [auto, setAuto] = useState(() => !reducedMotion());
  const [sound, setSound] = useState(false);

  const sim = useRef({
    angle: 0, vel: 0, target: null, dragging: false, moved: 0, startX: 0, startAngle: 0, lastX: 0, lastT: 0,
    auto: true, hover: false, modal: false, lastInteract: 0, tx: 0, ty: 0, txT: 0, tyT: 0,
    radius: 330, front: 0, visible: true, sound: false,
  });

  /* keep imperative state in sync with React state */
  useEffect(() => { sim.current.auto = auto; }, [auto]);
  useEffect(() => { sim.current.modal = openIdx !== null; }, [openIdx]);
  useEffect(() => { sim.current.sound = sound; }, [sound]);
  useEffect(() => { sim.current.radius = dims.radius; }, [dims]);

  /* responsive sizing */
  useEffect(() => {
    const el = stageRef.current;
    const calc = () => {
      const small = el.clientWidth < 640;
      const cardW = small ? 216 : 260;
      const cardH = small ? 330 : 370;
      const radius = Math.round(cardW / 2 / Math.tan(Math.PI / N)) + (small ? 50 : 80);
      setDims({ cardW, cardH, radius, h: small ? 540 : 630 });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* sound */
  const beep = useCallback((type, f1, f2, dur, vol) => {
    if (!sim.current.sound) return;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!audio.current) audio.current = new Ctx();
      const ctx = audio.current;
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(f1, t);
      o.frequency.setValueAtTime(f2, t + dur / 2);
      g.gain.setValueAtTime(vol, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
    } catch (e) { /* audio is optional */ }
  }, []);

  /* navigation */
  const poke = () => { sim.current.lastInteract = performance.now(); };
  const stepBy = useCallback((dir) => {
    const s = sim.current;
    s.vel = 0;
    s.lastInteract = performance.now();
    const cur = s.target !== null ? s.target : snap(s.angle);
    s.target = cur - dir * STEP;
    beep("sawtooth", 180, 320, 0.05, 0.03);
  }, [beep]);

  const goTo = useCallback((idx) => {
    const s = sim.current;
    s.vel = 0;
    s.lastInteract = performance.now();
    const desired = -idx * STEP;
    const k = Math.round((s.angle - desired) / 360);
    s.target = desired + k * 360;
    beep("sawtooth", 180, 320, 0.05, 0.03);
  }, [beep]);

  const onCardActivate = useCallback((idx) => {
    if (sim.current.moved > 6) return;
    if (idx === sim.current.front) {
      beep("square", 440, 880, 0.12, 0.06);
      setOpenIdx(idx);
    } else goTo(idx);
  }, [beep, goTo]);

  const closeModal = useCallback(() => { beep("triangle", 600, 300, 0.1, 0.06); setOpenIdx(null); }, [beep]);
  const stepModal = useCallback((dir) => {
    setOpenIdx((i) => {
      const n = (i + dir + N) % N;
      goTo(n);
      sim.current.front = n;
      setFront(n);
      return n;
    });
  }, [goTo]);

  /* animation loop */
  useEffect(() => {
    let raf;
    let last = performance.now();
    const s = sim.current;
    const rm = reducedMotion();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, now - last);
      last = now;
      if (!s.visible) return;

      if (!s.dragging) {
        if (s.target !== null) {
          const d = s.target - s.angle;
          s.angle += d * (1 - Math.exp(-dt / (rm ? 30 : 120)));
          if (Math.abs(d) < 0.05) { s.angle = s.target; s.target = null; }
        } else if (Math.abs(s.vel) > 0.004) {
          s.angle += s.vel * dt;
          s.vel *= Math.exp(-dt / 320);
          if (Math.abs(s.vel) <= 0.004) { s.vel = 0; s.target = snap(s.angle); }
        } else if (s.auto && !s.hover && !s.modal && !rm && !document.hidden && now - s.lastInteract > 3500) {
          s.angle -= AUTO_SPEED * dt;
        }
      }

      s.tx += (s.txT - s.tx) * 0.07;
      s.ty += (s.tyT - s.ty) * 0.07;

      if (tiltRef.current) tiltRef.current.style.transform = `rotateZ(${SLANT}deg) rotateX(${BASE_TILT + s.ty}deg) rotateY(${s.tx}deg)`;
      if (ringRef.current) ringRef.current.style.transform = `translateZ(${-s.radius}px) rotateY(${s.angle}deg)`;
      if (floorSpinRef.current) floorSpinRef.current.style.transform = `rotate(${-s.angle}deg)`;
      if (angleTextRef.current) angleTextRef.current.textContent = `${String(Math.round(((s.angle % 360) + 360) % 360)).padStart(3, "0")}°`;

      const norm = ((-s.angle % 360) + 360) % 360;
      const fi = Math.round(norm / STEP) % N;
      if (fi !== s.front) {
        s.front = fi;
        setFront(fi);
        beep("square", 520, 640, 0.04, 0.025);
      }

      for (let i = 0; i < N; i++) {
        const cos = Math.cos(((i * STEP + s.angle) * Math.PI) / 180);
        const t = (cos + 1) / 2;
        const focus = Math.pow(Math.max(cos, 0), 8);
        const el = inners.current[i];
        const gl = glows.current[i];
        if (el) {
          el.style.opacity = (0.4 + 0.6 * t).toFixed(3);
          el.style.filter = `brightness(${(0.5 + 0.5 * t).toFixed(3)})`;
          el.style.transform = `scale(${(1 + 0.05 * focus).toFixed(4)})`;
        }
        if (gl) gl.style.opacity = (focus * 0.9).toFixed(3);
      }
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; });
    io.observe(stageRef.current);

    /* drag */
    const move = (e) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.startX;
      s.moved = Math.max(s.moved, Math.abs(dx));
      s.angle = s.startAngle + dx * 0.32;
      const dtm = Math.max(1, now - s.lastT);
      const inst = ((e.clientX - s.lastX) * 0.32) / dtm;
      s.vel = Math.max(-0.8, Math.min(0.8, s.vel * 0.6 + inst * 0.4));
      s.lastX = e.clientX;
      s.lastT = now;
      s.lastInteract = now;
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      if (performance.now() - s.lastT > 90) s.vel = 0;
      if (Math.abs(s.vel) <= 0.004) { s.vel = 0; s.target = snap(s.angle); }
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [beep]);

  const onStageDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = sim.current;
    s.dragging = true;
    s.moved = 0;
    s.startX = e.clientX;
    s.lastX = e.clientX;
    s.startAngle = s.angle;
    s.lastT = performance.now();
    s.vel = 0;
    s.target = null;
    s.lastInteract = s.lastT;
  };

  const onStageMove = (e) => {
    if (e.pointerType === "touch" || sim.current.dragging) return;
    const r = e.currentTarget.getBoundingClientRect();
    sim.current.txT = ((e.clientX - r.left) / r.width - 0.5) * 10;
    sim.current.tyT = -((e.clientY - r.top) / r.height - 0.5) * 6;
  };

  const onStageKey = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
    else if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCardActivate(sim.current.front); }
  };

  const cur = PROJECTS[front];
  const { cardW, cardH, radius } = dims;
  const floorSize = radius * 2.8;
  const ringSize = radius * 2 + 40;

  return (
    <section id="projects" className="relative isolate overflow-hidden py-16 text-[#ffb066] sm:py-24">
      <style>{CSS}</style>

      {/* backdrop: glow, light beams, embers, scanlines */}
      <div
  className="pointer-events-none absolute inset-0 -z-10"
  aria-hidden="true"
  style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}
>
  <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(255,90,20,.14), transparent 70%)" }} />
  <div className="pj-beam absolute left-[12%] top-0 h-[70%] w-24 opacity-50" style={{ transform: "skewX(-24deg)" }} />
  <div className="pj-beam absolute right-[14%] top-0 h-[70%] w-24 opacity-50" style={{ transform: "skewX(24deg)" }} />
  <Embers />
</div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* heading */}
        <header className="mb-8 text-center">
          <p className="pj-mono text-sm text-[#ff6a00]">[ PROJECT ARCHIVE ]</p>
          <h2 className="pj-arcade mt-4 text-3xl text-[#fff3e6] sm:text-5xl" style={{ textShadow: "4px 4px 0 #7a2a00" }}>
            My Projects
          </h2>
          <p className="pj-mono mx-auto mt-5 max-w-xl text-base text-[#c9906a]">
            Spin the ring, pick a module and open it to see how it works and what it achieved.
          </p>
        </header>

        {/* HUD */}
        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#5a2410] bg-[#0d0605]/90 px-3 py-2.5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="pj-led inline-block h-2.5 w-2.5 shrink-0" style={{ background: cur.accent }} />
            <div className="min-w-0">
              <p className="pj-mono text-[11px] text-[#8a5a40]">FOCUSED MODULE</p>
              <p key={cur.id} className="pj-arcade pj-fade truncate text-[10px] sm:text-xs" style={{ color: cur.accent }}>
                {cur.title}
              </p>
            </div>
          </div>

          <div className="pj-mono flex items-center gap-4 text-sm text-[#c9906a]">
            <span className="hidden sm:inline">
              ANGLE <span ref={angleTextRef} className="text-[#ffb066]">000°</span>
            </span>
            <span>
              <span className="text-[#ffb066]">{String(front + 1).padStart(2, "0")}</span> / {String(N).padStart(2, "0")}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <HudBtn label="Previous project" onClick={() => stepBy(-1)}><ChevronLeft className="h-4 w-4" /></HudBtn>
            <HudBtn label="Next project" onClick={() => stepBy(1)}><ChevronRight className="h-4 w-4" /></HudBtn>
            <HudBtn label={auto ? "Pause auto-rotate" : "Start auto-rotate"} onClick={() => { poke(); setAuto((a) => !a); }}>
              {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </HudBtn>
            <HudBtn label={sound ? "Mute sound" : "Enable sound"} onClick={() => setSound((v) => !v)}>
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </HudBtn>
          </div>
        </div>

        {/* 3D stage */}
        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-label="Project carousel. Use left and right arrow keys to rotate, Enter to open."
          onPointerDown={onStageDown}
          onPointerMove={onStageMove}
          onPointerLeave={() => { sim.current.txT = 0; sim.current.tyT = 0; }}
          onKeyDown={onStageKey}
          className="relative mt-4 cursor-grab select-none overflow-hidden outline-none active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
          style={{ height: dims.h, perspective: 1500, touchAction: "pan-y" }}
        >
          <div ref={tiltRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
            {/* floor */}
            <div
              className="pointer-events-none absolute left-1/2 top-1/2"
              style={{
                width: floorSize, height: floorSize, marginLeft: -floorSize / 2, marginTop: -floorSize / 2,
                transform: `translateY(${cardH / 2 + 26}px) rotateX(90deg)`,
              }}
            >
              <div className="pj-grid absolute inset-0" />
              <div ref={floorSpinRef} className="absolute left-1/2 top-1/2" style={{ width: 0, height: 0 }}>
                <div className="pj-ticks absolute" style={{ width: ringSize, height: ringSize, left: -ringSize / 2, top: -ringSize / 2 }} />
                <div className="absolute rounded-full border border-dashed border-[#ff6a00]/60" style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }} />
                {PROJECTS.map((p, i) => (
                  <div
                    key={p.id}
                    className="absolute"
                    style={{
                      width: 14, height: 14, left: -7, top: -7,
                      transform: `rotate(${-i * STEP}deg) translateY(${radius}px)`,
                      background: i === front ? p.accent : "#3a1808",
                      boxShadow: i === front ? `0 0 14px 4px ${p.accent}` : "none",
                      transition: "background .2s, box-shadow .2s",
                    }}
                  />
                ))}
              </div>
            </div>

            {/* card ring */}
            <div ref={ringRef} className="absolute left-1/2 top-1/2" style={{ width: 0, height: 0, transformStyle: "preserve-3d" }}>
              {PROJECTS.map((p, i) => (
                <div
                  key={p.id}
                  className="absolute"
                  style={{
                    left: 0, top: 0, width: cardW, height: cardH, marginLeft: -cardW / 2, marginTop: -cardH / 2,
                    transformStyle: "preserve-3d",
                    transform: `rotateY(${i * STEP}deg) translateZ(${radius}px)`,
                  }}
                >
                  <CardFront
                    p={p}
                    idx={i}
                    isFront={i === front}
                    innerRef={(el) => (inners.current[i] = el)}
                    glowRef={(el) => (glows.current[i] = el)}
                    onActivate={onCardActivate}
                    onHover={(v) => { sim.current.hover = v; }}
                  />
                  <CardBack p={p} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* pagination + hint */}
        <div className="mt-5 flex flex-col items-center gap-4">
          <div className="flex gap-2" role="tablist" aria-label="Select project">
            {PROJECTS.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                aria-selected={i === front}
                aria-label={p.title}
                onClick={() => goTo(i)}
                className="h-3 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
                style={{ width: i === front ? 34 : 14, background: i === front ? p.accent : "#3a1808" }}
              />
            ))}
          </div>
          <p className="pj-mono text-center text-sm text-[#8a5a40]">
            Drag or swipe to rotate · Click the front card to open it · Use{" "}
            <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">←</kbd> <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">→</kbd> to navigate
          </p>
        </div>
      </div>

      {openIdx !== null && <ProjectModal index={openIdx} onClose={closeModal} onStep={stepModal} />}
    </section>
  );
}

function HudBtn({ label, onClick, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center border border-[#5a2410] bg-[#150a07] text-[#ffb066] transition-colors hover:border-[#ff6a00] hover:bg-[#ff6a00]/15 active:translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
    >
      {children}
    </button>
  );
}