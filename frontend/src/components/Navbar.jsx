import { useEffect, useState } from "react";

const links = [
  { id: "home", num: "01", label: "HOME" },
  { id: "about", num: "02", label: "ABOUT" },
  { id: "skills", num: "03", label: "SKILL TREE" },
  { id: "contact", num: "04", label: "CONTACT" },
];

export default function Navbar() {
  const [active, setActive] = useState("home");
  const [sfx, setSfx] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-40% 0px -55% 0px" }
    );

    links.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-900/60 bg-black/70 backdrop-blur-md">
      <nav className="mx-auto flex h-20 max-w-6xl items-center justify-between px-6">

        <a href="#home" className="flex items-center gap-2">
          <span className="text-orange-500">&gt;</span>
          <span className="pixel text-lg tracking-wide text-orange-400">
            PRATUL.DEV
          </span>
          <span className="cursor-blink ml-1 inline-block h-4 w-2 bg-orange-500" />
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map(({ id, num, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`group flex items-center gap-1 font-mono text-sm tracking-wider transition-colors duration-200 ${
                  active === id
                    ? "text-orange-400 [text-shadow:0_0_8px_rgba(249,115,22,0.7)]"
                    : "text-gray-400 hover:text-orange-300"
                }`}
              >
                <span className="transition-transform duration-200 group-hover:-translate-x-1">
                  [
                </span>
                {num} {label}
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  ]
                </span>
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => setSfx((s) => !s)}
            className="flex items-center gap-2 border border-orange-900 bg-orange-950/40 px-3 py-1.5 font-mono text-xs text-orange-400 transition hover:border-orange-500"
          >
            <span>{sfx ? "🔊" : "🔇"}</span>
            SYNTH: {sfx ? "ON" : "OFF"}
          </button>

          <a
            href="#system-status"
            className="pixel border border-orange-700 bg-orange-950/60 px-4 py-1.5 text-xs text-white transition hover:bg-orange-600 hover:shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          >
            TERMINAL
          </a>
        </div>

        <button
          onClick={() => setOpen((o) => !o)}
          className="font-mono text-2xl text-orange-400 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </nav>

      {open && (
        <div className="border-t border-orange-900/60 bg-black/90 px-6 py-4 md:hidden">
          <ul className="flex flex-col gap-4 font-mono text-sm">
            {links.map(({ id, num, label }) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  onClick={() => setOpen(false)}
                  className={active === id ? "text-orange-400" : "text-gray-400"}
                >
                  [{num} {label}]
                </a>
              </li>
            ))}
            <li>
              <a href="#system-status" onClick={() => setOpen(false)} className="text-orange-300">
                [TERMINAL]
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}