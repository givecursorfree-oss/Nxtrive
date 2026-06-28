import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode, type Ref } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "ghost" | "outline";
type ButtonSize = "default" | "sm" | "lg";

type SharedProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconRight?: ReactNode;
};

type ButtonAsButton = SharedProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = SharedProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsLink;

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-deep-indigo text-white shadow-subtle hover:bg-midnight-teal hover:shadow-sm focus-visible:ring-2 focus-visible:ring-deep-indigo/30",
  ghost: "bg-transparent text-deep-ink hover:text-deep-indigo px-4 py-3",
  outline:
    "border border-mist bg-card-white text-deep-ink shadow-subtle-2 hover:border-fog hover:text-deep-indigo",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "min-h-9 gap-1.5 px-3 py-2 type-button",
  default: "min-h-11 gap-2 px-5 py-3 type-button",
  lg: "min-h-12 gap-2 px-5 py-3 type-button",
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "default",
    className,
    children,
    icon,
    iconRight,
    href,
    ...props
  },
  ref,
) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-button type-button no-underline transition-[transform,box-shadow,color,background-color,border-color] duration-200 ease-out",
    "focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
    "motion-safe:active:scale-[0.98] [&_svg]:size-5 [&_svg]:shrink-0",
    variantClasses[variant],
    sizeClasses[size],
    className,
  );

  const content = (
    <>
      {icon}
      {children ? <span>{children}</span> : null}
      {iconRight}
    </>
  );

  if (href) {
    return (
      <a ref={ref as Ref<HTMLAnchorElement>} href={href} className={classes} {...(props as AnchorHTMLAttributes<HTMLAnchorElement>)}>
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref as Ref<HTMLButtonElement>}
      type={(props as ButtonHTMLAttributes<HTMLButtonElement>).type ?? "button"}
      className={classes}
      {...(props as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});
