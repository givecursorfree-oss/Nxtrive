import { AppMockupShell } from "@/components/marketing/AppMockupShell";

export function AppMockup() {
  return (
    <AppMockupShell>
      <div className="flex flex-1 flex-col justify-end space-y-3 overflow-hidden p-3 md:p-4">
        <div className="type-body-sm ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-deep-indigo px-3 py-2 leading-relaxed text-white">
          What are the termination clauses in the NDA?
        </div>
        <div className="type-body-sm max-w-[92%] rounded-xl rounded-tl-sm bg-white/5 px-3 py-2 leading-relaxed text-white/85">
          Either party may terminate with 30 days written notice. Confidentiality obligations survive
          termination for 3 years per Section 7.2.
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="type-label-mono inline-flex items-center rounded-full bg-mint/15 px-2 py-0.5 text-mint">
              NDA_2024.pdf · p.4
            </span>
            <span className="type-label-mono inline-flex items-center rounded-full bg-sky-blue/15 px-2 py-0.5 text-sky-blue">
              NDA_2024.pdf · p.7
            </span>
          </div>
        </div>
      </div>
    </AppMockupShell>
  );
}
