export type DemoCollection = {
  name: string;
  color: string;
  active: boolean;
};

export type ChatDemoScenario = {
  id: string;
  collections: DemoCollection[];
  question: string;
  answer: string;
  citations: string[];
};

export const heroDemoScenarios: ChatDemoScenario[] = [
  {
    id: "nda-termination",
    collections: [
      { name: "Contract Review", color: "#7ea7e9", active: true },
      { name: "Research Papers", color: "#44b48b", active: false },
    ],
    question: "What are the termination clauses in the NDA?",
    answer:
      "Either party may terminate with 30 days written notice. Confidentiality obligations survive termination for 3 years per Section 7.2.",
    citations: ["NDA_2024.pdf · p.4", "NDA_2024.pdf · p.7"],
  },
  {
    id: "research-methods",
    collections: [
      { name: "Contract Review", color: "#7ea7e9", active: false },
      { name: "Research Papers", color: "#44b48b", active: true },
    ],
    question: "What sample size did the authors use in the trial?",
    answer:
      "The study enrolled 412 participants across three sites. The power analysis assumed an effect size of 0.35 at 80% power (α = 0.05).",
    citations: ["Chen_2024.pdf · p.12", "Chen_2024.pdf · p.18"],
  },
  {
    id: "clinical-followup",
    collections: [
      { name: "Clinical Notes", color: "#e07a5f", active: true },
      { name: "Protocols", color: "#9b87f5", active: false },
    ],
    question: "When is the follow-up visit required for high-risk patients?",
    answer:
      "High-risk patients require follow-up within 14 days of discharge. Labs should be rechecked at 7 days if creatinine rose above baseline.",
    citations: ["Discharge_Protocol.pdf · p.3", "Discharge_Protocol.pdf · p.9"],
  },
];

/** Fixed scenario for the container scroll tablet — same UI shell as hero, different Q&A */
export const containerScrollScenario: ChatDemoScenario = {
  id: "vendor-liability",
  collections: [
    { name: "Contract Review", color: "#7ea7e9", active: true },
    { name: "Vendor Agreements", color: "#9b87f5", active: false },
  ],
  question: "What is the liability cap if either party breaches?",
  answer:
    "Total aggregate liability is capped at fees paid in the twelve months before the claim, except for confidentiality or indemnification breaches.",
  citations: ["Vendor_Agreement_2024.pdf · p.4", "Vendor_Agreement_2024.pdf · p.11"],
};
