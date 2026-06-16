import { cn } from "@/lib/utils";
import type { GuaranteeProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionShell } from "./shared/section-shell";

export function Guarantee(props: GuaranteeProps) {
  const { pillars } = props;

  return (
    <SectionShell {...props} theme={props.theme ?? "blush"} padding={false}>
      <MotionSection>
        <ul
          className={cn(
            "grid gap-6 px-6 py-10 text-center md:grid-cols-2 lg:grid-cols-4 lg:gap-8 lg:px-12 lg:py-12",
          )}
        >
          {pillars.map((pillar) => (
            <li key={pillar.label} className="space-y-2">
              {pillar.icon && (
                <span className="block text-2xl" aria-hidden>
                  {pillar.icon}
                </span>
              )}
              <p className="font-heading text-sm tracking-[0.14em]">{pillar.label}</p>
              {pillar.body && <p className="text-sm text-muted">{pillar.body}</p>}
            </li>
          ))}
        </ul>
      </MotionSection>
    </SectionShell>
  );
}
