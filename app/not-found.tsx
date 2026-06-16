import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="container-glow flex min-h-[60vh] flex-col items-center justify-center gap-6 text-center section-padding">
      <p className="font-eyebrow">404</p>
      <h1 className="text-3xl">Page not found</h1>
      <p className="max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Button asChild>
        <Link href="/">Back home</Link>
      </Button>
    </main>
  );
}
