import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { RichHtml } from "@/components/sections/shared/rich-html";
import { getPage } from "@/lib/shopify";

interface ContentPageProps {
  params: Promise<{ handle: string }>;
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) return { title: "Page not found" };
  return {
    title: page.seo.title ?? page.title,
    description: page.seo.description ?? page.bodySummary.slice(0, 160),
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { handle } = await params;
  const page = await getPage(handle);
  if (!page) notFound();

  return (
    <main className="container-glow section-padding-y">
      <article className="mx-auto max-w-3xl">
        <h1 className="mb-8">{page.title}</h1>
        <RichHtml html={page.body} />
      </article>
    </main>
  );
}
