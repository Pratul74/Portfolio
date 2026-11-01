import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Activity,
  ChevronLeft,
  ChevronRight,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Layers,
  LayoutGrid,
  RotateCw,
  Server,
  Shuffle,
  Spade,
  Terminal,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";

const ICONS = { zap: Zap, cpu: Cpu, server: Server, terminal: Terminal, activity: Activity, database: Database };

const RARITY = {
  COMMON: { label: "COMMON", color: "#c9906a", foil: 0.3, pips: 1 },
  RARE: { label: "RARE", color: "#ffb000", foil: 0.45, pips: 2 },
  EPIC: { label: "EPIC", color: "#ff6a00", foil: 0.6, pips: 3 },
  LEGENDARY: { label: "LEGENDARY", color: "#ff3d2e", foil: 0.8, pips: 4 },
};

const PROJECTS = [
  {
    id: "MOD 01",
    title: "EDGE GATEWAY",
    tagline: "API gateway that routes 100K+ requests a minute",
    icon: "zap",
    accent: "#ff6a00",
    status: "LIVE",
    power: 96,
    rarity: "LEGENDARY",
    type: "API GATEWAY",
    cost: 4,
    version: "3.2",
    year: "2025",
    role: "Backend engineer",
    flavor: "Every request passes through here. Nothing slows it down.",
    ability: { name: "TOKEN BUCKET", text: "Throttles abusive clients without slowing everyone else." },
    atk: { label: "THROUGHPUT", value: "100K/MIN" },
    def: { label: "UPTIME", value: "99.98%" },
    problem: "Internal services were exposed to traffic spikes, and every team had built its own auth and rate limits.",
    pipeline: ["CLIENT", "AUTH", "RATE LIMIT", "ROUTER", "SERVICE"],
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
    rarity: "EPIC",
    type: "LLM SERVICE",
    cost: 5,
    version: "2.1",
    year: "2025",
    role: "Backend engineer",
    flavor: "Ask once. Answer instantly the second time.",
    ability: { name: "SEMANTIC CACHE", text: "Reuses answers for prompts that mean the same thing." },
    atk: { label: "FASTER REPLIES", value: "60%" },
    def: { label: "CACHE HITS", value: "82%" },
    problem: "AI replies felt slow and model providers sometimes stalled, which made the product feel unreliable.",
    pipeline: ["PROMPT", "CACHE", "PROVIDER", "STREAM", "USER"],
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
    rarity: "RARE",
    type: "TASK QUEUE",
    cost: 3,
    version: "1.8",
    year: "2024",
    role: "Backend engineer",
    flavor: "Slow work never blocks fast work.",
    ability: { name: "PRIORITY LANES", text: "Urgent jobs jump ahead of bulk work, every time." },
    atk: { label: "JOBS / DAY", value: "4.2M" },
    def: { label: "RETRY SUCCESS", value: "97%" },
    problem: "Long background jobs blocked urgent ones, and failed jobs left no trail to debug.",
    pipeline: ["API", "BROKER", "WORKER", "RETRY", "AUDIT LOG"],
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
    rarity: "EPIC",
    type: "SAAS BACKEND",
    cost: 5,
    version: "2.0",
    year: "2024",
    role: "Backend engineer",
    flavor: "One codebase. A thousand customers. Zero data leaks.",
    ability: { name: "ROW-LEVEL WALLS", text: "Tenant data stays isolated at the database level." },
    atk: { label: "TENANTS", value: "1,200+" },
    def: { label: "BILLING ACCURACY", value: "100%" },
    problem: "Each new SaaS product rebuilt tenancy, roles and billing from scratch, and bugs crept in every time.",
    pipeline: ["REQUEST", "TENANT", "ROLES", "METERING", "INVOICE"],
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
    rarity: "RARE",
    type: "DATA PIPELINE",
    cost: 4,
    version: "1.5",
    year: "2024",
    role: "Data / backend engineer",
    flavor: "Dashboards that show now, not yesterday.",
    ability: { name: "SCHEMA SHIELD", text: "Rejects malformed events before they spread downstream." },
    atk: { label: "EVENTS / SEC", value: "25K" },
    def: { label: "DATA LOSS", value: "ZERO" },
    problem: "Analytics dashboards ran a day behind, and one bad event could corrupt a whole batch.",
    pipeline: ["EVENT", "KAFKA", "ENRICH", "VALIDATE", "WAREHOUSE"],
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
    rarity: "RARE",
    type: "RAG ENGINE",
    cost: 4,
    version: "0.9",
    year: "2025",
    role: "Backend / AI engineer",
    flavor: "Answers with receipts.",
    ability: { name: "CITE SOURCES", text: "Every answer comes back with the documents behind it." },
    atk: { label: "RECALL@10", value: "93%" },
    def: { label: "QUERY TIME", value: "120MS" },
    problem: "Chatbots answered confidently from memory and could not show where an answer came from.",
    pipeline: ["DOCS", "CHUNK", "EMBED", "RE-RANK", "ANSWER"],
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
const EDGE_FADE = "linear-gradient(to bottom, transparent, #000 18%, #000 82%, transparent)";
const MODES = [
  { k: "stack", label: "STACK", Icon: Layers },
  { k: "fan", label: "FAN", Icon: Spade },
  { k: "grid", label: "GRID", Icon: LayoutGrid },
  { k: "ring", label: "RING", Icon: RotateCw },
];
const HINTS = {
  stack: "Click the top card to fan the hand · Click a card behind it to draw it · Swipe or use ← → to flip through",
  fan: "Hover to lift a card · Click to inspect · Swipe or use ← → to reshuffle",
  grid: "All six cards dealt · Hover to lift · Click to inspect",
  ring: "Drag or swipe to spin · Click the front card to open it · Use ← →",
};
const noop = () => {};
const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const frontPos = (angle) => (((Math.round(-angle / STEP) % N) + N) % N);

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
.pj-flipin{animation:pjFlip .9s cubic-bezier(.2,.8,.2,1) both}
.pj-prism{background-size:300% 300%!important;animation:pjPrism 5s linear infinite}
.pj-foil{background-size:260% 260%;background-position:var(--mx,50%) var(--my,50%);mix-blend-mode:screen;transition:opacity .25s}
.pj-spark{position:absolute;width:3px;height:3px;background:#ffe2b8;box-shadow:0 0 6px #ffb000;animation:pjSpark 2.4s ease-in-out infinite}
.pj-node{animation:pjNode 5s ease-in-out infinite}
.pj-log{animation:pjRise .35s ease-out both}
@keyframes pjGrid{to{background-position:0 46px}}
@keyframes pjSweep{0%{transform:translateY(-100%)}100%{transform:translateY(100%)}}
@keyframes pjBlink{50%{opacity:.15}}
@keyframes pjWin{50%{opacity:.25}}
@keyframes pjFade{from{opacity:0}to{opacity:1}}
@keyframes pjRise{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes pjFloat{50%{transform:translateY(-7px)}}
@keyframes pjFlip{from{transform:rotateY(180deg) scale(.7)}to{transform:none}}
@keyframes pjPrism{0%{background-position:0% 50%}100%{background-position:300% 50%}}
@keyframes pjSpark{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1.6);opacity:1}}
@keyframes pjNode{0%,34%,100%{border-color:#5a2410;color:#ffb066;box-shadow:none}10%,22%{border-color:var(--c);color:#fff1e0;box-shadow:0 0 14px var(--c)}}
@keyframes pjCrtOn{0%{transform:scale(1,.004);filter:brightness(4);opacity:.6}55%{transform:scale(1,.04);filter:brightness(3)}100%{transform:none;filter:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.pj-grid,.pj-sweep,.pj-led,.pj-cursor,.pj-win,.pj-crt-on,.pj-fade,.pj-rise,.pj-float,.pj-flipin,.pj-prism,.pj-spark,.pj-node,.pj-log{animation:none!important}}
`;


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

function Embers() {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c || reducedMotion()) return undefined;
    const ctx = c.getContext("2d");
    let raf;
    let visible = true;
    let parts = [];
    const spawn = (anywhere) => ({
      x: Math.random() * c.width,
      y: anywhere ? Math.random() * c.height : c.height + 6,
      s: Math.random() > 0.8 ? 4 : 2,
      v: 0.15 + Math.random() * 0.5,
      drift: (Math.random() - 0.5) * 0.25,
      ph: Math.random() * 6.28,
      col: Math.random() > 0.5 ? "255,106,0" : Math.random() > 0.5 ? "255,176,0" : "255,61,46",
    });
    const resize = () => {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      parts = Array.from({ length: Math.round(c.width / 28) }, () => spawn(true));
    };
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

function Pips({ count, color }) {
  return (
    <span className="flex gap-[3px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="h-[6px] w-[6px]" style={{ background: i < count ? color : "#2a1209" }} />
      ))}
    </span>
  );
}

const TCGCard = memo(function TCGCard({
  p, idx, t, o, w, h, placed = true, slow, delay = 0, hot, tiltable, floating, compact, isTop, onActivate, onHover,
}) {
  const tilt = useRef(null);
  const r = RARITY[p.rarity];
  const Icon = ICONS[p.icon];
  const sparks = useMemo(() => {
    if (p.rarity !== "LEGENDARY" && p.rarity !== "EPIC") return [];
    const g = rng(idx * 131 + 7);
    return Array.from({ length: p.rarity === "LEGENDARY" ? 9 : 5 }, () => ({
      x: 6 + g() * 88, y: 6 + g() * 88, d: g() * 2.4,
    }));
  }, [idx, p.rarity]);

  const onMove = (e) => {
    if (e.pointerType === "touch" || !tiltable || !tilt.current) return;
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width;
    const y = (e.clientY - b.top) / b.height;
    const el = tilt.current;
    el.style.transform = `rotateX(${((0.5 - y) * 18).toFixed(2)}deg) rotateY(${((x - 0.5) * 18).toFixed(2)}deg) translateZ(22px)`;
    el.style.setProperty("--mx", `${(x * 100).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (tilt.current) tilt.current.style.transform = "rotateX(0deg) rotateY(0deg)";
    onHover(null);
  };

  const wrapStyle = placed
    ? {
        position: "absolute", left: 0, top: 0, width: w, height: h, marginLeft: -w / 2,
        transform: t, transformStyle: "preserve-3d",
        transition: hot
          ? "transform .28s ease-out"
          : slow
            ? `transform .85s cubic-bezier(.2,.8,.2,1) ${delay}ms`
            : "transform .6s cubic-bezier(.2,.8,.2,1)",
        pointerEvents: o === 0 ? "none" : "auto",
        cursor: "pointer",
      }
    : { position: "relative", width: w, height: h, transformStyle: "preserve-3d", cursor: "pointer" };

  const face = { backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", opacity: o, transition: "opacity .5s" };
  const border =
    p.rarity === "LEGENDARY"
      ? "linear-gradient(120deg,#ff3d2e,#ffb000,#ff6a00,#ffd166,#ff3d2e)"
      : `linear-gradient(160deg, ${p.accent}, #5a2410 55%, ${p.accent})`;

  return (
    <div
      className="group"
      style={wrapStyle}
      role="button"
      aria-label={`${p.title}, ${r.label} card`}
      onPointerMove={onMove}
      onPointerEnter={() => onHover(idx)}
      onPointerLeave={onLeave}
      onClick={() => onActivate(idx)}
    >
      <div className={floating ? "pj-float" : undefined} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d" }}>
        <div ref={tilt} style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transition: "transform .15s ease-out" }}>

          <div className="absolute inset-0" style={face}>
            <div
              className={`pointer-events-none absolute -inset-4 transition-opacity duration-300 group-hover:opacity-90 ${isTop ? "opacity-40" : "opacity-0"}`}
              style={{ background: `radial-gradient(closest-side, ${p.accent}88, transparent 78%)`, filter: "blur(16px)" }}
            />
            <div className={`pj-notch absolute inset-0 ${p.rarity === "LEGENDARY" ? "pj-prism" : ""}`} style={{ background: border }}>
              <div className="pj-notch absolute flex flex-col gap-2 p-3" style={{ inset: 3, background: "#0b0605" }}>

                <div className="flex items-center justify-between">
                  <span className="pj-arcade text-[8px]" style={{ color: p.accent }}>
                    {String(idx + 1).padStart(3, "0")}/{String(N).padStart(3, "0")}
                  </span>
                  <span className="pj-mono flex items-center gap-1 border border-[#5a2410] bg-[#150a07] px-1.5 py-0.5 text-[11px] text-[#ffcfa3]">
                    <Zap className="h-3 w-3" style={{ color: p.accent }} /> COST {p.cost}
                  </span>
                </div>

                <div className="relative shrink-0 overflow-hidden border border-[#3a1808]" style={{ height: compact ? 84 : 108 }}>
                  <Skyline seed={idx + 3} accent={p.accent} />
                  <div className="pj-sweep absolute inset-x-0 top-0 h-1/2" />
                  <div className="pj-scan absolute inset-0" />
                  <div
                    className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center border-2 bg-[#0b0605]/80"
                    style={{ borderColor: p.accent, color: p.accent }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="pj-mono absolute right-2 top-2 flex items-center gap-1.5 bg-[#0b0605]/80 px-1.5 py-0.5 text-[10px] text-[#ffcfa3]">
                    <span className="pj-led inline-block h-1.5 w-1.5" style={{ background: p.status === "BETA" ? "#ffd166" : "#3dff8b" }} />
                    {p.status}
                  </span>
                  <span className="pj-mono absolute bottom-1.5 left-2 text-[10px] text-[#ffb066]">
                    TYPE: {p.type} · V{p.version}
                  </span>
                </div>

                <div>
                  <h3 className="pj-arcade text-[10px] leading-[1.6] text-[#fff1e0]">{p.title}</h3>
                  <p className={`pj-mono mt-1 text-[12px] leading-snug text-[#c9906a] ${compact ? "line-clamp-1" : "line-clamp-2"}`}>{p.tagline}</p>
                </div>

                <div className="border border-[#3a1808] bg-[#100806] px-2 py-1.5">
                  <p className="pj-arcade text-[7px]" style={{ color: p.accent }}>
                    ◆ {p.ability.name}
                  </p>
                  {!compact && <p className="pj-mono mt-1 line-clamp-2 text-[11px] leading-snug text-[#e6b793]">{p.ability.text}</p>}
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2">
                  {[["ATK", p.atk], ["DEF", p.def]].map(([k, s]) => (
                    <div key={k} className="border border-[#3a1808] bg-[#100806] p-1.5 text-center">
                      <span className="pj-mono block truncate text-[9px] text-[#8a5a40]">
                        {k} / {s.label}
                      </span>
                      <span className="pj-arcade mt-1 block text-[9px]" style={{ color: p.accent }}>
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Pips count={r.pips} color={r.color} />
                    <span className="pj-arcade text-[6px]" style={{ color: r.color }}>
                      {r.label}
                    </span>
                  </span>
                  <span className="pj-mono text-[9px] text-[#6b3a22]">PRATUL_STUDIOS · 2026.1</span>
                </div>
              </div>

              <div
                className="pj-foil pointer-events-none absolute inset-0"
                style={{
                  opacity: r.foil * (tiltable ? 1 : 0.35),
                  background: `linear-gradient(115deg, transparent 20%, ${p.accent}55 40%, rgba(255,225,190,.5) 48%, ${p.accent}44 55%, transparent 75%)`,
                }}
              />
              {sparks.map((s, i) => (
                <span key={i} className="pj-spark" style={{ left: `${s.x}%`, top: `${s.y}%`, animationDelay: `${s.d}s` }} />
              ))}
            </div>
          </div>

          <div className="absolute inset-0" style={{ ...face, transform: "rotateY(180deg)" }}>
            <div className="pj-notch absolute inset-0" style={{ background: "#3a1808", filter: "brightness(.75)" }}>
              <div
                className="pj-notch absolute flex flex-col items-center justify-center gap-3"
                style={{ inset: 3, background: `repeating-linear-gradient(45deg, ${p.accent}22 0 2px, #0b0605 2px 9px)` }}
              >
                <span className="pj-arcade text-[10px] text-[#ffb066]">PRATUL.DEV</span>
                <div className="flex h-10 w-10 items-center justify-center border-2 bg-[#0b0605]" style={{ borderColor: p.accent, color: p.accent }}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="pj-arcade text-[8px]" style={{ color: p.accent }}>
                  {p.id}
                </span>
                <div className="flex h-6 items-end gap-[2px]">
                  {[5, 12, 8, 16, 6, 14, 9, 18, 7, 12, 5, 15].map((bar, i) => (
                    <span key={i} className="w-[3px]" style={{ height: bar, background: "#7a3a1a" }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
function ProjectModal({ index, onClose, onStep }) {
  const p = PROJECTS[index];
  const r = RARITY[p.rarity];
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

  const meta = [["ROLE", p.role], ["YEAR", p.year], ["TYPE", p.type], ["VERSION", `v${p.version}`], ["STATUS", p.status], ["RARITY", r.label]];

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6" role="dialog" aria-modal="true" aria-label={p.title}>
      <div className="pj-fade absolute inset-0 bg-black/85 backdrop-blur-sm" onClick={onClose} />
      <div
        ref={panelRef}
        key={p.id}
        className="pj-crt-on relative max-h-[92vh] w-full max-w-5xl overflow-y-auto bg-[#0b0605]"
        style={{ boxShadow: `0 0 0 2px ${p.accent}, 0 0 0 6px #0b0605, 0 0 0 8px ${p.accent}66, 0 0 70px ${p.accent}44` }}
      >
        <div className="pj-scan pointer-events-none absolute inset-0 z-10" />

        <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: `${p.accent}66`, background: `${p.accent}18` }}>
          <span className="pj-arcade text-[9px]" style={{ color: p.accent }}>
            CARD_INSPECTOR // {p.id.replace(" ", "_")}.EXE
          </span>
          <button
            ref={closeRef}
            onClick={onClose}
            className="pj-arcade flex items-center gap-2 border border-[#ff3d2e] bg-[#2a0d0a] px-2.5 py-1.5 text-[8px] text-[#ffd9c9] hover:bg-[#ff3d2e] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
          >
            CLOSE [ESC] <X className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-7 p-5 md:grid-cols-[260px_1fr] md:p-7">

          <div className="flex flex-col items-center gap-5">
            <div key={`card-${p.id}`} className="pj-flipin" style={{ perspective: 1200, transformStyle: "preserve-3d" }}>
              <TCGCard p={p} idx={index} t="none" o={1} w={250} h={375} placed={false} tiltable isTop onActivate={noop} onHover={noop} />
            </div>
            <dl className="w-full border border-[#3a1808] bg-[#080403] p-3">
              {meta.map(([k, v]) => (
                <div key={k} className="pj-mono flex justify-between gap-3 border-b border-[#1d0d07] py-1.5 text-[13px] last:border-0">
                  <dt className="text-[#8a5a40]">{k}</dt>
                  <dd className="text-right text-[#ffcfa3]">{v}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="pj-arcade text-base leading-snug text-[#fff1e0] sm:text-xl">{p.title}</h2>
              <p className="pj-mono mt-2 text-sm" style={{ color: p.accent }}>
                {p.tagline}
              </p>
              <p className="pj-mono mt-2 text-[13px] italic text-[#8a5a40]">“{p.flavor}”</p>
            </div>

            <div>
              <h4 className="pj-arcade mb-2.5 text-[9px] text-[#ff6a00]">THE PROBLEM</h4>
              <p className="pj-mono text-[14px] leading-relaxed text-[#e6b793]">{p.problem}</p>
            </div>

            <div>
              <h4 className="pj-arcade mb-2.5 text-[9px] text-[#ff6a00]">WHAT IT DOES</h4>
              <p className="pj-mono min-h-[5.5rem] text-[15px] leading-relaxed text-[#ffe2c4]">
                {typed}
                <span className="pj-cursor ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px] bg-[#ffb000]" />
              </p>
            </div>

            <div>
              <h4 className="pj-arcade mb-3 text-[9px] text-[#ff6a00]">HOW IT FLOWS</h4>
              <div className="flex flex-wrap items-center gap-y-2">
                {p.pipeline.map((n, i) => (
                  <Fragment key={n}>
                    <span
                      className="pj-node pj-mono border border-[#5a2410] bg-[#150a07] px-2.5 py-1 text-[12px] text-[#ffb066]"
                      style={{ "--c": p.accent, animationDelay: `${i * 0.8}s` }}
                    >
                      {n}
                    </span>
                    {i < p.pipeline.length - 1 && <span className="pj-mono px-1.5 text-[#7a3a1a]">▸</span>}
                  </Fragment>
                ))}
              </div>
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

            <div className="border border-[#3a1808] bg-[#080403] p-4">
              <h4 className="pj-arcade border-b border-[#3a1808] pb-2 text-[9px] text-[#ff6a00]">RESULTS</h4>
              <div className="mt-4 space-y-4">
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
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-arcade flex flex-1 items-center justify-center gap-2 bg-[#ff6a00] px-3 py-3 text-[9px] text-black transition-colors hover:bg-[#ffb000] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
              >
                <ExternalLink className="h-4 w-4" /> LIVE DEMO
              </a>
              <a
                href={p.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="pj-arcade flex flex-1 items-center justify-center gap-2 border border-[#ff6a00] px-3 py-3 text-[9px] text-[#ffb066] transition-colors hover:bg-[#ff6a00]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000]"
              >
                <Code2 className="h-4 w-4" /> SOURCE CODE
              </a>
              <button onClick={() => onStep(-1)} className="pj-arcade flex items-center justify-center gap-1 border border-[#5a2410] px-4 py-3 text-[8px] text-[#c9906a] hover:border-[#ff6a00] hover:text-[#ffb066]">
                <ChevronLeft className="h-3.5 w-3.5" /> PREV
              </button>
              <button onClick={() => onStep(1)} className="pj-arcade flex items-center justify-center gap-1 border border-[#5a2410] px-4 py-3 text-[8px] text-[#c9906a] hover:border-[#ff6a00] hover:text-[#ffb066]">
                NEXT <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default function ProjectsDeck() {
  const stageRef = useRef(null);
  const tableRef = useRef(null);
  const audio = useRef(null);
  const t0 = useRef(0);
  const logId = useRef(0);
  const busy = useRef(false);
  const dealT = useRef(null);
  const dealtOnce = useRef(false);
  const drag = useRef({ down: false, x: 0, start: 0, moved: 0 });

  const [mode, setMode] = useState("stack");
  const [order, setOrder] = useState(() => PROJECTS.map((_, i) => i));
  const [dealt, setDealt] = useState(false);
  const [dealing, setDealing] = useState(true);
  const [hoverId, setHoverId] = useState(null);
  const [flyId, setFlyId] = useState(null);
  const [ringAngle, setRingAngle] = useState(0);
  const [ringAnim, setRingAnim] = useState(true);
  const [openIdx, setOpenIdx] = useState(null);
  const [sound, setSound] = useState(false);
  const [logs, setLogs] = useState([]);
  const [dims, setDims] = useState({ w: 1000, cardW: 270, cardH: 405, small: false });

  const live = useRef({});
  live.current = { mode, order, ringAngle, sound };

  const beep = useCallback((type, f1, f2, dur, vol) => {
    if (!live.current.sound) return;
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
    } catch (e) { }
  }, []);

  const log = useCallback((msg) => {
    const s = Math.floor((performance.now() - t0.current) / 1000);
    const ts = `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    logId.current += 1;
    const id = logId.current;
    setLogs((l) => [...l.slice(-3), { id, ts, msg }]);
  }, []);

  const stepRing = useCallback((dir) => {
    setRingAnim(true);
    setRingAngle((a) => Math.round(a / STEP) * STEP - dir * STEP);
    beep("sawtooth", 180, 320, 0.05, 0.03);
  }, [beep]);

  const goRing = useCallback((pos) => {
    setRingAnim(true);
    setRingAngle((a) => {
      const d = -pos * STEP;
      return d + Math.round((a - d) / 360) * 360;
    });
    beep("sawtooth", 180, 320, 0.05, 0.03);
  }, [beep]);

  const openCard = useCallback((id) => {
    beep("square", 440, 880, 0.12, 0.06);
    setOpenIdx(id);
    log(`Inspecting ${PROJECTS[id].id} // ${PROJECTS[id].title}`);
  }, [beep, log]);

  const changeMode = useCallback((m) => {
    const L = live.current;
    if (m === L.mode) return;
    setDealing(true);
    clearTimeout(dealT.current);
    dealT.current = setTimeout(() => setDealing(false), 900);
    if (L.mode === "ring") {
      const f = frontPos(L.ringAngle);
      setOrder((o) => o.slice(f).concat(o.slice(0, f)));
    }
    setRingAnim(true);
    setRingAngle(0);
    setHoverId(null);
    setMode(m);
    beep("triangle", 520, 700, 0.1, 0.05);
    log(`Layout switched to ${m.toUpperCase()}.`);
  }, [beep, log]);

  const cycle = useCallback((dir) => {
    const L = live.current;
    if (L.mode === "ring") {
      stepRing(dir);
      return;
    }
    if (busy.current) return;
    busy.current = true;
    const done = () => {
      setOrder((o) => (dir > 0 ? [...o.slice(1), o[0]] : [o[o.length - 1], ...o.slice(0, -1)]));
      setFlyId(null);
      busy.current = false;
    };
    if (L.mode === "stack" && dir > 0) {
      setFlyId(L.order[0]);
      setTimeout(done, 320);
    } else done();
    beep("sawtooth", 200, 380, 0.07, 0.04);
    log(dir > 0 ? `Card ${PROJECTS[L.order[0]].id} sent to the back.` : "Drew the last card to the top.");
  }, [beep, log, stepRing]);

  const focusCard = useCallback((id) => {
    const L = live.current;
    if (L.mode === "stack") setOrder((o) => [id, ...o.filter((x) => x !== id)]);
    else if (L.mode === "ring") goRing(L.order.indexOf(id));
  }, [goRing]);

  const activate = useCallback((id) => {
    const L = live.current;
    if (drag.current.moved > 6) return;
    if (L.mode === "stack") {
      if (L.order[0] === id) changeMode("fan");
      else {
        setOrder((o) => [id, ...o.filter((x) => x !== id)]);
        beep("sine", 750, 800, 0.1, 0.05);
        log(`Drew ${PROJECTS[id].id} to the top of the deck.`);
      }
    } else if (L.mode === "ring") {
      const pos = L.order.indexOf(id);
      if (pos === frontPos(L.ringAngle)) openCard(id);
      else goRing(pos);
    } else openCard(id);
  }, [beep, changeMode, goRing, log, openCard]);

  const closeModal = useCallback(() => {
    beep("triangle", 600, 300, 0.1, 0.06);
    setOpenIdx(null);
  }, [beep]);

  const stepModal = useCallback((dir) => {
    setOpenIdx((i) => {
      const n = (i + dir + N) % N;
      focusCard(n);
      return n;
    });
  }, [focusCard]);

  useEffect(() => {
    t0.current = performance.now();
    log("Deck loaded. 6 cards in hand.");
    const el = stageRef.current;
    const calc = () => {
      const w = el.clientWidth;
      const small = w < 640;
      setDims({ w, small, cardW: small ? 220 : 270, cardH: small ? 335 : 405 });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [log]);

  useEffect(() => {
    const el = stageRef.current;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !dealtOnce.current) {
          dealtOnce.current = true;
          setDealt(true);
          log("Shuffling... dealing cards.");
          beep("square", 330, 660, 0.15, 0.05);
          clearTimeout(dealT.current);
          dealT.current = setTimeout(() => setDealing(false), 1300);
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(dealT.current);
    };
  }, [beep, log]);

  useEffect(() => {
    if (tableRef.current) tableRef.current.style.transform = `rotateX(${mode === "grid" ? 2 : 7}deg)`;
  }, [mode]);

  useEffect(() => {
    const move = (e) => {
      const d = drag.current;
      if (!d.down) return;
      const dx = e.clientX - d.x;
      d.moved = Math.max(d.moved, Math.abs(dx));
      if (live.current.mode === "ring" && d.moved > 3) {
        setRingAnim(false);
        setRingAngle(d.start + dx * 0.3);
      }
    };
    const up = (e) => {
      const d = drag.current;
      if (!d.down) return;
      d.down = false;
      const dx = e.clientX - d.x;
      if (live.current.mode === "ring") {
        if (d.moved > 3) {
          setRingAnim(true);
          setRingAngle((a) => Math.round(a / STEP) * STEP);
        }
      } else if (Math.abs(dx) > 70) cycle(dx < 0 ? 1 : -1);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [cycle]);

  const onStageDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    drag.current = { down: true, x: e.clientX, start: live.current.ringAngle, moved: 0 };
  };

  const onStageMove = (e) => {
    if (e.pointerType === "touch" || drag.current.down || !tableRef.current) return;
    const b = e.currentTarget.getBoundingClientRect();
    const tx = ((e.clientX - b.left) / b.width - 0.5) * 8;
    const ty = -((e.clientY - b.top) / b.height - 0.5) * 4;
    const base = live.current.mode === "grid" ? 2 : 7;
    tableRef.current.style.transform = `rotateX(${base + ty}deg) rotateY(${tx}deg)`;
  };

  const onStageLeave = () => {
    if (tableRef.current) tableRef.current.style.transform = `rotateX(${live.current.mode === "grid" ? 2 : 7}deg)`;
  };

  const focusId = mode === "ring" ? order[frontPos(ringAngle)] : hoverId !== null ? hoverId : order[0];

  const onStageKey = (e) => {
    const L = live.current;
    if (e.key === "ArrowRight") { e.preventDefault(); cycle(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); cycle(-1); }
    else if (e.key === "Enter") { e.preventDefault(); openCard(focusId); }
    else if (e.key >= "1" && e.key <= "4") changeMode(MODES[Number(e.key) - 1].k);
    else if (e.key === " ") {
      e.preventDefault();
      const i = MODES.findIndex((m) => m.k === L.mode);
      changeMode(MODES[(i + 1) % MODES.length].k);
    }
  };

  const { w, cardW, cardH, small } = dims;
  const gap = small ? 18 : 26;
  const cols = w >= cardW * 3 + gap * 2 + 40 ? 3 : w >= cardW * 2 + gap + 40 ? 2 : 1;
  const rows = Math.ceil(N / cols);
  const stageH = mode === "grid" ? rows * (cardH + gap) + 30 : mode === "ring" ? cardH + 210 : cardH + 170;
  const baseY = (stageH - cardH) / 2;
  const radius = Math.round(cardW / 2 / Math.tan(Math.PI / N)) + (small ? 40 : 70);
  const spread = Math.max(24, Math.min(small ? 46 : 80, (w - cardW - 24) / (N - 1)));
  const floorSize = Math.max(radius * 2.8, 900);
  const ringFront = frontPos(ringAngle);

  const place = (pos, id) => {
    if (!dealt) return { t: `translate3d(0px, ${baseY + 40}px, -260px) rotateZ(-12deg) scale(.5)`, o: 0 };
    if (flyId === id) return { t: `translate3d(${cardW * 1.2}px, ${baseY - 60}px, 160px) rotateZ(20deg) scale(1.05)`, o: 0 };
    const hot = hoverId === id;
    if (mode === "stack") {
      const rot = (pos % 2 ? -1 : 1) * pos * 2.2;
      return { t: `translate3d(0px, ${baseY - 35 + pos * 14}px, ${-pos * 22}px) rotateZ(${rot}deg) scale(${1 - pos * 0.025})`, o: pos > 3 ? 0.5 : 1 };
    }
    if (mode === "fan") {
      const off = pos - (N - 1) / 2;
      const ang = (small ? 6 : 8.5) * off;
      const y = baseY + off * off * 7;
      return hot
        ? { t: `translate3d(${off * spread}px, ${y - 46}px, 90px) rotateZ(${ang * 0.35}deg) scale(1.07)`, o: 1 }
        : { t: `translate3d(${off * spread}px, ${y}px, ${pos * 3}px) rotateZ(${ang}deg)`, o: 1 };
    }
    if (mode === "grid") {
      const row = Math.floor(pos / cols);
      const col = pos % cols;
      const inRow = Math.min(cols, N - row * cols);
      const x = (col - (inRow - 1) / 2) * (cardW + gap);
      const y = 24 + row * (cardH + gap);
      return { t: `translate3d(${x}px, ${y}px, ${hot ? 50 : 0}px) scale(${hot ? 1.03 : 1})`, o: 1 };
    }
    return { t: `translate3d(0px, ${baseY}px, 0px) rotateY(${pos * STEP}deg) translateZ(${radius + (hot ? 28 : 0)}px)`, o: 1 };
  };

  const focus = PROJECTS[focusId];
  const fr = RARITY[focus.rarity];
  const counts = PROJECTS.reduce((a, p) => ({ ...a, [p.rarity]: (a[p.rarity] || 0) + 1 }), {});
  const avg = Math.round(PROJECTS.reduce((s, p) => s + p.power, 0) / N);

  return (
    <section id="projects" className="relative isolate overflow-hidden py-16 text-[#ffb066] sm:py-24">
      <style>{CSS}</style>

      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true" style={{ WebkitMaskImage: EDGE_FADE, maskImage: EDGE_FADE }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 55%, rgba(255,90,20,.14), transparent 70%)" }} />
        <div className="pj-beam absolute left-[12%] top-0 h-[70%] w-24 opacity-50" style={{ transform: "skewX(-24deg)" }} />
        <div className="pj-beam absolute right-[14%] top-0 h-[70%] w-24 opacity-50" style={{ transform: "skewX(24deg)" }} />
        <Embers />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-8 text-center">
          <p className="pj-mono text-sm text-[#ff6a00]">[ COLLECTIBLE DECK // {String(N).padStart(2, "0")} CARDS ]</p>
          <h2 className="pj-arcade mt-4 text-3xl text-[#fff3e6] sm:text-5xl" style={{ textShadow: "4px 4px 0 #7a2a00" }}>
            DEVELOPMENT LOG
          </h2>
          <p className="pj-mono mx-auto mt-5 max-w-xl text-base text-[#c9906a]">
            Six production systems, printed as collectible cards. Stack them, fan them, deal them out or spin the ring, then open any card for the full spec.
          </p>
        </header>

        <div className="flex flex-wrap items-center justify-between gap-3 border border-[#5a2410] bg-[#0d0605]/90 px-3 py-2.5 backdrop-blur">
          <div className="flex min-w-0 items-center gap-3">
            <span className="pj-led inline-block h-2.5 w-2.5 shrink-0" style={{ background: focus.accent }} />
            <div className="min-w-0">
              <p className="pj-mono text-[11px] text-[#8a5a40]">
                ON TABLE · <span style={{ color: fr.color }}>{fr.label}</span>
              </p>
              <p key={focus.id} className="pj-arcade pj-fade truncate text-[10px] sm:text-xs" style={{ color: focus.accent }}>
                {focus.title}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Deck layout">
            {MODES.map(({ k, label, Icon }, i) => (
              <button
                key={k}
                type="button"
                aria-pressed={mode === k}
                title={`${label} layout [${i + 1}]`}
                onClick={() => changeMode(k)}
                className={`pj-arcade flex items-center gap-1.5 border px-2.5 py-2 text-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] ${
                  mode === k ? "border-[#ff6a00] bg-[#ff6a00] text-black" : "border-[#5a2410] bg-[#150a07] text-[#ffb066] hover:border-[#ff6a00]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <HudBtn label="Previous card" onClick={() => cycle(-1)}><ChevronLeft className="h-4 w-4" /></HudBtn>
            <HudBtn label="Next card" onClick={() => cycle(1)}><ChevronRight className="h-4 w-4" /></HudBtn>
            <HudBtn label="Shuffle the deck" onClick={() => { cycle(1); }}><Shuffle className="h-4 w-4" /></HudBtn>
            <HudBtn label={sound ? "Mute sound" : "Enable sound"} onClick={() => setSound((v) => !v)}>
              {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
            </HudBtn>
          </div>
        </div>

        <div
          ref={stageRef}
          tabIndex={0}
          role="region"
          aria-label="Project card deck. Arrow keys flip cards, keys 1 to 4 change layout, Enter opens the focused card."
          onPointerDown={onStageDown}
          onPointerMove={onStageMove}
          onPointerLeave={onStageLeave}
          onKeyDown={onStageKey}
          className="relative mt-4 select-none overflow-hidden outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
          style={{ height: stageH, perspective: 1500, touchAction: "pan-y", transition: "height .7s cubic-bezier(.2,.8,.2,1)", cursor: mode === "ring" ? "grab" : "default" }}
        >
          <div ref={tableRef} className="absolute inset-0" style={{ transformStyle: "preserve-3d", transition: "transform .3s ease-out" }}>
            <div
              className="pointer-events-none absolute left-1/2"
              style={{
                width: floorSize, height: floorSize, marginLeft: -floorSize / 2, marginTop: -floorSize / 2,
                top: baseY + cardH + 18, transform: "rotateX(90deg)",
                opacity: mode === "grid" ? 0 : 1, transition: "opacity .6s",
              }}
            >
              <div className="pj-grid absolute inset-0" />
              <div
                className="absolute left-1/2 top-1/2"
                style={{ width: 0, height: 0, transform: `rotate(${-ringAngle}deg)`, transition: ringAnim ? "transform .9s cubic-bezier(.2,.8,.2,1)" : "none", opacity: mode === "ring" ? 1 : 0.35 }}
              >
                <div className="pj-ticks absolute" style={{ width: radius * 2 + 40, height: radius * 2 + 40, left: -radius - 20, top: -radius - 20 }} />
                <div className="absolute rounded-full border border-dashed border-[#ff6a00]/60" style={{ width: radius * 2, height: radius * 2, left: -radius, top: -radius }} />
                {PROJECTS.map((p, i) => {
                  const pos = order.indexOf(i);
                  const on = mode === "ring" ? pos === ringFront : pos === 0;
                  return (
                    <div
                      key={p.id}
                      className="absolute"
                      style={{
                        width: 14, height: 14, left: -7, top: -7,
                        transform: `rotate(${-pos * STEP}deg) translateY(${radius}px)`,
                        background: on ? p.accent : "#3a1808",
                        boxShadow: on ? `0 0 14px 4px ${p.accent}` : "none",
                        transition: "background .2s, box-shadow .2s",
                      }}
                    />
                  );
                })}
              </div>
            </div>

            <div
              className="absolute left-1/2 top-0"
              style={{
                width: 0, height: 0, transformStyle: "preserve-3d",
                transform: mode === "ring" ? `translateZ(${-radius}px) rotateY(${ringAngle}deg)` : "translateZ(0px)",
                transition: ringAnim ? "transform .9s cubic-bezier(.2,.8,.2,1)" : "none",
              }}
            >
              {PROJECTS.map((p, idx) => {
                const pos = order.indexOf(idx);
                const pl = place(pos, idx);
                const tiltable = mode === "stack" ? pos === 0 : mode === "ring" ? pos === ringFront : true;
                return (
                  <TCGCard
                    key={p.id}
                    p={p}
                    idx={idx}
                    t={pl.t}
                    o={pl.o}
                    w={cardW}
                    h={cardH}
                    slow={dealing}
                    delay={pos * 70}
                    hot={hoverId === idx}
                    tiltable={dealt && tiltable}
                    floating={dealt && mode === "stack" && pos === 0 && hoverId !== idx && !reducedMotion()}
                    compact={small}
                    isTop={mode === "ring" ? pos === ringFront : pos === 0}
                    onActivate={activate}
                    onHover={setHoverId}
                  />
                );
              })}
            </div>
          </div>
        </div>

        <p className="pj-mono mt-4 text-center text-sm text-[#8a5a40]">{HINTS[mode]}</p>

        <div className="mt-8 border border-[#3a1808] bg-[#0d0605]/90 p-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#3a1808] pb-3">
            <span className="pj-arcade text-[9px] text-[#ffb066]">DECK_CONTROLLER // OPERATIONAL</span>
            <div className="pj-mono flex flex-wrap gap-x-5 gap-y-1 text-[13px] text-[#c9906a]">
              <span>CARDS <b className="font-normal text-[#ffcfa3]">{N}</b></span>
              <span style={{ color: RARITY.LEGENDARY.color }}>LEGENDARY {counts.LEGENDARY || 0}</span>
              <span style={{ color: RARITY.EPIC.color }}>EPIC {counts.EPIC || 0}</span>
              <span style={{ color: RARITY.RARE.color }}>RARE {counts.RARE || 0}</span>
              <span>AVG PWR <b className="font-normal text-[#ffcfa3]">{avg}</b></span>
            </div>
          </div>
          <div className="pj-mono mt-3 min-h-[5.5rem] space-y-1 text-[13px] text-[#c9906a]" aria-live="polite">
            {logs.map((l) => (
              <p key={l.id} className="pj-log">
                <span className="text-[#6b3a22]">[{l.ts}]</span> &gt; {l.msg}
              </p>
            ))}
          </div>
          <p className="pj-mono mt-3 hidden border-t border-[#3a1808] pt-3 text-[12px] text-[#6b3a22] md:block">
            Focus the table, then: <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">1</kbd>–<kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">4</kbd> layout ·{" "}
            <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">SPACE</kbd> next layout · <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">←</kbd>{" "}
            <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">→</kbd> flip cards · <kbd className="border border-[#5a2410] px-1.5 text-[#c9906a]">ENTER</kbd> inspect
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