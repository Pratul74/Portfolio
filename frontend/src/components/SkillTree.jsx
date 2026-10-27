import { useState } from "react";

const COLORS = {
  core: "#ff5a1f",
  ai: "#ffb347",
  infra: "#a8421c"
};

const LEGEND = [
  { group: "core", label: "Backend" },
  { group: "ai", label: "Agentic AI" },
  { group: "infra", label: "Data & Infra" },
];

const NODES = [
  {
    id: "root", label: "BACKEND + AI", x: 510, y: 540, size: 16, group: "core",
    code: "NODE_ROOT", title: "BACKEND & AI ENGINEER", tag: "SYSTEM ROOT", power: 92,
    desc: "Backend engineer building FastAPI services, RAG pipelines and agentic AI workflows on PostgreSQL, Redis, Docker and Kubernetes. Select any node to inspect it.",
    meta: [["EDUCATION", "B.E. CSE 2026"], ["CERTIFIED", "AWS CLF-C02"]],
  },
  {
    id: "backend", label: "Backend Engine", x: 190, y: 400, size: 10, group: "core",
    parent: "root", bus: 480, code: "NODE_BACKEND", title: "BACKEND ENGINE", tag: "SERVICES & APIS", power: 93,
    desc: "Production backends in FastAPI, Django and Node.js, from 25+ REST APIs at BusinessBot AI to 15+ Django services during the Akanksha Foundation internship.",
    meta: [["AUTH", "JWT + RBAC"], ["STATUS", "PRODUCTION READY"]],
  },
  {
    id: "python", label: "Python + AsyncIO", x: 70, y: 190, size: 8, group: "core",
    parent: "backend", bus: 345, code: "NODE_PYTHON", title: "PYTHON + ASYNCIO", tag: "LANGUAGE", power: 92,
    desc: "Primary language for APIs and AI pipelines. Async request processing plus Redis caching cut AI response latency by 60% in BusinessBot AI.",
    meta: [["CORE USE", "APIS + AI AGENTS"], ["CONCURRENCY", "ASYNCIO"]],
  },
  {
    id: "fastapi", label: "FastAPI", x: 150, y: 260, size: 8, group: "core",
    parent: "backend", bus: 345, code: "NODE_FASTAPI", title: "FASTAPI ENGINE", tag: "FRAMEWORK", power: 95,
    desc: "Modular FastAPI architecture covering CRM, inventory, appointments and AI workflows. Dependency-based request scoping keeps each tenant's data isolated.",
    meta: [["APIS SHIPPED", "25+"], ["MULTI-TENANT", "500+ BUSINESSES"]],
  },
  {
    id: "django", label: "Django", x: 230, y: 190, size: 8, group: "core",
    parent: "backend", bus: 345, code: "NODE_DJANGO", title: "DJANGO SERVICES", tag: "FRAMEWORK", power: 85,
    desc: "Built and maintained 15+ Django services that automated internal workflows, with JWT auth, custom middleware and centralized logging.",
    meta: [["HOURS SAVED", "40+ / MONTH"], ["INCIDENT RESPONSE", "-25%"]],
  },
  {
    id: "node", label: "Node.js Gateway", x: 310, y: 260, size: 8, group: "core",
    parent: "backend", bus: 345, code: "NODE_NODEJS", title: "NODE.JS GATEWAY", tag: "RUNTIME", power: 82,
    desc: "Stateless Node.js services behind a distributed API gateway with Sliding Window, Token Bucket and Leaky Bucket rate limiting, circuit breakers and retries.",
    meta: [["THROUGHPUT", "100K+ REQ/MIN"], ["CLIENT APPS", "1000+"]],
  },

  {
    id: "ai", label: "Agentic AI", x: 510, y: 400, size: 10, group: "ai",
    parent: "root", bus: 480, code: "NODE_AGENTIC_AI", title: "AGENTIC AI", tag: "LLM ENGINEERING", power: 90,
    desc: "LangGraph agents with RAG, tool calling and persistent memory. In BusinessBot AI they handle 70%+ of routine business operations.",
    meta: [["ORCHESTRATION", "LANGGRAPH"], ["MEMORY", "PERSISTENT"]],
  },
  {
    id: "langgraph", label: "LangGraph Agents", x: 390, y: 190, size: 8, group: "ai",
    parent: "ai", bus: 345, code: "NODE_LANGGRAPH", title: "LANGGRAPH AGENTS", tag: "ORCHESTRATION", power: 90,
    desc: "Stateful agent workflows with tool calling and conversational memory. One agent generates full website templates and Dockerfiles, removing 90% of manual deployment effort.",
    meta: [["TOOL CALLING", "ENABLED"], ["MANUAL WORK CUT", "90%"]],
  },
  {
    id: "rag", label: "RAG Pipelines", x: 470, y: 260, size: 8, group: "ai",
    parent: "ai", bus: 345, code: "NODE_RAG", title: "RAG PIPELINES", tag: "RETRIEVAL", power: 88,
    desc: "Retrieval-augmented generation over vector databases, powering both the AI website builder and BusinessBot AI.",
    meta: [["STORE", "VECTOR DATABASE"], ["USED IN", "2 PROJECTS"]],
  },
  {
    id: "langchain", label: "LangChain", x: 550, y: 190, size: 8, group: "ai",
    parent: "ai", bus: 345, code: "NODE_LANGCHAIN", title: "LANGCHAIN", tag: "LLM FRAMEWORK", power: 86,
    desc: "Chains, tools and retrieval wiring for LLM apps, paired with LangGraph for stateful agent flows.",
    meta: [["PAIRED WITH", "LANGGRAPH"], ["USED IN", "2 PROJECTS"]],
  },
  {
    id: "prompt", label: "Prompt + Context", x: 630, y: 260, size: 8, group: "ai",
    parent: "ai", bus: 345, code: "NODE_PROMPTING", title: "PROMPT & CONTEXT ENG.", tag: "LLM CRAFT", power: 84,
    desc: "Prompt engineering and context engineering that keep agent answers grounded in retrieved business data and on task.",
    meta: [["FOCUS", "GROUNDED OUTPUT"], ["APPLIED IN", "AGENT WORKFLOWS"]],
  },

  {
    id: "infra", label: "Data & Infra", x: 830, y: 400, size: 10, group: "infra",
    parent: "root", bus: 480, code: "NODE_INFRA", title: "DATA & INFRA", tag: "PLATFORM", power: 88,
    desc: "PostgreSQL and Redis for data and caching, with Docker, Kubernetes and AWS to ship and scale services.",
    meta: [["DEPLOYS", "ZERO DOWNTIME"], ["TRAFFIC SPIKES", "10X HANDLED"]],
  },
  {
    id: "postgres", label: "PostgreSQL", x: 710, y: 190, size: 8, group: "infra",
    parent: "infra", bus: 345, code: "NODE_POSTGRES", title: "POSTGRESQL", tag: "RELATIONAL DB", power: 90,
    desc: "Cut P99 query latency by 30% with B-Tree indexes and execution plan analysis. Also used for data isolation across 500+ tenant workspaces.",
    meta: [["P99 LATENCY", "-30%"], ["TENANTS", "500+"]],
  },
  {
    id: "redis", label: "Redis", x: 790, y: 260, size: 8, group: "infra",
    parent: "infra", bus: 345, code: "NODE_REDIS", title: "REDIS", tag: "CACHE LAYER", power: 92,
    desc: "In-memory caching and atomic rate limiting with Lua scripts. Cut gateway request latency by 40% and AI response latency by 60%.",
    meta: [["REDIS CACHED", "YES (ACTIVE)"], ["RATE LIMITING", "LUA SCRIPTS"]],
  },
  {
    id: "k8s", label: "Docker + K8s", x: 870, y: 190, size: 8, group: "infra",
    parent: "infra", bus: 345, code: "NODE_KUBERNETES", title: "DOCKER + KUBERNETES", tag: "DEPLOYMENT", power: 86,
    desc: "Containerized services with Kubernetes rolling updates and Horizontal Pod Autoscaling, handling 10x traffic spikes without downtime.",
    meta: [["ROLLOUTS", "ZERO DOWNTIME"], ["AUTOSCALING", "HPA"]],
  },
  {
    id: "aws", label: "AWS + Terraform", x: 950, y: 260, size: 8, group: "infra",
    parent: "infra", bus: 345, code: "NODE_AWS", title: "AWS & TERRAFORM", tag: "CLOUD", power: 78,
    desc: "Hands-on with EC2, Elastic Beanstalk, Lambda, S3 and IAM, plus Terraform and Jenkins for infrastructure and CI.",
    meta: [["CERTIFIED", "CLOUD PRACTITIONER"], ["IAC", "TERRAFORM"]],
  },
];

const BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

function chainOf(id) {
  const out = [];
  let n = BY_ID[id];
  while (n) {
    out.push(n.id);
    n = BY_ID[n.parent];
  }
  return out;
}


export default function SkillTree() {
  const [selected, setSelected] = useState("root");
  const [hovered, setHovered] = useState(null);

  const activeId = hovered ?? selected;
  const active = BY_ID[activeId];
  const chain = chainOf(activeId);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-16">
      <div className="mb-10 text-center">
        <h2 className="pixel text-3xl tracking-widest text-orange-500 [text-shadow:0_0_14px_rgba(249,115,22,0.7)] md:text-4xl">
          [ SKILL TREE ARCHITECTURE ]
        </h2>
        <p className="mt-3 font-mono text-sm text-gray-300">
          Click or hover nodes to inspect my backend, GenAI &amp; agentic AI stack
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.9fr_1fr]">
        <div className="border-2 border-orange-600 bg-[#120706]/80 p-4 shadow-[0_0_30px_rgba(255,90,0,0.15)]">
          <p className="pixel text-xs tracking-wider text-orange-500">
            SYSTEM_TREE // AMBER CIRCUIT MAP
          </p>
          <div className="overflow-x-auto">
            <svg
              viewBox="0 0 1020 630"
              className="mt-2 h-auto w-full min-w-[680px]"
              role="group"
              aria-label="Skill tree diagram"
            >
              {NODES.filter((n) => n.parent).map((n) => {
                const p = BY_ID[n.parent];
                const lit = chain.includes(n.id);
                return (
                  <path
                    key={n.id}
                    d={`M${n.x} ${n.y + 4} V${n.bus} H${p.x} V${p.y}`}
                    fill="none"
                    stroke={lit ? "#ff7a2f" : "#7c2d12"}
                    strokeWidth={lit ? 2 : 1.5}
                    className="transition-all duration-300"
                    style={lit ? { filter: "drop-shadow(0 0 4px #f97316)" } : undefined}
                  />
                );
              })}

              {NODES.map((n) => {
                const isActive = n.id === activeId;
                const color = COLORS[n.group];
                const s = n.size;
                const hitW = s <= 8 ? 76 : 150;
                return (
                  <g
                    key={n.id}
                    role="button"
                    tabIndex={0}
                    aria-label={`Inspect ${n.label}`}
                    aria-pressed={selected === n.id}
                    className="cursor-pointer outline-none"
                    onMouseEnter={() => setHovered(n.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(n.id)}
                    onBlur={() => setHovered(null)}
                    onClick={() => setSelected(n.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelected(n.id);
                      }
                    }}
                  >
                    
                    <rect x={n.x - hitW / 2} y={n.y - 14} width={hitW} height="62" fill="transparent" />

                    <rect
                      x={n.x - s / 2}
                      y={n.y - s / 2}
                      width={s}
                      height={s}
                      fill={color}
                      className={isActive ? "motion-safe:animate-pulse" : ""}
                      style={{
                        transform: isActive ? "scale(1.5)" : "scale(1)",
                        transformBox: "fill-box",
                        transformOrigin: "center",
                        transition: "transform 200ms",
                        filter: isActive ? `drop-shadow(0 0 6px ${color})` : "none",
                      }}
                    />

                    <text
                      x={n.x}
                      y={n.y + (s > 12 ? 36 : 25)}
                      textAnchor="middle"
                      fontSize="15"
                      fill={isActive ? "#ffffff" : "#e5e7eb"}
                      stroke="#120706"
                      strokeWidth="5"
                      strokeLinejoin="round"
                      paintOrder="stroke"
                      className="font-mono"
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
              <g transform="translate(0 612)">
                {LEGEND.map((item, i) => (
                  <g key={item.group} transform={`translate(${280 + i * 170} 0)`}>
                    <rect width="12" height="10" fill={COLORS[item.group]} />
                    <text x="22" y="9" fontSize="12" fill="#d1d5db" className="font-mono">
                      {item.label}
                    </text>
                  </g>
                ))}
              </g>
            </svg>
          </div>
        </div>

        <aside
          aria-live="polite"
          className="border-2 border-dashed border-orange-600 bg-[#120706]/80 p-6"
        >
          <div className="flex items-center justify-between border-b border-orange-900 pb-3">
            <span className="pixel text-xs tracking-wider text-orange-500">INSPECTOR.EXE</span>
            <span className="font-mono text-xs text-white">{active.code}</span>
          </div>

          <h3 className="pixel mt-5 text-2xl tracking-wider text-orange-500">
            {active.title}
          </h3>

          <span className="pixel mt-3 inline-block border border-orange-600 px-2 py-0.5 text-xs text-orange-500">
            {active.tag}
          </span>

          <p className="mt-5 min-h-[9.5rem] font-mono text-sm leading-7 text-gray-300">
            {active.desc}
          </p>

          <div className="mt-4 border-t border-orange-900 pt-4">
            <div className="flex items-end justify-between font-mono text-xs">
              <span className="text-gray-300">STACK POWER:</span>
              <span className="pixel text-sm text-orange-500">{active.power}%</span>
            </div>

            <div
              className="mt-2 h-3 border border-orange-600 p-[2px]"
              role="progressbar"
              aria-valuenow={active.power}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full bg-orange-600 shadow-[0_0_8px_#ea580c] transition-[width] duration-500 ease-out"
                style={{ width: `${active.power}%` }}
              />
            </div>
          </div>

          <dl className="mt-6 space-y-5 font-mono text-xs">
            {active.meta.map(([key, value]) => (
              <div key={key} className="flex items-center justify-between gap-4">
                <dt className="text-gray-300">{key}:</dt>
                <dd className="text-right text-orange-500">{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </div>
  );
}