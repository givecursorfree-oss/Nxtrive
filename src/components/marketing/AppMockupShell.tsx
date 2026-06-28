import type { ReactNode } from "react";
import { BrandLogoMark } from "@/components/marketing/icons";
import { BRAND_NAME } from "@/lib/brand";

const collections = [
  { name: "Contract Review", color: "#7ea7e9", active: true },
  { name: "Research Papers", color: "#44b48b", active: false },
  { name: "Medical Records", color: "#ec652b", active: false },
  { name: "Codebase Docs", color: "#9f7aee", active: false },
];

const sources = [
  { name: "NDA_2024.pdf", type: "pdf" },
  { name: "Vendor_Agreement.docx", type: "docx" },
  { name: "IP_Assignment.pdf", type: "pdf" },
];

function FileIcon({ type }: { type: string }) {
  const label = type === "pdf" ? "PDF" : "DOC";
  const bg = type === "pdf" ? "bg-ember-orange/20 text-ember-orange" : "bg-sky-blue/20 text-sky-blue";
  return (
    <span className={`type-label-mono inline-flex h-6 w-6 shrink-0 items-center justify-center rounded text-[9px] ${bg}`}>
      {label}
    </span>
  );
}

interface AppMockupShellProps {
  children: ReactNode;
  inputHint?: string;
  inputActive?: boolean;
}

export function AppMockupShell({ children, inputHint = "Ask about your documents…", inputActive }: AppMockupShellProps) {
  return (
    <div className="flex h-full min-h-[20rem] flex-col overflow-hidden rounded-card bg-graphite text-card-white md:min-h-[28rem]">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <BrandLogoMark className="!h-5 !w-5" />
        <span className="type-nav-wordmark ml-2 text-white/50">{BRAND_NAME}</span>
      </div>

      <div className="flex min-h-0 flex-1">
        <aside className="hidden w-[38%] shrink-0 border-r border-white/10 p-3 sm:block">
          <p className="type-section-pill mb-2 px-2 text-white/40">Collections</p>
          <ul className="space-y-0.5">
            {collections.map((c) => (
              <li
                key={c.name}
                className={`type-body-sm flex items-center gap-2 rounded-md px-2 py-1.5 ${
                  c.active ? "bg-white/10 text-white" : "text-white/55"
                }`}
              >
                <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: c.color }} />
                {c.name}
              </li>
            ))}
          </ul>

          <p className="type-section-pill mb-2 mt-4 px-2 text-white/40">Sources</p>
          <ul className="space-y-1">
            {sources.map((s) => (
              <li key={s.name} className="type-mono-xs flex items-center gap-2 rounded-md px-2 py-1 text-white/50">
                <FileIcon type={s.type} />
                <span className="truncate">{s.name}</span>
              </li>
            ))}
          </ul>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex min-h-0 flex-1 flex-col justify-end overflow-hidden">{children}</div>

          <div className="border-t border-white/10 px-3 py-2">
            <div className="type-mono-xs flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-white/40">
              <span
                className={`h-1.5 w-1.5 rounded-full bg-mint ${inputActive ? "animate-pulse-dot" : "opacity-40"}`}
              />
              {inputHint}
            </div>
          </div>
        </div>
      </div>

      <footer className="type-mono-xs flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/10 px-3 py-1.5 text-white/45 md:px-4">
        <span className="text-mint">Backend online</span>
        <span>·</span>
        <span>Ollama llama3 · nomic-embed-text</span>
        <span>·</span>
        <span>Local</span>
        <span>·</span>
        <span className="text-white/35">no cloud</span>
      </footer>
    </div>
  );
}
