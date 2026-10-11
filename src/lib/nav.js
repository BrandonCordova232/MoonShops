import { COLLECTIONS, TYPES } from "../data/store";

// Entradas de la barra de categorías (se generan desde los datos).
export const NAV = [
  { label: "Novedades", to: "/tienda?nuevo=1", test: (q) => q.get("nuevo") },
  ...Object.entries(TYPES).map(([k, v]) => ({ label: v, to: `/tienda?tipo=${k}`, test: (q) => q.get("tipo") === k })),
  ...COLLECTIONS.map((c) => ({ label: c.name, to: `/tienda?col=${c.id}`, test: (q) => q.get("col") === c.id })),
  { label: "Ofertas", to: "/tienda?oferta=1", test: (q) => q.get("oferta"), hot: true },
];
