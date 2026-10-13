import { useEffect, useState } from "react";

const nodes = [
  { icon: "🌐", title: "Browser", subtitle: "Client" },
  { icon: "⚡", title: "FastAPI", subtitle: "Backend" },
  { icon: "🟠", title: "Redis", subtitle: "Cache" },
  { icon: "🐘", title: "PostgreSQL", subtitle: "Database" },
];

const services = ["API", "Redis", "RabbitMQ", "Database"];

export default function SystemArchitecture() {
  const [activeNode, setActiveNode] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveNode((prev) => (prev + 1) % nodes.length);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-2 border-orange-600 bg-[#1a0908] shadow-[0_0_30px_rgba(255,120,0,0.2)]">
      {/* Header */}
      <div className="border-b border-orange-600 px-5 py-3">
        <h2 className="text-sm font-bold tracking-wide">SYSTEM STATUS</h2>
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

      {/* Services */}
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