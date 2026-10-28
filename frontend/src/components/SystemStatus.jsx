import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const nodes = [
  { icon: "🌐", title: "Browser", subtitle: "Client" },
  { icon: "⚡", title: "FastAPI", subtitle: "Backend" },
  { icon: "🟠", title: "Redis", subtitle: "Cache" },
  { icon: "🐘", title: "PostgreSQL", subtitle: "Database" },
];

const services = ["API", "Redis", "RabbitMQ", "Database"];


function StatusPanel({ onClose }) {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-2 border-orange-600 bg-[#1a0908] shadow-[0_0_30px_rgba(255,120,0,0.2)]">
      <div className="flex items-center justify-between border-b border-orange-600 px-5 py-3">
        <h2 className="text-sm font-bold tracking-wide">SYSTEM STATUS</h2>
        <button
          onClick={onClose}
          aria-label="Close system status"
          className="text-sm text-orange-500 transition hover:text-white"
        >
          [X]
        </button>
      </div>

      {/* Pipeline */}
      <div className="px-5 py-5">
        {nodes.map((node, index) => (
          <div key={node.title}>
            <div className="flex items-center gap-4">
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border text-xl transition-all duration-500 ${
                  activeNode === index
                    ? "border-orange-400 bg-orange-500/20 shadow-[0_0_20px_#f97316]"
                    : "border-orange-700"
                }`}
              >
                {node.icon}
              </div>

              <div>
                <h3 className="text-sm font-bold leading-tight">{node.title}</h3>
                <p className="text-xs text-gray-400">{node.subtitle}</p>
              </div>
            </div>

            {index !== nodes.length - 1 && (
              <div className="relative ml-[21px] h-6 border-l-2 border-dashed border-orange-700">
                {activeNode === index && (
                  <div className="absolute left-[-7px] top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-orange-500 shadow-[0_0_12px_#f97316] animate-bounce" />
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-orange-600 px-5 py-4">
        <h3 className="mb-3 text-sm text-orange-500">SERVICES</h3>

        <div className="space-y-2 text-sm">
          {services.map((name) => (
            <div key={name} className="flex items-center justify-between">
              <span>{name}</span>
              <span className="flex items-center gap-2 text-green-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-400" />
                Healthy
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SystemStatusModal({ open, onClose }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="System status"
    >
      <div className="w-full max-w-md text-white" onClick={(e) => e.stopPropagation()}>
        <StatusPanel onClose={onClose} />
      </div>
    </div>,
    document.body
  );
}

export function SysButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 border border-orange-900 bg-orange-950/40 px-3 py-1.5 font-mono text-xs text-orange-400 transition hover:border-orange-500"
      aria-label="Open system status"
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
      </span>
      SYS
    </button>
  );
}

export default function SystemStatus() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <SysButton onClick={() => setOpen(true)} />
      <SystemStatusModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}