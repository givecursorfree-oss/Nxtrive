import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
};

const LOGO_SIZE = "h-10 w-10 object-contain";

function PlatformLogoImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      className={cn(LOGO_SIZE, className)}
      loading="lazy"
      decoding="async"
    />
  );
}

export function WindowsLogo({ className }: LogoProps) {
  return <PlatformLogoImage src="/logos/windows.svg" alt="Windows" className={className} />;
}

export function AppleLogo({ className }: LogoProps) {
  return <PlatformLogoImage src="/logos/apple.svg" alt="Apple macOS" className={className} />;
}

export function LinuxLogo({ className }: LogoProps) {
  return (
    <PlatformLogoImage src="/logos/linux-logo.wine.svg" alt="Linux" className={className} />
  );
}
