import { SectionRenderer } from "@/components/sections";
import { getHomePageSections } from "@/lib/content";

export default async function HomePage() {
  const sections = await getHomePageSections();

  return (
    <main>
      {sections.map((section, index) => (
        <SectionRenderer key={`${section.type}-${index}`} section={section} />
      ))}
    </main>
  );
}
