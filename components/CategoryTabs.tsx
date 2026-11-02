import Link from "next/link";
import { CATEGORIES, CATEGORY_IDS, type CategoryId } from "@/lib/site";

// Category bar shown under the page hero (POULTRY PRODUCTS | LARGE ANIMALS PRODUCTS | …).
export default function CategoryTabs({ active }: { active?: CategoryId }) {
  return (
    <div className="cat-tabs">
      <div className="cat-tabs-in">
        {CATEGORY_IDS.map((c) => (
          <Link key={c} href={"/" + c} className={c === active ? "on" : ""}>
            {CATEGORIES[c].menu}
          </Link>
        ))}
      </div>
    </div>
  );
}
