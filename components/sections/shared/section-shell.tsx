import { cn } from "@/lib/utils";
import type { SectionBase } from "@/types";

const themeClasses: Record<NonNullable<SectionBase["theme"]>, string> = {
  cream: "bg-cream text-ink",
  "warm-gray": "bg-warm-gray text-ink",
  ink: "bg-ink text-cream",
  blush: "bg-blush text-ink",
};

interface SectionShellProps extends SectionBase {
  children: React.ReactNode;
  className?: string;
  fullBleed?: boolean;
  padding?: boolean;
}

export function SectionShell({
  id,
  theme = "cream",
  children,
  className,
  fullBleed = false,
  padding = true,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn(themeClasses[theme], padding && "section-padding", className)}
    >
      <div className={cn(!fullBleed && "container-glow")}>{children}</div>
    </section>
  );
}
