import { cn } from "@/lib/utils";

interface RichHtmlProps {
  html: string;
  className?: string;
}

export function RichHtml({ html, className }: RichHtmlProps) {
  return (
    <div
      className={cn("prose prose-neutral max-w-none text-inherit [&_a]:underline", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
