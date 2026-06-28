import { BRAND_NAME } from "@/lib/brand";
import { BrandLogoMark } from "@/components/marketing/icons";
import { cn } from "@/lib/utils";

function PreviewChrome() {
  return (
    <header className="hero-chat-demo__chrome">
      <div className="hero-chat-demo__chrome-traffic" aria-hidden>
        <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--close" />
        <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--min" />
        <span className="hero-chat-demo__traffic-dot hero-chat-demo__traffic-dot--max" />
      </div>
      <div className="hero-chat-demo__chrome-brand">
        <BrandLogoMark className="!h-6 !w-6" />
        <span className="hero-chat-demo__chrome-title">{BRAND_NAME}</span>
      </div>
      <div className="hero-chat-demo__chrome-spacer" aria-hidden />
    </header>
  );
}

export function StreamingAnswerPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn("hero-chat-demo feature-preview", className)}
      role="img"
      aria-label={`${BRAND_NAME} streaming an answer token by token`}
    >
      <PreviewChrome />
      <div className="feature-preview__body">
        <div className="feature-preview__bubble feature-preview__bubble--user">
          What are the termination clauses in the vendor agreement?
        </div>
        <div className="feature-preview__bubble feature-preview__bubble--assistant">
          <div className="feature-preview__bubble-content">
            <p>
              Either party may terminate with 30 days written notice. Early termination fees apply
              only if{" "}
              <span className="feature-preview__cursor" aria-hidden>
                |
              </span>
            </p>
          </div>
          <div className="feature-preview__composer-bar" aria-hidden>
            <span className="feature-preview__stop">Stop generating</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SourceCitationPreview({ className }: { className?: string }) {
  return (
    <div
      className={cn("hero-chat-demo feature-preview", className)}
      role="img"
      aria-label={`${BRAND_NAME} answer with source citations linked to documents`}
    >
      <PreviewChrome />
      <div className="feature-preview__body">
        <div className="feature-preview__bubble feature-preview__bubble--assistant">
          <div className="feature-preview__bubble-content">
            <p>The liability cap is limited to fees paid in the prior 12 months.</p>
          </div>
          <ul className="feature-preview__citations">
            <li>
              <span className="feature-preview__citation-badge" aria-hidden>
                1
              </span>
              <span className="feature-preview__citation-file">vendor-agreement.pdf</span>
              <span className="feature-preview__citation-page">p. 14</span>
            </li>
            <li>
              <span className="feature-preview__citation-badge" aria-hidden>
                2
              </span>
              <span className="feature-preview__citation-file">nda-template.docx</span>
              <span className="feature-preview__citation-page">§ 8.2</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
