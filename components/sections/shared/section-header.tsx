import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  intro?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  heading,
  subheading,
  intro,
  align = "center",
  className,
}: SectionHeaderProps) {
  if (!heading && !subheading && !intro && !eyebrow) return null;

  return (
    <header
      className={cn(
        "mb-8 max-w-3xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <p className="font-eyebrow">{eyebrow}</p>}
      {heading && <h2 className="text-2xl md:text-3xl">{heading}</h2>}
      {subheading && <p className="text-lg text-muted">{subheading}</p>}
      {intro && <p className="text-muted">{intro}</p>}
    </header>
  );
}
