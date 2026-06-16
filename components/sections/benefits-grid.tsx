import Image from "next/image";

import { cn } from "@/lib/utils";
import type { BenefitsGridProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function BenefitsGrid(props: BenefitsGridProps) {
  const { heading, subheading, columns, items } = props;

  return (
    <SectionShell {...props} theme={props.theme ?? "warm-gray"}>
      <MotionSection>
        <SectionHeader heading={heading} subheading={subheading} />
        <ul
          className={cn(
            "grid gap-8",
            columns === 3 && "md:grid-cols-3",
            columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
          )}
        >
          {items.map((item) => (
            <li key={item.title} className="flex flex-col items-center text-center">
              <div className="relative mb-4 size-24 overflow-hidden rounded-full bg-cream">
                {item.icon.startsWith("http") ? (
                  <Image src={item.icon} alt="" fill className="object-cover" sizes="96px" />
                ) : (
                  <span className="flex h-full items-center justify-center text-3xl" aria-hidden>
                    {item.icon}
                  </span>
                )}
              </div>
              <h3 className="mb-2 text-lg font-medium normal-case tracking-normal">{item.title}</h3>
              <p className="text-sm text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </MotionSection>
    </SectionShell>
  );
}
