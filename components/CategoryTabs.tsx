import Link from "next/link";
import { ANIMAL_IDS, CATEGORIES, MAIN_PAGES, type CategoryId } from "@/lib/site";

// Tab bar under the page hero.
//  • Animal Health sub-pages (Poultry / Livestock / Pet) show their three sibling tabs.
//  • Everything else shows the three main pages: Animal Health, Human Health, Cosmetics.
export default function CategoryTabs({ active }: { active?: CategoryId | "animal-health" }) {
  const sub = !!active && active !== "animal-health" && ANIMAL_IDS.includes(active);
  return (
    <div className="cat-tabs">
      <div className="cat-tabs-in">
        {sub
          ? ANIMAL_IDS.map((c) => (
              <Link key={c} href={"/" + c} className={c === active ? "on" : ""}>
                {CATEGORIES[c].menu}
              </Link>
            ))
          : MAIN_PAGES.map((m) => (
              <Link key={m.id} href={m.href} className={m.id === active ? "on" : ""}>
                {m.label}
              </Link>
            ))}
      </div>
    </div>
  );
}
