import { useState } from "react";

const BACKEND = "#ff5a14";
const AGENTIC = "#ffa23a";
const INFRA = "#d9602f";

const SKILLS = [
  {
    name: "Python + AsyncIO", group: "Backend", color: BACKEND, short: "Py",
    icon: "python/python-original", level: 92,
    about: "My main language. I write async-first services that juggle many I/O calls without blocking.",
    did: ["Async API clients and workers", "Concurrent LLM + DB calls", "Typed, tested production code"],
  },
  {
    name: "FastAPI", group: "Backend", color: BACKEND, short: "FA",
    icon: "fastapi/fastapi-original", level: 90,
    about: "My go-to for fast, typed REST APIs with automatic docs and validation.",
    did: ["Pydantic-validated models", "Auth, middleware, streaming", "Serving RAG and agent APIs"],
  },
  {
    name: "Django", group: "Backend", color: BACKEND, short: "Dj",
    icon: "django/django-plain", mono: true, level: 82,
    about: "Batteries-included framework for projects that need ORM, admin and auth from day one.",
    did: ["DRF APIs", "Admin dashboards", "Migrations and ORM tuning"],
  },
  {
    name: "Node.js Gateway", group: "Backend", color: BACKEND, short: "Nd",
    icon: "nodejs/nodejs-original", level: 75,
    about: "A thin gateway in front of Python services for routing, auth and request shaping.",
    did: ["API gateway and proxying", "Rate limits and token checks", "WebSocket glue"],
  },
  {
    name: "LangGraph Agents", group: "Agentic AI", color: AGENTIC, short: "LG",
    icon: "", level: 88,
    about: "Stateful multi-step agents modelled as graphs, with branching, tools and human checkpoints.",
    did: ["Multi-agent workflows", "Tool-calling with retries", "Persistent memory"],
  },
  {
    name: "LangChain", group: "Agentic AI", color: AGENTIC, short: "LC",
    icon: "", level: 86,
    about: "Chains, retrievers and tool wrappers that keep my LLM layer provider-agnostic.",
    did: ["Custom tools and retrievers", "Structured output parsing", "Swappable model providers"],
  },
  {
    name: "RAG Pipelines", group: "Agentic AI", color: AGENTIC, short: "RG",
    icon: "", level: 90,
    about: "End-to-end retrieval: ingestion, chunking, embeddings, search and grounded answers.",
    did: ["Chunking strategies", "Hybrid search + reranking", "Retrieval evaluation"],
  },
  {
    name: "Prompt + Context", group: "Agentic AI", color: AGENTIC, short: "PC",
    icon: "", level: 88,
    about: "Deciding what the model sees, in what order, and within what budget.",
    did: ["System prompts, few-shot design", "Context window budgeting", "Guardrails and schemas"],
  },
  {
    name: "PostgreSQL", group: "Data & Infra", color: INFRA, short: "Pg",
    icon: "postgresql/postgresql-original", level: 85,
    about: "My primary datastore, with pgvector when embeddings belong next to the data.",
    did: ["Schema design and indexing", "Query optimization", "Vector search"],
  },
  {
    name: "Redis", group: "Data & Infra", color: INFRA, short: "Rd",
    icon: "redis/redis-original", level: 80,
    about: "Caching, queues and short-lived state that keep services and agents quick.",
    did: ["Response/embedding caches", "Task queues", "Session and agent state"],
  },
  {
    name: "Docker + K8s", group: "Data & Infra", color: INFRA, short: "Dk",
    icon: "docker/docker-original", level: 80,
    about: "Every service is containerized and shipped on Kubernetes for repeatable releases.",
    did: ["Multi-stage builds", "Deployments and services", "Config and secrets"],
  },
  {
    name: "AWS + Terraform", group: "Data & Infra", color: INFRA, short: "Aw",
    icon: "terraform/terraform-original", level: 72,
    about: "Cloud infrastructure as code. AWS Certified Cloud Practitioner (CLF-C02).",
    did: ["Terraform provisioning", "Core compute/storage/network", "Per-stage environments"],
  },
];

const GROUPS = ["All", "Backend", "Agentic AI", "Data & Infra"];
const CDN = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";

function Logo({ skill, size = "h-20 w-20" }) {
  const [failed, setFailed] = useState(false);
  if (!skill.icon || failed) {
    return (
      <div
        className={`${size} grid place-items-center rounded-full border-2 text-3xl small-pixel`}
        style={{ borderColor: skill.color, color: skill.color }}
      >
        {skill.short}
      </div>
    );
  }
  return (
    <img
      src={`${CDN}${skill.icon}.svg`}
      alt=""
      onError={() => setFailed(true)}
      className={`${size} object-contain drop-shadow-[0_0_12px_rgba(255,162,58,.35)] ${
        skill.mono ? "brightness-0 invert" : ""
      }`}
    />
  );
}

function SkillCard({ skill }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-pressed={flipped}
      aria-label={`${skill.name}. ${flipped ? "Show logo" : "Show details"}`}
      style={{ "--c": skill.color }}
      className="group aspect-[5/7] w-full text-left outline-none [perspective:1100px]
                 focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-[var(--c)]"
    >
      <div
        className={`relative h-full w-full rounded-xl transition-transform duration-500 ease-out
                    [transform-style:preserve-3d] motion-reduce:transition-none
                    group-hover:-translate-y-1
                    ${flipped ? "[transform:rotateY(180deg)]" : ""}`}
      >
        {/* ───────── FRONT ───────── */}
        <div
          aria-hidden={flipped}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border-2 border-[var(--c)]
                     bg-[#140b07] p-2 shadow-[0_0_0_1px_#000,0_0_18px_-4px_var(--c)]
                     [backface-visibility:hidden] [-webkit-backface-visibility:hidden]
                     group-hover:shadow-[0_0_0_1px_#000,0_0_26px_0_var(--c)]"
        >
          {/* top row: power + type */}
          <div className="flex items-center justify-between px-1 pb-1.5">
            <span className="grid h-7 min-w-7 place-items-center rounded-full border border-[var(--c)] px-1 text-xs font-bold text-[var(--c)]">
              {skill.level}
            </span>
            <span className="text-[10px] text-[#c9a98f]">{skill.group}</span>
          </div>

          {/* art window */}
          <div className="relative grid flex-1 place-items-center overflow-hidden rounded-md border border-[var(--c)]/60
                          bg-[radial-gradient(circle_at_50%_40%,rgba(255,120,40,.28),#0a0605_70%)]">
            <Logo skill={skill} />
            {/* holo sweep */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(110deg,transparent_35%,rgba(255,200,120,.28)_50%,transparent_65%)]
                            transition-transform duration-700 group-hover:translate-x-full motion-reduce:hidden" />
          </div>

          {/* name banner */}
          <div className="mt-2 rounded-md border border-[var(--c)] bg-[var(--c)]/10 px-2 py-1.5 text-center">
            <div className="text-[13px] font-bold leading-tight text-[#f5e3d0]">{skill.name}</div>
          </div>
          <div className="pt-1.5 text-center text-[10px] text-[#8c6b55]">Tap to flip</div>
        </div>

        {/* ───────── BACK ───────── */}
        <div
          aria-hidden={!flipped}
          className="absolute inset-0 flex flex-col overflow-hidden rounded-xl border-2 border-[var(--c)]
                     bg-[#1a0e09] p-3 shadow-[0_0_22px_-2px_var(--c)]
                     [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          <div className="flex items-start justify-between gap-2 border-b border-[var(--c)]/40 pb-2">
            <div>
              <div className="text-sm font-bold leading-tight text-[var(--c)]">{skill.name}</div>
              <div className="text-[10px] text-[#c9a98f]">{skill.group}</div>
            </div>
            <Logo skill={skill} size="h-8 w-8 text-sm" />
          </div>

          <p className="mt-2 text-[11px] leading-relaxed text-[#f0d9c4]">{skill.about}</p>

          <div className="mt-3">
            <div className="mb-1 flex justify-between text-[10px] text-[#c9a98f]">
              <span>Proficiency</span>
              <span className="font-bold text-[var(--c)]">{skill.level}%</span>
            </div>
            <div className="h-2 rounded-sm border border-[var(--c)] p-px">
              <div className="h-full bg-[var(--c)]" style={{ width: `${skill.level}%` }} />
            </div>
          </div>

          <ul className="mt-3 space-y-1 overflow-auto text-[11px] text-[#f0d9c4]">
            {skill.did.map((d) => (
              <li key={d} className="flex gap-1.5">
                <span className="text-[var(--c)]">▸</span>
                <span>{d}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </button>
  );
}

export default function SkillCards() {
  const [group, setGroup] = useState("All");
  const shown = SKILLS.filter((s) => group === "All" || s.group === group);

  return (
    <section id="skills" className="mx-auto max-w-6xl px-5 py-16">
      <h2 className="text-center text-3xl pixel text-[#ff5a14] sm:text-5xl">
        [ SKILL DECK ]
      </h2>
      <p className="mt-3 text-center text-sm text-[#f0d9c4 small-pixel]">
        Tap a card to flip it and see how I use that skill.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2" role="group" aria-label="Filter skills">
        {GROUPS.map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => setGroup(g)}
            aria-pressed={group === g}
            className={`border px-3 py-1.5 text-xs transition-colors ${
              group === g
                ? "border-[#ff5a14] bg-[#ff5a14] text-[#0a0605]"
                : "border-[#4a2312] text-[#9a7a63] hover:text-[#f0d9c4]"
            }`}
          >
            {g}
          </button>
        ))}
      </div>

      <div className="mx-auto mt-10 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 lg:gap-6">
        {shown.map((s) => (
          <SkillCard key={s.name} skill={s} />
        ))}
      </div>
    </section>
  );
}