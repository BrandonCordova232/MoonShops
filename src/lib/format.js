import { PRODUCTS, TYPES, collectionName } from "../data/store";

export const clp = (n) => "$" + n.toLocaleString("es-CL");

// Minúsculas y sin tildes, para búsquedas tolerantes
export const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

export function searchProducts(term) {
  const t = norm(term.trim());
  if (!t) return [];
  return PRODUCTS.filter((p) =>
    norm([p.name, p.desc, TYPES[p.type], collectionName(p.collection), ...p.colors.map((c) => c.name)].join(" ")).includes(t));
}
