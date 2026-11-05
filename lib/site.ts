export const WA = "923146151383";

export type CategoryId = "poultry" | "large" | "pets" | "human" | "cosmetics";

export const CATEGORY_IDS: CategoryId[] = ["poultry", "large", "pets", "human", "cosmetics"];

export interface CategoryMeta {
  id: CategoryId;
  label: string; // used in the modal badge
  menu: string; // label in the Products dropdown / category tabs
  heroImg: string;
  crumb: string[]; // breadcrumb after "Home"
  title: [string, string]; // [plain, accent]
  sub: string;
  toolbar: string;
}

export const CATEGORIES: Record<CategoryId, CategoryMeta> = {
  poultry: {
    id: "poultry",
    menu: "Poultry Products",
    label: "Poultry Products",
    heroImg: "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=2400&q=85",
    crumb: ["Products", "Poultry"],
    title: ["Poultry", "Products"],
    sub: "Antibiotics, vitamins, immunity enhancers and growth promoters for commercial poultry operations.",
    toolbar: "Click a product to view details",
  },
  large: {
    id: "large",
    menu: "Large Animals Products",
    label: "Large Animals",
    heroImg: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=2400&q=85",
    crumb: ["Products", "Large Animals"],
    title: ["Large", "Animals"],
    sub: "Veterinary therapeutics for cattle, sheep, goats and equine.",
    toolbar: "Livestock therapeutics",
  },
  pets: {
    id: "pets",
    menu: "Pet Products",
    label: "Pet Products",
    heroImg: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=2400&q=85",
    crumb: ["Products", "Pet Products"],
    title: ["Pet", "Products"],
    sub: "Safe and effective formulations for dogs, cats and companion animals.",
    toolbar: "Companion Animal Therapeutics",
  },
  human: {
    id: "human",
    menu: "Human Products",
    label: "Human Products",
    heroImg: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=2400&q=85",
    crumb: ["Human Health"],
    title: ["Human", "Health"],
    sub: "Pharmaceutical products manufactured to international GMP and ISO standards.",
    toolbar: "Pharmaceutical Therapeutics",
  },
  cosmetics: {
    id: "cosmetics",
    menu: "Cosmetics Products",
    label: "Cosmetics",
    heroImg: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=2400&q=85",
    crumb: ["Cosmetics"],
    title: ["Cosmetics", "Range"],
    sub: "Research-backed skincare and personal-care formulations.",
    toolbar: "Skincare and Personal Care",
  },
};

export interface Product {
  id: string;
  name: string;
  tagline: string;
  packing: string[];
  sizes: string[];
  comp: string[];
  dosage: string;
  chars: string[];
  group?: string; // sub-filter (e.g. Vitamins, Antibiotics)
  company?: string; // brand/company the product belongs to (poultry page is grouped by it)
  prices?: { size: string; amount: number }[]; // market price per pack size (PKR)
  image?: string; // thumbnail path under /products
  full?: string; // large image used in the modal
  gallery?: { size: string | null; src: string }[]; // every render: other sizes / front & back views (first = main)
  ref?: string; // reference name the picture was matched on
}

export interface CatalogFile {
  v: string; // content hash — bumps the browser cache when data changes
  category: CategoryId;
  products: Product[];
}

export const rs = (n: number) => `Rs ${n.toLocaleString("en-US")}`;

// "Rs 5,034" for a single price, "From Rs 5,034" when several pack sizes are priced
export function priceLabel(p: Product): string | null {
  if (!p.prices?.length) return null;
  const min = Math.min(...p.prices.map((x) => x.amount));
  return (p.prices.length > 1 ? "From " : "") + rs(min);
}

// Poultry page sections, in the order the client listed them.
export const COMPANIES = [
  { key: "Schiwo Pakistan", label: "Schiwo", full: "Schiwo Pakistan" },
  { key: "Hint Life Sciences", label: "Hint Life", full: "Hint Life Sciences" },
  { key: "USHNAZ Pharmaceuticals", label: "Ushnaz", full: "Ushnaz Pharmaceuticals" },
];
