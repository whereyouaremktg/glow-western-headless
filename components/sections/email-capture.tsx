"use client";
// Email form local state + submit feedback — client-only interactivity.

import { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { EmailCaptureProps } from "@/types";

import { MotionSection } from "./shared/motion-section";
import { SectionShell } from "./shared/section-shell";

export function EmailCapture(props: EmailCaptureProps & { embedded?: boolean }) {
  const { heading, body, incentive, placeholder, successMessage, embedded } = props;
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "success">("idle");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    // Phase 4: server action → Klaviyo
    setStatus("success");
    setEmail("");
  };

  const inner = (
        <div className="mx-auto max-w-xl space-y-4 text-center">
          <h2 className="text-2xl">{heading}</h2>
          {body && <p className="text-muted">{body}</p>}
          {incentive && <p className="font-eyebrow text-ink">{incentive}</p>}
          {status === "success" ? (
            <p className="rounded-lg border border-ink/10 bg-cream p-4 text-sm">{successMessage}</p>
          ) : (
            <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
              <Input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={placeholder ?? "Email address"}
                className="flex-1"
                aria-label="Email address"
              />
              <Button type="submit">Subscribe</Button>
            </form>
          )}
        </div>
  );

  if (embedded) return inner;

  return (
    <SectionShell {...props} theme={props.theme ?? "warm-gray"}>
      <MotionSection>{inner}</MotionSection>
    </SectionShell>
  );
}
