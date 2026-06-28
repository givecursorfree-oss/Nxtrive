import { BrandLogoMark } from "@/components/marketing/icons";
import { BRAND_LOGO_MARK_SRC, BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";
import { cn } from "@/lib/utils";

type BrandLockupProps = {
  showTagline?: boolean;
  /** Tighter mark crop + offsets for the fixed site header */
  variant?: "default" | "nav";
  className?: string;
  logoClassName?: string;
  wordmarkClassName?: string;
};

export function BrandLockup({
  showTagline = false,
  variant = "default",
  className,
  logoClassName,
  wordmarkClassName,
}: BrandLockupProps) {
  const isNav = variant === "nav";

  const mark = isNav ? (
    <span className="brand-lockup__mark shrink-0" aria-hidden>
      <img src={BRAND_LOGO_MARK_SRC} alt="" className="brand-lockup__mark-image" />
    </span>
  ) : (
    <BrandLogoMark className={logoClassName} />
  );

  return (
    <span
      className={cn(
        "brand-lockup inline-flex min-w-0 items-center gap-2.5 sm:gap-3",
        isNav && "brand-lockup--nav",
        className,
      )}
    >
      {mark}
      {showTagline ? (
        <span className="flex min-w-0 flex-col justify-center gap-0.5">
          <span
            className={cn(
              "brand-lockup__wordmark type-nav-wordmark truncate text-deep-ink",
              wordmarkClassName,
            )}
          >
            {BRAND_NAME}
          </span>
          <span className="type-body-sm leading-snug text-slate">{BRAND_TAGLINE}</span>
        </span>
      ) : (
        <span
          className={cn(
            "brand-lockup__wordmark type-nav-wordmark truncate text-deep-ink",
            wordmarkClassName,
          )}
        >
          {BRAND_NAME}
        </span>
      )}
    </span>
  );
}
