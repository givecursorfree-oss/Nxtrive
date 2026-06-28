import { BrandLockup } from "@/components/marketing/BrandLockup";
import { BRAND_NAME } from "@/lib/brand";
import { externalLinkProps, SITE_LINKS } from "@/lib/site-links";
import { cn } from "@/lib/utils";
import {
  FOOTER_FLICKER_TEXT,
  FOOTER_FLICKER_TEXT_MOBILE,
} from "../../../seo.build.js";
import * as Color from "color-bits";
import { ChevronRight, Lock, ShieldCheck, WifiOff } from "lucide-react";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";

export function getRGBA(
  cssColor: CSSProperties["color"],
  fallback = "rgba(124, 127, 136, 0.85)",
): string {
  if (typeof window === "undefined") return fallback;
  if (!cssColor) return fallback;

  try {
    if (typeof cssColor === "string" && cssColor.startsWith("var(")) {
      const element = document.createElement("div");
      element.style.color = cssColor;
      document.body.appendChild(element);
      const computedColor = window.getComputedStyle(element).color;
      document.body.removeChild(element);
      return Color.formatRGBA(Color.parse(computedColor));
    }

    return Color.formatRGBA(Color.parse(cssColor));
  } catch {
    return fallback;
  }
}

export function colorWithOpacity(color: string, opacity: number): string {
  if (!color.startsWith("rgb")) return color;
  return Color.formatRGBA(Color.alpha(Color.parse(color), opacity));
}

interface FlickeringGridProps extends HTMLAttributes<HTMLDivElement> {
  squareSize?: number;
  gridGap?: number;
  flickerChance?: number;
  color?: string;
  width?: number;
  height?: number;
  maxOpacity?: number;
  text?: string;
  fontSize?: number;
  fontWeight?: number | string;
  /** Pixels to shift label upward from vertical center (CSS px, pre-DPR). */
  textOffsetY?: number;
  /** Scale font down until the label fits the canvas width. */
  autoFitText?: boolean;
}

export function FlickeringGrid({
  squareSize = 3,
  gridGap = 3,
  flickerChance = 0.2,
  color = "#7c7f88",
  width,
  height,
  className,
  maxOpacity = 0.15,
  text = "",
  fontSize = 140,
  fontWeight = 600,
  textOffsetY = 0,
  autoFitText = true,
  ...props
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });

  const memoizedColor = useMemo(() => getRGBA(color), [color]);

  const drawGrid = useCallback(
    (
      ctx: CanvasRenderingContext2D,
      canvasWidth: number,
      canvasHeight: number,
      cols: number,
      rows: number,
      squares: Float32Array,
      dpr: number,
    ) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const maskCanvas = document.createElement("canvas");
      maskCanvas.width = canvasWidth;
      maskCanvas.height = canvasHeight;
      const maskCtx = maskCanvas.getContext("2d", { willReadFrequently: true });
      if (!maskCtx) return;

      if (text) {
        maskCtx.save();
        maskCtx.scale(dpr, dpr);
        maskCtx.fillStyle = "white";
        const fontFamily = '"SuisseIntl", ui-sans-serif, system-ui, sans-serif';
        let effectiveFontSize = fontSize;

        if (autoFitText) {
          const maxTextWidth = (canvasWidth / dpr) * 0.9;
          maskCtx.font = `${fontWeight} ${effectiveFontSize}px ${fontFamily}`;
          while (maskCtx.measureText(text).width > maxTextWidth && effectiveFontSize > 28) {
            effectiveFontSize -= 2;
          }
        }

        maskCtx.font = `${fontWeight} ${effectiveFontSize}px ${fontFamily}`;
        maskCtx.textAlign = "center";
        maskCtx.textBaseline = "middle";
        maskCtx.fillText(
          text,
          canvasWidth / (2 * dpr),
          canvasHeight / (2 * dpr) - textOffsetY,
        );
        maskCtx.restore();
      }

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (squareSize + gridGap) * dpr;
          const y = j * (squareSize + gridGap) * dpr;
          const squareWidth = squareSize * dpr;
          const squareHeight = squareSize * dpr;

          const maskData = maskCtx.getImageData(x, y, squareWidth, squareHeight).data;
          const hasText = maskData.some((value, index) => index % 4 === 0 && value > 0);

          const opacity = squares[i * rows + j];
          const finalOpacity = hasText
            ? Math.min(1, Math.max(opacity * 2 + 0.78, 0.82))
            : Math.max(opacity * 0.45, 0.04);

          ctx.fillStyle = colorWithOpacity(memoizedColor, finalOpacity);
          ctx.fillRect(x, y, squareWidth, squareHeight);
        }
      }
    },
    [memoizedColor, squareSize, gridGap, text, fontSize, fontWeight, textOffsetY, autoFitText],
  );

  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement, nextWidth: number, nextHeight: number) => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = nextWidth * dpr;
      canvas.height = nextHeight * dpr;
      canvas.style.width = `${nextWidth}px`;
      canvas.style.height = `${nextHeight}px`;
      const cols = Math.ceil(nextWidth / (squareSize + gridGap));
      const rows = Math.ceil(nextHeight / (squareSize + gridGap));

      const squares = new Float32Array(cols * rows);
      for (let i = 0; i < squares.length; i++) {
        squares[i] = Math.random() * maxOpacity;
      }

      return { cols, rows, squares, dpr };
    },
    [squareSize, gridGap, maxOpacity],
  );

  const updateSquares = useCallback(
    (squares: Float32Array, deltaTime: number) => {
      for (let i = 0; i < squares.length; i++) {
        if (Math.random() < flickerChance * deltaTime) {
          squares[i] = Math.random() * maxOpacity;
        }
      }
    },
    [flickerChance, maxOpacity],
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduceMotion(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    let gridParams = setupCanvas(canvas, 0, 0);

    const updateCanvasSize = () => {
      const newWidth = width || container.clientWidth;
      const newHeight = height || container.clientHeight;
      setCanvasSize({ width: newWidth, height: newHeight });
      gridParams = setupCanvas(canvas, newWidth, newHeight);
    };

    const drawStaticFrame = () => {
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
    };

    const refreshGrid = () => {
      updateCanvasSize();
      drawStaticFrame();
    };

    refreshGrid();

    let lastTime = 0;
    const animate = (time: number) => {
      if (!isInView || reduceMotion) return;

      const deltaTime = Math.max((time - lastTime) / 1000, 0.016);
      lastTime = time;

      updateSquares(gridParams.squares, deltaTime);
      drawGrid(
        ctx,
        canvas.width,
        canvas.height,
        gridParams.cols,
        gridParams.rows,
        gridParams.squares,
        gridParams.dpr,
      );
      animationFrameId = requestAnimationFrame(animate);
    };

    const resizeObserver = new ResizeObserver(refreshGrid);
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    if (isInView && !reduceMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
    };
  }, [setupCanvas, updateSquares, drawGrid, width, height, isInView, reduceMotion]);

  return (
    <div ref={containerRef} className={cn("h-full w-full", className)} {...props}>
      <canvas
        ref={canvasRef}
        className="pointer-events-none"
        style={{ width: canvasSize.width, height: canvasSize.height }}
      />
    </div>
  );
}

function useMediaQuery(query: string) {
  const [value, setValue] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const onChange = () => setValue(mediaQuery.matches);

    onChange();
    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, [query]);

  return value;
}

const trustBadges = [
  { icon: WifiOff, label: "100% offline inference" },
  { icon: Lock, label: "Data stays on your device" },
  { icon: ShieldCheck, label: "MIT open source" },
] as const;

export const footerSiteConfig = {
  description: `${BRAND_NAME} is a local RAG desktop app for Windows, macOS, and Linux. Chat with PDFs, Word docs, and code using an offline LLM — no cloud uploads, API keys, or account required.`,
  footerLinks: [
    {
      title: "Product",
      links: [
        { id: 1, title: "Features", url: SITE_LINKS.features },
        { id: 2, title: "How it works", url: SITE_LINKS.howItWorks },
        { id: 3, title: "Use cases", url: SITE_LINKS.useCases },
        { id: 4, title: "Download", url: SITE_LINKS.download },
      ],
    },
    {
      title: "Resources",
      links: [
        { id: 5, title: "Documentation", url: SITE_LINKS.docs, external: true },
        { id: 6, title: "GitHub", url: SITE_LINKS.github, external: true },
        { id: 7, title: "Releases", url: SITE_LINKS.releases, external: true },
        { id: 8, title: "MIT License", url: SITE_LINKS.license, external: true },
      ],
    },
    {
      title: "Help",
      links: [
        { id: 9, title: "FAQ", url: SITE_LINKS.faq },
        { id: 10, title: "Supported formats", url: "#supported-formats" },
        { id: 11, title: "System requirements", url: "#system-requirements" },
        { id: 12, title: "Release notes", url: SITE_LINKS.releaseNotes, external: true },
      ],
    },
  ],
} as const;

function FooterLink({
  href,
  external,
  children,
}: {
  href: string;
  external?: boolean;
  children: ReactNode;
}) {
  if (external) {
    return (
      <a
        href={href}
        className="no-underline"
        {...externalLinkProps(typeof children === "string" ? children : "External link")}
      >
        {children}
      </a>
    );
  }

  return (
    <a href={href} className="no-underline">
      {children}
    </a>
  );
}

export function FlickeringFooter() {
  const tablet = useMediaQuery("(max-width: 1024px)");

  return (
    <footer id="footer" className="w-full border-t border-mist bg-card-white pb-0" aria-labelledby="site-footer-heading">
      <div className="section-container flex flex-col gap-10 p-10 md:flex-row md:items-start md:justify-between">
        <div className="mx-0 flex max-w-sm flex-col items-start justify-start gap-y-5">
          <p id="site-footer-heading" className="sr-only">
            Site footer
          </p>
          <a href={SITE_LINKS.home} className="no-underline">
            <BrandLockup showTagline />
          </a>
          <p className="type-body-sm text-slate">{footerSiteConfig.description}</p>
          <ul className="flex flex-wrap gap-2" aria-label="Trust highlights">
            {trustBadges.map(({ icon: Icon, label }) => (
              <li key={label}>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-mist bg-paper-white px-3 py-1.5 type-body-sm text-graphite">
                  <Icon className="h-4 w-4 text-deep-indigo" strokeWidth={1.75} aria-hidden />
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="w-full md:w-1/2">
          <div className="flex flex-col items-start justify-start gap-y-8 md:flex-row md:items-start md:justify-between lg:pl-10">
            {footerSiteConfig.footerLinks.map((column) => (
              <ul key={column.title} className="flex min-w-[9rem] flex-col gap-y-2">
                <li className="mb-1 type-button text-deep-ink">{column.title}</li>
                {column.links.map((link) => (
                  <li
                    key={link.id}
                    className="group inline-flex cursor-pointer items-center justify-start gap-1 text-[15px]/snug text-slate"
                  >
                    <FooterLink href={link.url} external={"external" in link && link.external}>
                      {link.title}
                    </FooterLink>
                    <span
                      className="flex size-4 translate-x-0 items-center justify-center rounded border border-mist opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100"
                      aria-hidden
                    >
                      <ChevronRight className="h-3.5 w-3.5 text-deep-indigo" />
                    </span>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-0 h-64 w-full overflow-hidden border-t border-mist bg-paper-white md:h-80 lg:h-96">
        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-card-white to-transparent" />
        <div className="absolute inset-0 px-2 sm:px-6 md:px-10">
          <FlickeringGrid
            text={tablet ? FOOTER_FLICKER_TEXT_MOBILE : FOOTER_FLICKER_TEXT}
            fontSize={tablet ? 88 : 96}
            fontWeight={600}
            textOffsetY={0}
            autoFitText
            className="h-full w-full"
            squareSize={3}
            gridGap={2}
            color="#111a4a"
            maxOpacity={0.38}
            flickerChance={0.12}
          />
        </div>
      </div>
    </footer>
  );
}

/** shadcn-style default export name from the source component */
export function Component() {
  return <FlickeringFooter />;
}

export type FooterSiteConfig = typeof footerSiteConfig;
