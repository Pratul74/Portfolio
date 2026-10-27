import React from "react";

const CARDS = [
  {
    id: "02",
    title: "Where I've worked?",
    body: (
      <>
        Backend Developer Intern at <b>Akanksha Foundation</b> (Feb–Jul 2025). Built 15+ Django services that saved
        40+ hours a month and cut P99 PostgreSQL latency by 30%.
      </>
    ),
  },
  {
    id: "03",
    title: "What I've built?",
    body: (
      <>
        A multi-tenant AI website builder for 500+ businesses, BusinessBot AI (25+ APIs, 60% faster responses), and an
        API gateway handling 100K+ requests per minute.
      </>
    ),
  },
  {
    id: "04",
    title: "AI & agents?",
    body: "LangChain, LangGraph, RAG, and vector databases. I build agents with tool calling and persistent memory.",
  },
  {
    id: "05",
    title: "Cloud & DevOps?",
    body: "AWS (EC2, Lambda, S3, IAM), Docker, Kubernetes, Terraform, and Jenkins. AWS Certified Cloud Practitioner.",
  },
  {
    id: "06",
    title: "My engineering philosophy?",
    body: "Design for failure: circuit breakers, retries, fallbacks, and zero-downtime deploys over fail-fast.",
  },
  {
    id: "07",
    title: "Education?",
    body: "B.E. in Computer Science, Cambridge Institute of Technology, Bangalore. CGPA 8.00, 2022–2026.",
  },
  {
    id: "08",
    title: "Core stack?",
    body: "Python, JavaScript, SQL. FastAPI, Django, Node.js, React.js, PostgreSQL, and Redis.",
  },
  {
    id: "09",
    title: "Open to work?",
    hot: true,
    body: "Backend and Gen AI roles. Based in Hyderabad. If you hire me, consider your work done.",
  },
];

const Icon = ({ children }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const LINKS = [
  {
    label: "GITHUB",
    href: "https://github.com/Pratul74",
    external: true,
    icon: (
      <Icon>
        <path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21" />
      </Icon>
    ),
  },
  {
    label: "LINKEDIN",
    href: "https://linkedin.com/in/pratul74",
    external: true,
    icon: (
      <Icon>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2zM4 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4z" />
      </Icon>
    ),
  },
  {
    label: "RESUME",
    href: "/Pratul_Kumar_Resume_v1.pdf",
    external: true,
    icon: (
      <Icon>
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h8" />
      </Icon>
    ),
  },
  {
    label: "EMAIL",
    href: "mailto:pratulkumar2003@gmail.com",
    external: false,
    icon: (
      <Icon>
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-10 6L2 7" />
      </Icon>
    ),
  },
];

function Card({ id, title, hot = false, children }) {
  const base =
    "rounded-lg border p-5 transition-all duration-300 hover:border-orange-500 hover:bg-zinc-900/70";
  const tone = hot
    ? "border-orange-500 bg-orange-500/10"
    : "border-orange-500/20 bg-zinc-900/40";

  return (
    <article className={`${base} ${tone}`}>
      <header className="mb-4 flex items-center gap-3 border-b border-orange-500/20 pb-3">
        <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-bold text-black">{id}</span>
        <h3 className="text-sm font-semibold text-zinc-100">{title}</h3>
      </header>
      <p className="text-sm leading-7 text-zinc-300">{children}</p>
    </article>
  );
}

export default function About() {
  return (
    <section className="relative px-4 py-24 text-zinc-200" id="about">
      <div className="mx-auto mb-10 max-w-6xl">
        <h2 className="text-3xl pixel leading-tight text-zinc-100 md:text-5xl">
          Let's start with my name-<br /><br />
          Pratul Kumar
        </h2>
      </div>

      <div className="mx-auto max-w-6xl overflow-hidden rounded-xl border border-orange-500/30 bg-black/30 backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-orange-500/30 px-6 py-4 text-xs uppercase tracking-[0.2em] text-orange-400">
          <span className="h-2 w-2 rounded-full bg-orange-500" />
          SYS.PROFILE // [DEV_PRATUL]
        </div>

        <div className="space-y-5 p-6">
          <Card id="01" title="What I do?">
            I’m a Python backend engineer building scalable APIs, distributed systems, and AI-powered SaaS products. I
            work with FastAPI, Django, and Node.js, store data in PostgreSQL and Redis, and ship on Docker, Kubernetes,
            and AWS. I’m a 2026 Computer Science graduate who likes turning slow, manual workflows into fast,
            automated ones.
          </Card>

          <div className="grid gap-5 md:grid-cols-2">
            {CARDS.map((c) => (
              <Card key={c.id} id={c.id} title={c.title} hot={c.hot}>
                {c.body}
              </Card>
            ))}
          </div>
        </div>

        <footer className="flex flex-col gap-5 border-t border-orange-500/30 p-6 md:flex-row md:items-center md:justify-between">
          <span className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
            <span className="h-2 w-2 rounded-full bg-orange-500" />
            FIND ME ON:
          </span>

          <nav className="flex flex-wrap items-center gap-2" aria-label="Social and contact links">
            {LINKS.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(l.external ? { target: "_blank", rel: "noreferrer" } : {})}
                className="inline-flex items-center gap-2 rounded-md border border-orange-500/30 px-4 py-2 text-xs font-semibold tracking-wider transition-all hover:bg-orange-500 hover:text-black"
              >
                {l.icon}
                {l.label}
              </a>
            ))}
          </nav>
        </footer>
      </div>
    </section>
  );
}