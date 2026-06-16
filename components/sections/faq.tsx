import { buildFaqJsonLd } from "@/lib/seo/faq-jsonld";
import type { FAQProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { RichHtml } from "./shared/rich-html";
import { SectionHeader } from "./shared/section-header";
import { SectionShell } from "./shared/section-shell";

export function FAQ(props: FAQProps) {
  const { heading, intro, items } = props;
  const jsonLd = buildFaqJsonLd(items);

  return (
    <SectionShell {...props}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MotionSection>
        <SectionHeader heading={heading} intro={intro} align="left" className="mx-0 max-w-none" />
        <div className="mx-auto max-w-3xl divide-y divide-ink/10 border-y border-ink/10">
          {items.map((item) => (
            <details key={item.question} className="group py-4">
              <summary className="cursor-pointer list-none font-medium normal-case tracking-normal [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {item.question}
                  <span className="text-muted transition group-open:rotate-45" aria-hidden>
                    +
                  </span>
                </span>
              </summary>
              <div className="pt-3 text-muted">
                <RichHtml html={item.answerHtml} />
              </div>
            </details>
          ))}
        </div>
      </MotionSection>
    </SectionShell>
  );
}
