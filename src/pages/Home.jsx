import { Link } from "react-router-dom";
import { COLLECTIONS, PRODUCTS, STORE, TYPES } from "../data/store";
import { CatHead, ProductArt } from "../lib/Art";
import { clp } from "../lib/format";
import { ProductGrid } from "../components/ProductCard";
import { Section } from "../components/Section";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const PERKS = [
  ["🚚", "Envíos a todo Chile", `Gratis sobre ${clp(STORE.freeShippingFrom)}`],
  ["🎨", "Diseños originales", "Ilustrados por nosotros"],
  ["🧵", "Impresión bajo pedido", "Cada prenda, solo para ti"],
  ["💌", "Cambios fáciles", "Por talla o falla de impresión"],
];
const TILE_BG = ["bg-pink-soft", "bg-lilac", "bg-mint"];
const COL_BG = ["bg-butter", "bg-sky", "bg-pink-soft"];

export default function Home() {
  useDocumentTitle("Meworld · Ropa de gatos kawaii");
  return (<>
    <section className="wrap mt-3 min-[761px]:mt-6">
      <div className="relative grid items-center gap-6 overflow-hidden rounded-[28px] bg-gradient-to-br from-pink-soft to-lilac min-[761px]:grid-cols-[1.1fr_.9fr] min-[761px]:rounded-[36px] min-[761px]:px-6">
        <span aria-hidden="true" className="absolute left-[46%] top-6 text-[2.2rem] text-white/80 max-[760px]:hidden">✦</span>
        <span aria-hidden="true" className="absolute bottom-7 right-[6%] text-[1.6rem] text-white/80">✦</span>
        <div className="px-6 pb-2 pt-7 min-[761px]:py-14 min-[761px]:pl-8 min-[761px]:pr-0">
          <p className="mb-3.5 inline-block rounded-full bg-white px-3.5 py-1 text-[.82rem] font-extrabold">Colección 001 · Gatitos</p>
          <h1 className="mb-3.5 text-[clamp(2.2rem,5vw,3.8rem)]">Ropa para quienes aman a los <em className="not-italic text-pink-d">gatos</em></h1>
          <p className="mb-6 max-w-[46ch] text-[1.08rem] text-ink-soft">Ilustraciones kawaii y humor gatuno, impresos bajo pedido en prendas suaves. Diseños originales, hechos en Chile.</p>
          <div className="flex flex-wrap gap-2.5">
            <Link to="/tienda" className="btn">Comprar ahora</Link>
            <Link to="/tienda?nuevo=1" className="btn btn-ghost">Ver novedades</Link>
          </div>
        </div>
        <div aria-hidden="true" className="order-first mx-auto max-w-[300px] px-10 pb-7 pt-2 min-[761px]:order-none min-[761px]:max-w-none min-[761px]:py-7 min-[761px]:pl-0 min-[761px]:pr-8">
          <svg viewBox="0 0 120 100" className="block w-full animate-float drop-shadow-[0_14px_0_rgb(91_58_78/0.08)]"><CatHead fur="#fff4ec" ear="#ffb3cf" face="sparkle" /></svg>
        </div>
      </div>
    </section>

    <section aria-label="Beneficios" className="wrap mt-7 grid grid-cols-2 gap-2.5 min-[1001px]:grid-cols-4 min-[1001px]:gap-4">
      {PERKS.map(([ico, t, s]) => (
        <div key={t} className="flex flex-col items-center gap-3 rounded-card border border-line bg-white px-2 py-3 text-center min-[761px]:flex-row min-[761px]:px-4 min-[761px]:py-3.5 min-[761px]:text-left">
          <b className="text-[1.6rem]">{ico}</b>
          <span><strong className="block text-[.95rem]">{t}</strong><small className="text-ink-soft">{s}</small></span>
        </div>
      ))}
    </section>

    <Section title="Compra por tipo">
      <div className="grid gap-5 min-[761px]:grid-cols-3">
        {Object.entries(TYPES).map(([k, v], i) => {
          const p = PRODUCTS.find((x) => x.type === k);
          return (
            <Link key={k} to={`/tienda?tipo=${k}`} className={`flex items-center rounded-card p-[18px] no-underline transition duration-200 hover:-translate-y-1 hover:shadow-lift min-[761px]:flex-col ${TILE_BG[i]}`}>
              <span className="block w-[110px] flex-none min-[761px]:mx-auto min-[761px]:w-full min-[761px]:max-w-[230px]"><ProductArt product={p} /></span>
              <span className="flex flex-1 flex-col pl-3.5 font-display text-[1.4rem] font-semibold min-[761px]:w-full min-[761px]:flex-row min-[761px]:items-baseline min-[761px]:justify-between min-[761px]:pl-0">
                {v}<small className="font-sans text-[.85rem] font-extrabold text-ink-soft">Ver todo →</small>
              </span>
            </Link>
          );
        })}
      </div>
    </Section>

    <Section title="Novedades" link={["/tienda?nuevo=1", "Ver todas →"]}><ProductGrid products={PRODUCTS.filter((p) => p.isNew).slice(0, 4)} /></Section>

    <Section title="Categorías">
      <div className="grid gap-5 min-[761px]:grid-cols-3">
        {COLLECTIONS.map((c, i) => (
          <Link key={c.id} to={`/tienda?col=${c.id}`} className={`relative block min-h-[170px] overflow-hidden rounded-card px-[26px] py-[30px] no-underline transition duration-200 hover:-translate-y-1 ${COL_BG[i]}`}>
            <h3 className="text-[1.6rem]">{c.name}</h3>
            <p className="mb-[18px] mt-1.5 text-ink-soft">{c.blurb}</p>
            <span className="font-extrabold">Explorar →</span>
            <span aria-hidden="true" className="absolute bottom-1.5 right-[18px] text-[3.4rem] opacity-35">🐾</span>
          </Link>
        ))}
      </div>
    </Section>

    <Section title="Los favoritos" link={["/tienda", "Ver toda la tienda →"]}><ProductGrid products={PRODUCTS.filter((p) => p.best).slice(0, 4)} /></Section>
  </>);
}
