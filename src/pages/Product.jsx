import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { SIZES, SPECS, STORE, TYPES, byId, PRODUCTS, collectionName } from "../data/store";
import { PrintArt, ProductArt } from "../lib/Art";
import { clp } from "../lib/format";
import { useCart } from "../context/CartContext";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import Price from "../components/Price";
import { Swatch, ProductGrid } from "../components/ProductCard";
import { Section, Crumbs } from "../components/Section";
import SizeTable from "../components/SizeTable";
import Dialog from "../components/Dialog";
import { NotFound } from "./Text";

const acc = "border-t border-line py-3.5 last:border-b";
const accTitle = "font-display text-[1.08rem] font-semibold";

// `key={id}` reinicia color, talla y cantidad al cambiar de producto.
export default function Product() {
  const { id } = useParams();
  const p = byId(id);
  return p ? <Detail key={p.id} p={p} /> : <NotFound />;
}

function Detail({ p }) {
  const { add } = useCart();
  const sizes = SIZES[p.type];
  const [color, setColor] = useState(p.colors[0]);
  const [size, setSize] = useState(sizes.length === 1 ? sizes[0] : "");
  const [qty, setQty] = useState(1);
  const [view, setView] = useState(0);
  const [error, setError] = useState(false);
  const [guide, setGuide] = useState(false);
  useDocumentTitle(`${p.name} · Meworld`);

  const related = PRODUCTS.filter((x) => x.id !== p.id && (x.collection === p.collection || x.type === p.type)).slice(0, 4);
  const care = SPECS[p.type].find((r) => r[0] === "Cuidado")[1];
  const submit = () => {
    if (!size) { setError(true); return; }
    add(p.id, color.name, size, qty);
  };
  const thumb = (n, label, children) => (
    <button key={n} type="button" aria-pressed={view === n} aria-label={label} onClick={() => setView(n)}
      className={`w-16 overflow-hidden rounded-[14px] border-2 bg-pink-soft p-0.5 min-[761px]:w-auto ${view === n ? "border-ink" : "border-line"}`}>{children}</button>
  );

  return (<>
    <div className="wrap pb-2 pt-7"><Crumbs items={[["Inicio", "/"], [TYPES[p.type], `/tienda?tipo=${p.type}`], [p.name]]} /></div>
    <div className="wrap grid items-start gap-6 pt-3 min-[900px]:grid-cols-[1.1fr_.9fr] min-[900px]:gap-12">
      <div className="grid gap-3.5 min-[761px]:grid-cols-[76px_1fr] min-[900px]:sticky min-[900px]:top-[130px]">
        <div className="order-2 flex gap-2.5 min-[761px]:order-none min-[761px]:flex-col" role="group" aria-label="Vistas del producto">
          {thumb(0, "Vista frontal", <ProductArt product={p} hex={color.hex} className="block w-full rounded-[10px]" />)}
          {thumb(1, "Detalle del estampado", <PrintArt product={p} hex={color.hex} className="block w-full rounded-[10px]" />)}
        </div>
        <div className="rounded-[28px] bg-pink-soft p-[5%]">
          {view ? <PrintArt product={p} hex={color.hex} className="block w-full rounded-2xl" /> : <ProductArt product={p} hex={color.hex} />}
        </div>
      </div>

      <div>
        <p className="text-[.84rem] text-ink-soft">{TYPES[p.type]} · <Link to={`/tienda?col=${p.collection}`}>{collectionName(p.collection)}</Link></p>
        <h1 className="mb-2 mt-1 text-[clamp(1.8rem,3.5vw,2.5rem)]">{p.name}</h1>
        <Price product={p} big />
        <p className="mb-5 mt-3 text-[1.05rem] text-ink-soft">{p.desc}</p>

        <div className="mb-5">
          <p className="mb-2 font-bold">Color: <strong>{color.name}</strong></p>
          <div className="flex gap-2" role="group" aria-label="Color">
            {p.colors.map((c) => <Swatch key={c.name} large color={c} pressed={c === color} onClick={() => setColor(c)} />)}
          </div>
        </div>

        <div className="mb-5">
          <p className="mb-2 flex items-baseline gap-1.5 font-bold">Talla: <strong>{size || "—"}</strong>
            {p.type !== "tote" && <button type="button" className="link-btn ml-auto" onClick={() => setGuide(true)}>Guía de tallas</button>}</p>
          <div className="flex flex-wrap gap-2.5" role="group" aria-label="Talla">
            {sizes.map((s) => (
              <button key={s} type="button" aria-pressed={size === s} onClick={() => { setSize(s); setError(false); }}
                className="min-w-14 rounded-xl border-2 border-line bg-white px-3.5 py-[11px] font-extrabold transition hover:border-pink aria-pressed:border-ink aria-pressed:bg-ink aria-pressed:text-butter">{s}</button>
            ))}
          </div>
          {error && <p role="alert" className="mt-2 font-extrabold text-[#c2255c]">Elige una talla para continuar.</p>}
        </div>

        <div className="mb-[18px] mt-2 flex gap-3">
          <div className="inline-flex items-center gap-2.5 rounded-full border-2 border-line bg-white px-2.5 py-1">
            <button aria-label="Menos" onClick={() => setQty((n) => Math.max(1, n - 1))} className="size-[34px] text-[1.2rem] font-extrabold">−</button>
            <span aria-live="polite" className="min-w-[22px] text-center font-extrabold">{qty}</span>
            <button aria-label="Más" onClick={() => setQty((n) => Math.min(10, n + 1))} className="size-[34px] text-[1.2rem] font-extrabold">+</button>
          </div>
          <button className="btn flex-1 text-[1.1rem]" onClick={submit}>Agregar al carrito</button>
        </div>

        <ul className="mb-5 grid gap-1 rounded-xl bg-mint px-[18px] py-3.5 text-[.92rem] font-bold">
          <li>🚚 Envío gratis sobre {clp(STORE.freeShippingFrom)}</li><li>🧵 {STORE.productionNote}</li><li>💌 Cambio por talla o falla de impresión</li>
        </ul>

        <div>
          <details open className={acc}><summary className={accTitle}>Ficha técnica</summary>
            <table className="specs"><tbody>
              {SPECS[p.type].map(([k, v]) => <tr key={k}><th scope="row">{k}</th><td>{v}</td></tr>)}
              <tr><th scope="row">Colores</th><td>{p.colors.map((c) => c.name).join(", ")}</td></tr>
              <tr><th scope="row">Tallas</th><td>{sizes.join(", ")}</td></tr>
            </tbody></table>
            <p className="mt-2 text-[.85rem] text-ink-soft">Datos referenciales; se confirmarán con el proveedor de impresión antes del lanzamiento.</p>
          </details>
          <details className={acc}><summary className={accTitle}>Guía de medidas</summary><SizeTable type={p.type} /></details>
          <details className={acc}><summary className={accTitle}>Cuidados</summary><p className="mt-2.5 text-ink-soft">{care}</p></details>
          <details className={acc}><summary className={accTitle}>Envíos y cambios</summary>
            <p className="mt-2.5 text-ink-soft">Cada prenda se produce bajo pedido, por lo que los plazos de despacho se informarán al lanzar la tienda. Aceptamos cambios por talla equivocada o falla de impresión.</p></details>
        </div>
      </div>
    </div>

    <Section title="También te puede gustar"><ProductGrid products={related} /></Section>
    <Dialog open={guide} onClose={() => setGuide(false)} title="Guía de tallas"><SizeTable type={p.type} /></Dialog>
  </>);
}
