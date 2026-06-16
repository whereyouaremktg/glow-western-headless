import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CTA } from "@/types";

interface CtaGroupProps {
  ctas: CTA[];
  className?: string;
}

export function CtaGroup({ ctas, className }: CtaGroupProps) {
  if (!ctas.length) return null;

  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {ctas.map((cta) => (
        <Button key={`${cta.href}-${cta.label}`} variant={cta.variant ?? "primary"} asChild>
          <Link href={cta.href}>{cta.label}</Link>
        </Button>
      ))}
    </div>
  );
}
