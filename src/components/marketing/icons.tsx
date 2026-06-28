import type { ComponentProps } from "react";
import {
  ArrowRight,
  ArrowUp,
  Code,
  Database,
  ExternalLink,
  Fingerprint,
  FolderDown,
  GraduationCap,
  Heart,
  Key,
  Lock,
  Menu,
  MessagesSquare,
  Paperclip,
  Scale,
  ShieldCheck,
  UserCircle,
  Users,
  WifiOff,
  X,
  type LucideIcon,
} from "lucide-react";
import { BRAND_LOGO_MARK_SRC } from "@/lib/brand";
import { cn } from "@/lib/utils";

type IconProps = ComponentProps<"svg">;

/** Consistent marketing icon scale — min 20px, default 24px */
export const iconSizes = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
  xxl: "h-16 w-16",
} as const;

const STROKE = 1.75;

function iconClass(className?: string) {
  return className ?? iconSizes.md;
}

function outlineIcon(Icon: LucideIcon) {
  return function MarketingIcon({ className, ...props }: IconProps) {
    return (
      <Icon className={iconClass(className)} aria-hidden strokeWidth={STROKE} {...props} />
    );
  };
}

export const LockLogo = outlineIcon(Lock);

export function ShieldIcon({ className, ...props }: IconProps) {
  return (
    <ShieldCheck
      className={iconClass(className)}
      aria-hidden
      strokeWidth={STROKE}
      fill="currentColor"
      {...props}
    />
  );
}

export const WifiOffIcon = outlineIcon(WifiOff);
export const KeyIcon = outlineIcon(Key);
export const FolderArrowIcon = outlineIcon(FolderDown);
export const DatabaseLockIcon = outlineIcon(Database);
export const ChatCheckIcon = outlineIcon(MessagesSquare);
export const ArrowRightIcon = outlineIcon(ArrowRight);
export const MenuIcon = outlineIcon(Menu);
export const CloseIcon = outlineIcon(X);
export const ExternalLinkIcon = outlineIcon(ExternalLink);
export const PaperClipIcon = outlineIcon(Paperclip);
export const UserCircleIcon = outlineIcon(UserCircle);
export const ArrowUpIcon = outlineIcon(ArrowUp);

export function LockLogoSolid({ className, ...props }: IconProps) {
  return (
    <Lock
      className={iconClass(className)}
      aria-hidden
      strokeWidth={STROKE}
      fill="currentColor"
      {...props}
    />
  );
}

export const ShieldCheckOutline = outlineIcon(ShieldCheck);

/** Use-case persona icons */
export const LegalComplianceIcon = outlineIcon(Scale);
export const ClinicalIcon = outlineIcon(Heart);
export const ResearchersIcon = outlineIcon(GraduationCap);
export const DevelopersIcon = outlineIcon(Code);
export const TeamsIcon = outlineIcon(Users);
export const PrivacyIcon = outlineIcon(Fingerprint);

export { AppleLogo, LinuxLogo, WindowsLogo } from "@/components/marketing/platform-logos";

/** Brand logo mark for nav, footer, and product chrome */
export function BrandLogoMark({
  className,
  iconClassName,
}: {
  className?: string;
  /** @deprecated use className — kept for existing call sites */
  iconClassName?: string;
}) {
  return (
    <img
      src={BRAND_LOGO_MARK_SRC}
      alt=""
      aria-hidden
      className={cn("block h-10 w-10 shrink-0 object-contain", iconClassName, className)}
    />
  );
}
