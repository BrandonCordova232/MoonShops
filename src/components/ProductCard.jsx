import { useState } from "react";
import { Link } from "react-router-dom";
import { TYPES, collectionName } from "../data/store";
import { ProductArt } from "../lib/Art";
import Price from "./Price";

export function Swatch({ color, pressed, onClick, large = false }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={pressed} aria-label={color.name} title={color.name}
      style={{ background: color.hex }}
      className={`rounded-full border-2 border-white p-0 transition hover:scale-[1.15] ${large ? "size-[34px]" : "size-[22px]"} ${pressed ? "shadow-[0_0_0_2px_var(--color-ink)]" : "shadow-[0_0_0_1.5px_var(--color-line)]"}`} />
  );
}

export default function ProductCard({ product: p }) {
  const [hex, setHex] = useState(p.colors[0].hex);
  const badge = p.compareAt ? "Oferta" : p.isNew ? "Nuevo" : p.best ? "Más vendido" : "";
  return (
    <article className="group flex flex-col">
      <Link to={`/producto/${p.id}`} aria-label={p.name}
        className="relative block overflow-hidden rounded-card bg-pink-soft transition duration-200 group-hover:-translate-y-[3px] group-hover:shadow-lift">
        {badge && (
          <span className={`absolute left-3 top-3 z-10 rounded-full px-3 py-0.5 font-display text-[.78rem] font-semibold shadow-sm ${p.compareAt ? "bg-sale text-white" : "bg-white"}`}>{badge}</span>
        )}
        <span className="block p-[6%] transition-transform duration-300 group-hover:rotate-[-1deg] group-hover:scale-105">
          <ProductArt product={p} hex={hex} />
        </span>
      </Link>
      <div className="px-1 pt-3">
        <div className="flex gap-2" role="group" aria-label={`Colores de ${p.name}`}>
          {p.colors.map((c) => <Swatch key={c.name} color={c} pressed={c.hex === hex} onClick={() => setHex(c.hex)} />)}
        </div>
        <h3 className="mt-2 text-[1.08rem]"><Link to={`/producto/${p.id}`} className="no-underline hover:text-pink-d">{p.name}</Link></h3>
        <p className="text-[.84rem] text-ink-soft">{TYPES[p.type]} · {collectionName(p.collection)}</p>
        <Price product={p} />
      </div>
    </article>
  );
}

export function ProductGrid({ products }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-5 min-[761px]:grid-cols-[repeat(auto-fill,minmax(220px,1fr))] min-[761px]:gap-x-5 min-[761px]:gap-y-6">
      {products.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
