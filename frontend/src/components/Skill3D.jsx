import { useCallback, useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Volume2, VolumeX } from "lucide-react";


const GROUP_COLOR = { Backend: "#ff6a00", "Agentic AI": "#ffb000", "Data & Infra": "#ff3d5a" };
const GROUPS = ["All", "Backend", "Agentic AI", "Data & Infra"];
const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";

const SKILLS = [
  {
    id: "py", code: "MOD_01", name: "Python + AsyncIO", group: "Backend", short: "Py", icon: "python/python-original", level: 92,
    status: "PRIMARY CORE", az: 0, el: 0, r: 0, hub: true,
    about: "My main language. I write async-first services that juggle many I/O calls without blocking.",
    did: ["Async API clients and workers", "Concurrent LLM + DB calls", "Typed, tested production code"],
  },
  {
    id: "fastapi", code: "MOD_02", name: "FastAPI", group: "Backend", short: "FA", icon: "fastapi/fastapi-original", level: 90,
    status: "ACTIVE IN PROD", az: -70, el: 20, r: 1,
    about: "My go-to for fast, typed REST APIs with automatic docs and validation.",
    did: ["Pydantic-validated models", "Auth, middleware, streaming", "Serving RAG and agent APIs"],
  },
  {
    id: "django", code: "MOD_03", name: "Django", group: "Backend", short: "Dj", icon: "django/django-plain", mono: true, level: 82,
    status: "MAINTAINED", az: -105, el: -18, r: 0.95,
    about: "Batteries-included framework for projects that need ORM, admin and auth from day one.",
    did: ["DRF APIs", "Admin dashboards", "Migrations and ORM tuning"],
  },
  {
    id: "node", code: "MOD_04", name: "Node.js Gateway", group: "Backend", short: "Nd", icon: "nodejs/nodejs-original", level: 75,
    status: "OPERATIONAL", az: -128, el: 30, r: 0.9,
    about: "A thin gateway in front of Python services for routing, auth and request shaping.",
    did: ["API gateway and proxying", "Rate limits and token checks", "WebSocket glue"],
  },
  {
    id: "langgraph", code: "MOD_05", name: "LangGraph Agents", group: "Agentic AI", short: "LG", icon: "", level: 88,
    status: "ACTIVE IN PROD", az: 15, el: 24, r: 1,
    about: "Stateful multi-step agents modelled as graphs, with branching, tools and human checkpoints.",
    did: ["Multi-agent workflows", "Tool-calling with retries", "Persistent memory"],
  },
  {
    id: "langchain", code: "MOD_06", name: "LangChain", group: "Agentic AI", short: "LC", icon: "", level: 86,
    status: "OPERATIONAL", az: 48, el: -8, r: 1,
    about: "Chains, retrievers and tool wrappers that keep my LLM layer provider-agnostic.",
    did: ["Custom tools and retrievers", "Structured output parsing", "Swappable model providers"],
  },
  {
    id: "rag", code: "MOD_07", name: "RAG Pipelines", group: "Agentic AI", short: "RG", icon: "", level: 90,
    status: "ACTIVE IN PROD", az: 78, el: 26, r: 0.95,
    about: "End-to-end retrieval: ingestion, chunking, embeddings, search and grounded answers.",
    did: ["Chunking strategies", "Hybrid search + reranking", "Retrieval evaluation"],
  },
  {
    id: "prompt", code: "MOD_08", name: "Prompt + Context", group: "Agentic AI", short: "PC", icon: "", level: 88,
    status: "OPERATIONAL", az: 32, el: -40, r: 0.9,
    about: "Deciding what the model sees, in what order, and within what budget.",
    did: ["System prompts, few-shot design", "Context window budgeting", "Guardrails and schemas"],
  },
  {
    id: "postgres", code: "MOD_09", name: "PostgreSQL", group: "Data & Infra", short: "Pg", icon: "postgresql/postgresql-original", level: 85,
    status: "ACTIVE IN PROD", az: 122, el: 18, r: 1,
    about: "My primary datastore, with pgvector when embeddings belong next to the data.",
    did: ["Schema design and indexing", "Query optimization", "Vector search"],
  },
  {
    id: "redis", code: "MOD_10", name: "Redis", group: "Data & Infra", short: "Rd", icon: "redis/redis-original", level: 80,
    status: "ACTIVE IN PROD", az: 152, el: -14, r: 0.95,
    about: "Caching, queues and short-lived state that keep services and agents quick.",
    did: ["Response/embedding caches", "Task queues", "Session and agent state"],
  },
  {
    id: "docker", code: "MOD_11", name: "Docker + K8s", group: "Data & Infra", short: "Dk", icon: "docker/docker-original", level: 80,
    status: "DEPLOYED", az: 186, el: 24, r: 1,
    about: "Every service is containerized and shipped on Kubernetes for repeatable releases.",
    did: ["Multi-stage builds", "Deployments and services", "Config and secrets"],
  },
  {
    id: "aws", code: "MOD_12", name: "AWS + Terraform", group: "Data & Infra", short: "Aw", icon: "terraform/terraform-original", level: 72,
    status: "STABLE", az: 218, el: -20, r: 0.95,
    about: "Cloud infrastructure as code. AWS Certified Cloud Practitioner (CLF-C02).",
    did: ["Terraform provisioning", "Core compute/storage/network", "Per-stage environments"],
  },
];

const LINK_PAIRS = [
  ["py", "fastapi"], ["py", "django"], ["py", "langgraph"], ["py", "langchain"], ["py", "rag"], ["py", "postgres"], ["py", "redis"],
  ["fastapi", "postgres"], ["fastapi", "redis"], ["fastapi", "node"], ["fastapi", "docker"], ["fastapi", "rag"],
  ["django", "postgres"], ["django", "redis"], ["django", "docker"],
  ["langgraph", "langchain"], ["langgraph", "rag"], ["langgraph", "prompt"], ["langchain", "rag"], ["langchain", "prompt"], ["rag", "prompt"],
  ["rag", "postgres"], ["docker", "aws"],
];

const IDX = Object.fromEntries(SKILLS.map((s, i) => [s.id, i]));
const EDGES = LINK_PAIRS.map(([a, b]) => [IDX[a], IDX[b]]);
const ADJ = SKILLS.map(() => new Set());
EDGES.forEach(([a, b]) => { ADJ[a].add(b); ADJ[b].add(a); });
const UNIT = SKILLS.map((s) => {
  const az = (s.az * Math.PI) / 180;
  const el = (s.el * Math.PI) / 180;
  return [s.r * Math.cos(el) * Math.sin(az), -s.r * Math.sin(el), s.r * Math.cos(el) * Math.cos(az)];
});

const TAU = Math.PI * 2;
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
const groupAvg = (g) => {
  const list = SKILLS.filter((s) => s.group === g);
  return Math.round(list.reduce((n, s) => n + s.level, 0) / list.length);
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&family=Share+Tech+Mono&display=swap');
.sk-arcade{font-family:'Press Start 2P',ui-monospace,monospace}
.sk-mono{font-family:'Share Tech Mono',ui-monospace,monospace}
.sk-notch{clip-path:polygon(0 8px,4px 8px,4px 4px,8px 4px,8px 0,calc(100% - 8px) 0,calc(100% - 8px) 4px,calc(100% - 4px) 4px,calc(100% - 4px) 8px,100% 8px,100% calc(100% - 8px),calc(100% - 4px) calc(100% - 8px),calc(100% - 4px) calc(100% - 4px),calc(100% - 8px) calc(100% - 4px),calc(100% - 8px) 100%,8px 100%,8px calc(100% - 4px),4px calc(100% - 4px),4px calc(100% - 8px),0 calc(100% - 8px))}
.sk-notch-s{clip-path:polygon(0 4px,2px 4px,2px 2px,4px 2px,4px 0,calc(100% - 4px) 0,calc(100% - 4px) 2px,calc(100% - 2px) 2px,calc(100% - 2px) 4px,100% 4px,100% calc(100% - 4px),calc(100% - 2px) calc(100% - 4px),calc(100% - 2px) calc(100% - 2px),calc(100% - 4px) calc(100% - 2px),calc(100% - 4px) 100%,4px 100%,4px calc(100% - 2px),2px calc(100% - 2px),2px calc(100% - 4px),0 calc(100% - 4px))}
.sk-scan{background:repeating-linear-gradient(0deg,rgba(0,0,0,.28) 0 1px,transparent 1px 3px)}
.sk-dots{background-image:radial-gradient(rgba(255,106,0,.5) 1px,transparent 1px);background-size:24px 24px}
.sk-radar{background:conic-gradient(from 0deg,rgba(255,106,0,.28),rgba(255,106,0,0) 28%,rgba(255,106,0,0) 100%);-webkit-mask-image:radial-gradient(closest-side,#000 30%,transparent 100%);mask-image:radial-gradient(closest-side,#000 30%,transparent 100%);animation:skSpin 7s linear infinite}
.sk-core{animation:skPulse 3.2s ease-in-out infinite}
.sk-ping{animation:skPing 1.6s ease-out infinite}
.sk-led{animation:skBlink 1.4s steps(2,end) infinite}
.sk-cursor{animation:skBlink 1s steps(2,end) infinite}
.sk-rise{animation:skRise .4s ease-out both}
.sk-boot{animation:skBoot .35s steps(4,end) both}
.sk-orbit{animation:skSpin 4s linear infinite}
@keyframes skSpin{to{transform:rotate(360deg)}}
@keyframes skPulse{50%{opacity:.55;transform:scale(1.08)}}
@keyframes skPing{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(1.5)}}
@keyframes skBlink{50%{opacity:.15}}
@keyframes skRise{from{opacity:0;transform:translateX(-10px)}to{opacity:1;transform:none}}
@keyframes skBoot{from{opacity:0;transform:scaleY(.1)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){.sk-radar,.sk-core,.sk-ping,.sk-led,.sk-cursor,.sk-rise,.sk-boot,.sk-orbit{animation:none!important}}
`;


function Logo({ skill, className = "h-8 w-8", textClass = "text-xs" }) {
  const [failed, setFailed] = useState(false);
  const color = GROUP_COLOR[skill.group];
  if (!skill.icon || failed) {
    return (
      <span className={`sk-arcade ${textClass}`} style={{ color }}>
        {skill.short}
      </span>
    );
  }
  return (
    <img
      src={`${CDN}${skill.icon}.svg`}
      alt=""
      draggable={false}
      onError={() => setFailed(true)}
      className={`${className} object-contain ${skill.mono ? "brightness-0 invert" : ""}`}
      style={{ filter: skill.mono ? undefined : "drop-shadow(0 0 6px rgba(255,150,60,.35))" }}
    />
  );
}

function useTypewriter(text, speed = 14) {
  const [n, setN] = useState(() => (reducedMotion() ? text.length : 0));
  useEffect(() => {
    if (reducedMotion()) { setN(text.length); return undefined; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? v : v + 2)), speed);
    return () => clearInterval(id);
  }, [text, speed]);
  return text.slice(0, n);
}

function Decompile({ skill, onPick, onReset }) {
  const color = GROUP_COLOR[skill.group];
  const tiltRef = useRef(null);
  const typed = useTypewriter(skill.about);
  const [armed, setArmed] = useState(false);
  const links = [...ADJ[IDX[skill.id]]].map((i) => SKILLS[i]);

  useEffect(() => {
    setArmed(false);
    const id = setTimeout(() => setArmed(true), 80);
    return () => clearTimeout(id);
  }, [skill.id]);

  const onMove = (e) => {
    if (e.pointerType === "touch" || !tiltRef.current) return;
    const r = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    tiltRef.current.style.transform = `rotateX(${(-py * 7).toFixed(2)}deg) rotateY(${(px * 7).toFixed(2)}deg)`;
  };
  const onLeave = () => { if (tiltRef.current) tiltRef.current.style.transform = "none"; };

  const segs = 20;
  const on = Math.round((skill.level / 100) * segs);

  return (
    <div className="h-full" style={{ perspective: 1000 }} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div
        ref={tiltRef}
        className="relative flex h-full flex-col border-2 bg-[#0b0605] p-5 transition-transform duration-150"
        style={{ borderColor: color, boxShadow: `0 0 36px -8px ${color}`, transformStyle: "preserve-3d" }}
      >
        <div className="sk-scan pointer-events-none absolute inset-0 opacity-70" />

        <div className="relative flex items-center justify-between border-b pb-3" style={{ borderColor: `${color}55` }}>
          <div className="flex items-center gap-2">
            <span className="sk-ping inline-block h-2.5 w-2.5" style={{ background: color }} />
            <h3 className="sk-arcade text-[9px]" style={{ color }}>[ MODULE DECOMPILE ]</h3>
          </div>
          <span className="sk-mono text-sm text-[#ffcfa3]">{skill.code}</span>
        </div>

        <div key={skill.id} className="relative mt-4 flex items-center gap-4">
          <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
            <div className="sk-orbit absolute inset-0">
              <span className="absolute -top-0.5 left-1/2 h-2 w-2 -translate-x-1/2" style={{ background: color }} />
            </div>
            <div className="sk-notch-s absolute inset-1.5" style={{ background: color }}>
              <div className="sk-notch-s absolute flex items-center justify-center bg-[#0d0706]" style={{ inset: 2 }}>
                <Logo skill={skill} className="h-8 w-8" textClass="text-sm" />
              </div>
            </div>
          </div>
          <div className="min-w-0">
            <h4 className="sk-arcade text-[11px] leading-relaxed text-[#fff1e0] sm:text-xs">{skill.name}</h4>
            <span className="sk-arcade mt-1.5 inline-block border px-1.5 py-1 text-[7px]" style={{ borderColor: color, color }}>
              {skill.group}
            </span>
          </div>
        </div>

        <div className="relative mt-5">
          <div className="sk-mono mb-1.5 flex items-end justify-between">
            <span className="text-[13px] text-[#c9906a]">PROFICIENCY</span>
            <span className="sk-arcade text-sm" style={{ color }}>{skill.level}%</span>
          </div>
          <div className="flex gap-[2px] border border-[#3a1808] bg-[#150a07] p-[3px]">
            {Array.from({ length: segs }).map((_, i) => (
              <span
                key={i}
                className="h-2.5 flex-1"
                style={{
                  background: armed && i < on ? color : "#26110a",
                  transition: "background 0s",
                  transitionDelay: `${i * 35}ms`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative mt-5">
          <h5 className="sk-arcade mb-2 text-[8px] text-[#ff6a00]">HOW I USE IT</h5>
          <p className="sk-mono min-h-[4.2rem] text-[15px] leading-snug text-[#ffe2c4]">
            {typed}
            <span className="sk-cursor ml-0.5 inline-block h-[1em] w-[0.5em] translate-y-[2px]" style={{ background: color }} />
          </p>
          <ul key={`l-${skill.id}`} className="mt-3 space-y-1.5">
            {skill.did.map((d, i) => (
              <li key={d} className="sk-rise sk-mono flex gap-2 text-[14px] text-[#e6b793]" style={{ animationDelay: `${300 + i * 130}ms` }}>
                <span className="mt-[6px] h-2 w-2 shrink-0" style={{ background: color }} />
                {d}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mt-5">
          <h5 className="sk-arcade mb-2 text-[8px] text-[#ff6a00]">LINKED MODULES</h5>
          <div className="flex flex-wrap gap-1.5">
            {links.map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => onPick(l.id)}
                className="sk-mono flex items-center gap-1.5 border border-[#5a2410] bg-[#150a07] px-2 py-1 text-[13px] text-[#ffb066] transition-colors hover:border-[#ff6a00] hover:bg-[#ff6a00]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
              >
                <span className="h-2 w-2" style={{ background: GROUP_COLOR[l.group] }} />
                {l.name}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-auto flex items-center justify-between gap-3 border-t pt-4" style={{ borderColor: `${color}55` }}>
          <p className="sk-mono text-[13px] text-[#8a5a40]">
            STATUS <span className="text-[#3dff8b]">{skill.status}</span>
          </p>
          <button
            type="button"
            onClick={onReset}
            className="sk-arcade flex items-center gap-1.5 border border-[#5a2410] bg-[#150a07] px-2.5 py-2 text-[8px] text-[#ffb066] transition-colors hover:bg-[#ff6a00] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
          >
            <RotateCcw className="h-3 w-3" /> RESET VIEW
          </button>
        </div>
      </div>
    </div>
  );
}


export default function Skills3D() {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const nodeEls = useRef([]);
  const yawText = useRef(null);
  const audio = useRef(null);

  const [dims, setDims] = useState({ w: 700, h: 560, R: 210, node: 56 });
  const [sel, setSel] = useState("py");
  const [hover, setHover] = useState(null);
  const [filter, setFilter] = useState("All");
  const [auto, setAuto] = useState(() => !reducedMotion());
  const [sound, setSound] = useState(false);

  const sim = useRef({
    yaw: 0.5, pitch: 0.14, vyaw: 0, vpitch: 0, fy: 0, fp: 0, focus: false,
    dragging: false, moved: 0, sx: 0, sy: 0, syaw: 0, spitch: 0, lastX: 0, lastY: 0, lastT: 0,
    auto: true, hover: null, sel: "py", filter: "All", lastInteract: 0,
    intro: 0, introT0: null, visible: false, w: 700, h: 560, R: 210, sound: false, stars: [],
  });

  useEffect(() => { sim.current.auto = auto; }, [auto]);
  useEffect(() => { sim.current.sound = sound; }, [sound]);
  useEffect(() => { sim.current.sel = sel; }, [sel]);
  useEffect(() => { sim.current.filter = filter; }, [filter]);
  useEffect(() => { sim.current.hover = hover; }, [hover]);

  useEffect(() => {
    const el = stageRef.current;
    const calc = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      const R = Math.min(w * 0.36, h * 0.4);
      const node = w < 520 ? 44 : 56;
      Object.assign(sim.current, { w, h, R });
      setDims({ w, h, R, node });
      const c = canvasRef.current;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      c.width = w * dpr;
      c.height = h * dpr;
    };
    calc();
    sim.current.stars = Array.from({ length: 140 }, () => ({
      x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1, t: Math.random() * TAU, big: Math.random() > 0.85,
    }));
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

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
    } catch (e) {  }
  }, []);

  const aimAt = useCallback((x, y, z) => {
    const s = sim.current;
    const rho = Math.hypot(x, z);
    let fy = s.yaw;
    let fp = clamp(Math.atan2(y, rho || 1), -0.7, 0.7) * (rho < 0.01 ? 0 : 1) + (rho < 0.01 ? 0.14 : 0);
    if (rho >= 0.01) fy = Math.atan2(-x, z);
    fy += Math.round((s.yaw - fy) / TAU) * TAU;
    s.fy = fy;
    s.fp = fp;
    s.focus = true;
    s.vyaw = 0;
    s.vpitch = 0;
    s.lastInteract = performance.now();
  }, []);

  const pick = useCallback((id) => {
    setSel(id);
    sim.current.sel = id;
    const [x, y, z] = UNIT[IDX[id]];
    aimAt(x, y, z);
    beep("square", 440, 880, 0.09, 0.06);
  }, [aimAt, beep]);

  const chooseFilter = useCallback((g) => {
    setFilter(g);
    sim.current.filter = g;
    beep("sawtooth", 600, 250, 0.07, 0.05);
    if (g === "All") { aimAt(0, 0, 0); return; }
    const list = SKILLS.map((s, i) => ({ s, i })).filter(({ s }) => s.group === g);
    const v = list.reduce((a, { i }) => [a[0] + UNIT[i][0], a[1] + UNIT[i][1], a[2] + UNIT[i][2]], [0, 0, 0]);
    aimAt(v[0], v[1], v[2]);
  }, [aimAt, beep]);

  const reset = useCallback(() => {
    setSel("py");
    setFilter("All");
    sim.current.sel = "py";
    sim.current.filter = "All";
    aimAt(0, 0, 0);
    beep("square", 440, 880, 0.09, 0.06);
  }, [aimAt, beep]);

  useEffect(() => {
    const s = sim.current;
    const rm = reducedMotion();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    let last = performance.now();

    const frame = (now) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(50, now - last);
      last = now;
      if (!s.visible) return;

      if (s.introT0 === null) s.introT0 = now;
      s.intro = rm ? 1 : clamp((now - s.introT0) / 1700, 0, 1);

      if (!s.dragging) {
        if (s.focus) {
          const k = 1 - Math.exp(-dt / 140);
          s.yaw += (s.fy - s.yaw) * k;
          s.pitch += (s.fp - s.pitch) * k;
          if (Math.abs(s.fy - s.yaw) < 0.002 && Math.abs(s.fp - s.pitch) < 0.002) s.focus = false;
        } else if (Math.abs(s.vyaw) > 0.00002 || Math.abs(s.vpitch) > 0.00002) {
          s.yaw += s.vyaw * dt;
          s.pitch = clamp(s.pitch + s.vpitch * dt, -0.9, 0.9);
          const d = Math.exp(-dt / 400);
          s.vyaw *= d;
          s.vpitch *= d;
        } else if (s.auto && !s.hover && !rm && !document.hidden && now - s.lastInteract > 3000) {
          s.yaw += 0.00011 * dt;
        }
      }

      const { w, h, R } = s;
      const D = R * 4.5;
      const cx = w / 2;
      const cy = h / 2;
      const pitch = s.pitch + (rm ? 0 : Math.sin(now / 2400) * 0.025);
      const cosY = Math.cos(s.yaw), sinY = Math.sin(s.yaw), cosP = Math.cos(pitch), sinP = Math.sin(pitch);
      const proj = (x, y, z) => {
        const x1 = x * cosY + z * sinY;
        const z1 = -x * sinY + z * cosY;
        const y2 = y * cosP - z1 * sinP;
        const z2 = y * sinP + z1 * cosP;
        const f = D / (D - z2);
        return { x: cx + x1 * f, y: cy + y2 * f, z: z2, f };
      };

      if (yawText.current) {
        const deg = (((s.yaw * 180) / Math.PI) % 360 + 360) % 360;
        yawText.current.textContent = `YAW ${String(Math.round(deg)).padStart(3, "0")}°  PITCH ${pitch >= 0 ? "+" : "-"}${String(Math.round(Math.abs(pitch * 57.3))).padStart(2, "0")}°`;
      }

      const P = SKILLS.map((sk, i) => {
        const p = clamp(s.intro * 1.6 - i * 0.07, 0, 1);
        const e = 1 - Math.pow(1 - p, 3);
        const u = UNIT[i];
        const pr = proj(u[0] * R * e, u[1] * R * e, u[2] * R * e);
        pr.p = p;
        return pr;
      });

      const dpr = canvas.width / w;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineCap = "butt";

      s.stars.forEach((st) => {
        const p = proj(st.x * R * 1.9, st.y * R * 1.9, st.z * R * 1.9);
        const a = (0.15 + 0.5 * Math.abs(Math.sin(now / 900 + st.t))) * (0.4 + 0.6 * ((p.z / (R * 1.9) + 1) / 2)) * s.intro;
        ctx.fillStyle = `rgba(255,176,90,${a.toFixed(3)})`;
        const sz = st.big ? 3 : 2;
        ctx.fillRect(Math.round(p.x), Math.round(p.y), sz, sz);
      });

      const ring = (rx, rz, rad, alpha) => {
        let prev = null;
        for (let i = 0; i <= 96; i++) {
          const t = (i / 96) * TAU;
          let x = Math.cos(t) * rad, y = 0, z = Math.sin(t) * rad;
          let y1 = y * Math.cos(rx) - z * Math.sin(rx);
          let z1 = y * Math.sin(rx) + z * Math.cos(rx);
          y = y1; z = z1;
          const x1 = x * Math.cos(rz) - y * Math.sin(rz);
          y1 = x * Math.sin(rz) + y * Math.cos(rz);
          x = x1; y = y1;
          const p = proj(x, y, z);
          if (prev && i % 4 !== 0) {
            ctx.globalAlpha = alpha * s.intro * (0.25 + 0.75 * ((p.z / rad + 1) / 2));
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }
          prev = p;
        }
      };
      ctx.setLineDash([]);
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#ff6a00";
      ring(0, 0, R * 1.12, 0.45);
      ring(1.05, 0, R * 1.12, 0.3);
      ring(0.5, 1.1, R * 1.12, 0.3);
      ctx.strokeStyle = "#ffb000";
      ring(0, 0, R * 0.62, 0.2);

      const focalId = s.hover || s.sel;
      const fi = IDX[focalId];
      const focalColor = GROUP_COLOR[SKILLS[fi].group];
      const inFilter = (i) => s.filter === "All" || SKILLS[i].group === s.filter || SKILLS[i].hub;
      EDGES.forEach(([a, b]) => {
        if (!inFilter(a) || !inFilter(b)) return;
        const A = P[a], B = P[b];
        const hot = a === fi || b === fi;
        const depth = ((A.z + B.z) / 2 / R + 1) / 2;
        const fade = Math.min(A.p, B.p);
        ctx.globalAlpha = fade * (hot ? 0.95 : 0.5 * (0.35 + 0.65 * depth) * 0.6);
        ctx.strokeStyle = hot ? focalColor : "#8a3f1c";
        ctx.lineWidth = hot ? 2 : 1;
        ctx.setLineDash(hot ? [6, 4] : [3, 5]);
        ctx.lineDashOffset = hot ? -now / 45 : 0;
        ctx.beginPath();
        ctx.moveTo(A.x, A.y);
        ctx.lineTo(B.x, B.y);
        ctx.stroke();
        if (hot && !rm) {
          const from = a === fi ? A : B;
          const to = a === fi ? B : A;
          const t = ((now / 1100) + a * 0.31 + b * 0.17) % 1;
          ctx.globalAlpha = fade;
          ctx.setLineDash([]);
          ctx.fillStyle = "#fff3e0";
          ctx.fillRect(Math.round(from.x + (to.x - from.x) * t) - 2, Math.round(from.y + (to.y - from.y) * t) - 2, 4, 4);
        }
      });
      ctx.globalAlpha = 1;
      ctx.setLineDash([]);

      SKILLS.forEach((sk, i) => {
        const el = nodeEls.current[i];
        if (!el) return;
        const p = P[i];
        const depth = clamp((p.z / R + 1) / 2, 0, 1);
        const connected = i === fi || ADJ[fi].has(i);
        const shown = inFilter(i);
        const op = p.p * (0.4 + 0.6 * depth) * (shown ? (connected ? 1 : 0.3) : 0.1);
        el.style.transform = `translate3d(${p.x.toFixed(1)}px,${p.y.toFixed(1)}px,0) translate(-50%,-50%) scale(${(p.f * (0.6 + 0.4 * p.p)).toFixed(3)})`;
        el.style.opacity = op.toFixed(3);
        el.style.zIndex = String(1000 + Math.round(p.z));
        el.style.filter = shown && connected ? "none" : "grayscale(.85)";
        el.style.pointerEvents = shown && p.p > 0.6 ? "auto" : "none";
      });
    };
    raf = requestAnimationFrame(frame);

    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; });
    io.observe(stageRef.current);

    const move = (e) => {
      if (!s.dragging) return;
      const now = performance.now();
      const dx = e.clientX - s.sx;
      const dy = e.clientY - s.sy;
      s.moved = Math.max(s.moved, Math.abs(dx), Math.abs(dy));
      s.yaw = s.syaw + dx * 0.006;
      s.pitch = clamp(s.spitch + dy * 0.004, -0.9, 0.9);
      const dtm = Math.max(1, now - s.lastT);
      s.vyaw = s.vyaw * 0.6 + (((e.clientX - s.lastX) * 0.006) / dtm) * 0.4;
      s.vpitch = s.vpitch * 0.6 + (((e.clientY - s.lastY) * 0.004) / dtm) * 0.4;
      s.lastX = e.clientX; s.lastY = e.clientY; s.lastT = now; s.lastInteract = now;
    };
    const up = () => {
      if (!s.dragging) return;
      s.dragging = false;
      if (performance.now() - s.lastT > 90) { s.vyaw = 0; s.vpitch = 0; }
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
  }, []);

  const onDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return;
    const s = sim.current;
    s.dragging = true;
    s.focus = false;
    s.moved = 0;
    s.sx = e.clientX; s.sy = e.clientY; s.lastX = e.clientX; s.lastY = e.clientY;
    s.syaw = s.yaw; s.spitch = s.pitch;
    s.lastT = performance.now(); s.lastInteract = s.lastT;
    s.vyaw = 0; s.vpitch = 0;
  };

  const onNodeClick = (id) => {
    if (sim.current.moved > 6) return;
    pick(id);
  };

  const onKey = (e) => {
    const s = sim.current;
    const baseY = s.focus ? s.fy : s.yaw;
    const baseP = s.focus ? s.fp : s.pitch;
    if (e.key === "ArrowLeft") { e.preventDefault(); s.fy = baseY + 0.4; s.fp = baseP; s.focus = true; s.lastInteract = performance.now(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); s.fy = baseY - 0.4; s.fp = baseP; s.focus = true; s.lastInteract = performance.now(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); s.fy = baseY; s.fp = clamp(baseP + 0.2, -0.8, 0.8); s.focus = true; s.lastInteract = performance.now(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); s.fy = baseY; s.fp = clamp(baseP - 0.2, -0.8, 0.8); s.focus = true; s.lastInteract = performance.now(); }
  };

  const skill = SKILLS[IDX[sel]];
  const focalSkill = SKILLS[IDX[hover || sel]];
  const { R, node } = dims;

  return (
    <section id="skills" className="relative isolate overflow-hidden bg-transparent py-16 text-[#ffb066] sm:py-24">
      <style>{CSS}</style>

      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0" style={{ background: "radial-gradient(55% 45% at 35% 50%, rgba(255,90,20,.18), transparent 70%), linear-gradient(#070404, #100605 60%, #070404)" }} />
        <div className="sk-dots absolute inset-0 opacity-[.07]" />
        <div className="sk-scan absolute inset-0 opacity-60" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <header className="mb-8 text-center">
          <h2 className="sk-arcade mt-4 text-3xl text-[#fff3e6] sm:text-5xl" style={{ textShadow: "4px 4px 0 #7a2a00" }}>
            TECH MATRIX
          </h2>
          <p className="sk-mono mx-auto mt-5 max-w-xl text-base text-[#c9906a]">
            Drag to orbit the map. Click a node to open it, and follow the lines to see what each skill connects to.
          </p>
        </header>

        <div className="mb-4 flex flex-wrap items-center justify-center gap-2" role="group" aria-label="Filter skills by group">
          {GROUPS.map((g) => {
            const active = filter === g;
            const c = g === "All" ? "#ff6a00" : GROUP_COLOR[g];
            return (
              <button
                key={g}
                type="button"
                aria-pressed={active}
                onClick={() => chooseFilter(g)}
                className="sk-arcade flex items-center gap-2 border px-3 py-2.5 text-[8px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb000] sm:text-[9px]"
                style={{ borderColor: active ? c : "#4a2312", background: active ? c : "#0d0706", color: active ? "#0a0605" : "#c9906a" }}
              >
                {g.toUpperCase()}
                <span className="sk-mono text-[12px]" style={{ opacity: 0.8 }}>
                  {g === "All" ? SKILLS.length : `${SKILLS.filter((s) => s.group === g).length} · avg ${groupAvg(g)}`}
                </span>
              </button>
            );
          })}
        </div>

        <div className="grid items-stretch gap-5 lg:grid-cols-3">
          <div
            ref={stageRef}
            tabIndex={0}
            role="group"
            aria-label="3D skill map. Use arrow keys to rotate."
            onPointerDown={onDown}
            onKeyDown={onKey}
            className="relative h-[480px] cursor-grab select-none overflow-hidden border-2 border-[#5a2410] bg-[#0a0504]/90 outline-none active:cursor-grabbing focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000] sm:h-[580px] lg:col-span-2"
            style={{ touchAction: "pan-y", boxShadow: "0 0 40px -12px rgba(255,90,20,.5)" }}
          >
            <div
              className="sk-core pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{ width: R * 1.6, height: R * 1.6, background: "radial-gradient(closest-side, rgba(255,106,0,.35), transparent 75%)" }}
            />
            <div
              className="sk-radar pointer-events-none absolute left-1/2 top-1/2 rounded-full"
              style={{ width: R * 2.4, height: R * 2.4, marginLeft: -R * 1.2, marginTop: -R * 1.2 }}
            />

            <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" style={{ width: dims.w, height: dims.h }} />

            {SKILLS.map((s, i) => {
              const color = GROUP_COLOR[s.group];
              const size = s.hub ? node * 1.3 : node;
              const isSel = s.id === sel;
              const isHover = s.id === hover;
              return (
                <button
                  key={s.id}
                  ref={(el) => (nodeEls.current[i] = el)}
                  type="button"
                  aria-label={`${s.name}, proficiency ${s.level} percent`}
                  aria-pressed={isSel}
                  onClick={() => onNodeClick(s.id)}
                  onPointerEnter={(e) => { if (e.pointerType !== "touch") { setHover(s.id); beep("triangle", 350, 520, 0.04, 0.03); } }}
                  onPointerLeave={() => setHover(null)}
                  onFocus={() => setHover(s.id)}
                  onBlur={() => setHover(null)}
                  className="absolute left-0 top-0 cursor-pointer outline-none"
                  style={{ width: size, height: size, opacity: 0, willChange: "transform, opacity" }}
                >
                  <span
                    className="pointer-events-none absolute -inset-3 transition-opacity duration-200"
                    style={{ background: `radial-gradient(closest-side, ${color}99, transparent 75%)`, opacity: isSel ? 1 : isHover ? 0.7 : 0 }}
                  />
                  {isSel && <span className="sk-ping pointer-events-none absolute -inset-1.5 border-2" style={{ borderColor: color }} />}
                  <span className="sk-notch-s absolute inset-0" style={{ background: isSel || isHover ? color : `${color}99` }}>
                    <span className="sk-notch-s absolute flex items-center justify-center" style={{ inset: 2, background: "#0d0706" }}>
                      <Logo skill={s} className={s.hub ? "h-9 w-9" : node < 50 ? "h-6 w-6" : "h-7 w-7"} textClass="text-[10px]" />
                    </span>
                  </span>
                  <span
                    className="sk-arcade absolute -right-2 -top-2 border bg-[#0a0605] px-1 py-0.5 text-[7px]"
                    style={{ borderColor: color, color }}
                  >
                    {s.level}
                  </span>
                  <span
                    className="sk-arcade pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap border border-[#4a2312] bg-[#0a0605]/90 px-1.5 py-1 text-[7px] text-[#ffe2c4]"
                  >
                    {s.name}
                  </span>
                </button>
              );
            })}

            {["left-2 top-2 border-l-2 border-t-2", "right-2 top-2 border-r-2 border-t-2", "bottom-2 left-2 border-b-2 border-l-2", "bottom-2 right-2 border-b-2 border-r-2"].map((c) => (
              <span key={c} className={`pointer-events-none absolute h-4 w-4 border-[#ff6a00] ${c}`} />
            ))}
            <div className="sk-mono pointer-events-none absolute left-6 top-5 z-[2000] text-[13px] text-[#8a5a40]">
              <span ref={yawText}>YAW 000°  PITCH +00°</span>
            </div>
            <div className="sk-mono pointer-events-none absolute right-6 top-5 z-[2000] text-[13px] text-[#8a5a40]">
              NODES <span className="text-[#ffb066]">{SKILLS.length}</span> · LINKS <span className="text-[#ffb066]">{EDGES.length}</span>
            </div>
            <div className="sk-mono pointer-events-none absolute inset-x-6 bottom-5 z-[2000] flex items-center justify-between gap-3 text-[13px]">
              <span className="truncate" style={{ color: GROUP_COLOR[focalSkill.group] }}>
                <span className="sk-led mr-2 inline-block h-2 w-2" style={{ background: GROUP_COLOR[focalSkill.group] }} />
                TRACING {focalSkill.name.toUpperCase()} · {ADJ[IDX[focalSkill.id]].size} LINKS
              </span>
              <span className="hidden shrink-0 text-[#8a5a40] sm:inline">DRAG TO ORBIT</span>
            </div>

            <div className="absolute bottom-12 right-4 z-[2000] flex gap-2">
              <button
                type="button"
                aria-label={auto ? "Pause auto-rotate" : "Start auto-rotate"}
                onClick={() => { sim.current.lastInteract = performance.now(); setAuto((a) => !a); }}
                className="flex h-8 w-8 items-center justify-center border border-[#5a2410] bg-[#150a07] text-[#ffb066] hover:border-[#ff6a00] hover:bg-[#ff6a00]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
              >
                {auto ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
              <button
                type="button"
                aria-label={sound ? "Mute sound" : "Enable sound"}
                onClick={() => setSound((v) => !v)}
                className="flex h-8 w-8 items-center justify-center border border-[#5a2410] bg-[#150a07] text-[#ffb066] hover:border-[#ff6a00] hover:bg-[#ff6a00]/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
              >
                {sound ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Decompile skill={skill} onPick={pick} onReset={reset} />
        </div>

        <div className="mt-5 flex gap-2.5 overflow-x-auto pb-2" role="list" aria-label="All skills">
          {SKILLS.map((s) => {
            const color = GROUP_COLOR[s.group];
            const active = s.id === sel;
            return (
              <button
                key={s.id}
                role="listitem"
                type="button"
                onClick={() => pick(s.id)}
                className="group sk-notch-s relative shrink-0 transition-transform hover:-translate-y-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#ffb000]"
                style={{ background: active ? color : "#4a2312", width: 104 }}
              >
                <span className="sk-notch-s relative m-[2px] flex flex-col items-center gap-1.5 bg-[#0d0706] px-2 py-2.5">
                  <Logo skill={s} className="h-7 w-7" textClass="text-[10px]" />
                  <span className="sk-arcade text-[6px] leading-snug text-[#ffe2c4]">{s.name.split(" ")[0]}</span>
                  <span className="h-1 w-full bg-[#26110a]">
                    <span className="block h-full" style={{ width: `${s.level}%`, background: color }} />
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}