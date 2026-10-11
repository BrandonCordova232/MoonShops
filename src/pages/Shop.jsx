import { Link, useSearchParams } from "react-router-dom";
import { ALL_SIZES, COLLECTIONS, PRODUCTS, SIZES, TYPES, collectionName } from "../data/store";
import { searchProducts } from "../lib/format";
import { Mascot } from "../lib/Art";
import { ProductGrid } from "../components/ProductCard";
import { Crumbs } from "../components/Section";
import { useDocumentTitle } from "../lib/useDocumentTitle";

const PRICE_RANGES = { 1: ["Hasta $15.000", 0, 15000], 2: ["$15.000 – $25.000", 15000, 25000], 3: ["Más de $25.000", 25000, 1e9] };
const SORTS = { rel: "Destacados", "precio-asc": "Precio: menor a mayor", "precio-desc": "Precio: mayor a menor", nuevo: "Novedades", nombre: "Nombre A–Z" };
const ALL_COLORS = [...new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
const FILTER_KEYS = ["q", "tipo", "col", "talla", "color", "precio", "nuevo", "oferta"];

function filterList(q) {
  let list = PRODUCTS.slice();
  if (q.get("q")) { const ids = new Set(searchProducts(q.get("q")).map((p) => p.id)); list = list.filter((p) => ids.has(p.id)); }
  if (q.get("tipo")) list = list.filter((p) => p.type === q.get("tipo"));
  if (q.get("col")) list = list.filter((p) => p.collection === q.get("col"));
  if (q.get("nuevo")) list = list.filter((p) => p.isNew);
  if (q.get("oferta")) list = list.filter((p) => p.compareAt);
  if (q.get("talla")) list = list.filter((p) => SIZES[p.type].includes(q.get("talla")));
  if (q.get("color")) list = list.filter((p) => p.colors.some((c) => c.name === q.get("color")));
  if (q.get("precio")) { const [, lo, hi] = PRICE_RANGES[q.get("precio")] ?? [0, 0, 1e9]; list = list.filter((p) => p.price >= lo && p.price < hi); }
  const s = q.get("sort");
  if (s === "precio-asc") list.sort((a, b) => a.price - b.price);
  else if (s === "precio-desc") list.sort((a, b) => b.price - a.price);
  else if (s === "nuevo") list.sort((a, b) => !!b.isNew - !!a.isNew);
  else if (s === "nombre") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
  return list;
}

function Radio({ name, value, current, onPick, children }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1">
      <input type="radio" name={name} checked={(current ?? "") === value} onChange={() => onPick(name, value)} className="size-[17px] accent-pink-d" />
      <span>{children}</span>
    </label>
  );
}
const Legend = ({ children }) => <legend className="mb-2 p-0 font-display text-[1.05rem] font-semibold">{children}</legend>;
const Count = ({ n }) => <em className="ml-1 text-[.82rem] not-italic text-ink-soft">{n}</em>;
const chipBase = "relative cursor-pointer";

export default function Shop() {
  const [q, setQ] = useSearchParams();
  const list = filterList(q);
  const active = FILTER_KEYS.filter((k) => q.get(k));
  const pills = active.filter((k) => k !== "nuevo" && k !== "oferta");

  const title = q.get("q") ? `Resultados para «${q.get("q")}»` : q.get("nuevo") ? "Novedades" : q.get("oferta") ? "Ofertas"
    : q.get("tipo") ? TYPES[q.get("tipo")] : q.get("col") ? collectionName(q.get("col")) : "Toda la tienda";
  useDocumentTitle(`${title} · Meworld`);

  const set = (name, value) => setQ((prev) => { const n = new URLSearchParams(prev); value && value !== "rel" ? n.set(name, value) : n.delete(name); return n; });
  const pillLabel = (k) => k === "tipo" ? TYPES[q.get(k)] : k === "col" ? collectionName(q.get(k)) : k === "precio" ? PRICE_RANGES[q.get(k)]?.[0] ?? "?" : q.get(k);

  return (<>
    <div className="wrap pb-2 pt-7">
      <Crumbs items={[["Inicio", "/"], [title]]} />
      <h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)]">{title}</h1>
    </div>

    <div className="wrap grid items-start gap-2 pb-10 pt-4 min-[900px]:grid-cols-[250px_1fr] min-[900px]:gap-8">
      <aside className="rounded-xl border border-line bg-white px-4 py-1 min-[900px]:border-0 min-[900px]:bg-transparent min-[900px]:p-0">
        <details open={typeof matchMedia === "function" && matchMedia("(min-width: 900px)").matches}>
          <summary className="list-none py-2.5 font-display text-[1.1rem] font-semibold min-[900px]:hidden">
            Filtros {active.length > 0 && <span className="rounded-[10px] bg-pink-d px-2 py-px font-sans text-[.75rem] font-extrabold text-white">{active.length}</span>}
          </summary>
          <form aria-label="Filtros" className="pb-2">
            <fieldset className="mb-[22px] min-w-0 border-0 p-0"><Legend>Tipo</Legend>
              <Radio name="tipo" value="" current={q.get("tipo")} onPick={set}>Todos</Radio>
              {Object.entries(TYPES).map(([k, v]) => <Radio key={k} name="tipo" value={k} current={q.get("tipo")} onPick={set}>{v}<Count n={PRODUCTS.filter((p) => p.type === k).length} /></Radio>)}
            </fieldset>
            <fieldset className="mb-[22px] min-w-0 border-0 p-0"><Legend>Categoría</Legend>
              <Radio name="col" value="" current={q.get("col")} onPick={set}>Todas</Radio>
              {COLLECTIONS.map((c) => <Radio key={c.id} name="col" value={c.id} current={q.get("col")} onPick={set}>{c.name}<Count n={PRODUCTS.filter((p) => p.collection === c.id).length} /></Radio>)}
            </fieldset>
            <fieldset className="mb-[22px] min-w-0 border-0 p-0"><Legend>Talla</Legend>
              <div className="flex flex-wrap gap-2">{ALL_SIZES.map((s) => (
                <label key={s} className={chipBase}>
                  <input type="radio" name="talla" className="peer absolute inset-0 m-0 cursor-pointer opacity-0" checked={q.get("talla") === s} onChange={() => set("talla", s)} />
                  <span className="block min-w-[42px] rounded-[10px] border-2 border-line bg-white px-2.5 py-1 text-center text-[.88rem] font-extrabold peer-checked:border-ink peer-checked:bg-ink peer-checked:text-butter peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">{s}</span>
                </label>))}</div>
            </fieldset>
            <fieldset className="mb-[22px] min-w-0 border-0 p-0"><Legend>Color</Legend>
              <div className="flex flex-wrap gap-2">{ALL_COLORS.map((c) => (
                <label key={c.name} className={chipBase}>
                  <input type="radio" name="color" className="peer absolute inset-0 m-0 cursor-pointer opacity-0" checked={q.get("color") === c.name} onChange={() => set("color", c.name)} />
                  <span style={{ background: c.hex }} className="block size-[30px] rounded-full shadow-[0_0_0_1.5px_var(--color-line)] peer-checked:shadow-[0_0_0_3px_var(--color-ink)] peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink" />
                  <span className="sr-only">{c.name}</span>
                </label>))}</div>
            </fieldset>
            <fieldset className="mb-[22px] min-w-0 border-0 p-0"><Legend>Precio</Legend>
              <Radio name="precio" value="" current={q.get("precio")} onPick={set}>Cualquiera</Radio>
              {Object.entries(PRICE_RANGES).map(([k, v]) => <Radio key={k} name="precio" value={k} current={q.get("precio")} onPick={set}>{v[0]}</Radio>)}
            </fieldset>
            {active.length > 0 && <Link to="/tienda" className="btn btn-ghost block w-full">Limpiar filtros</Link>}
          </form>
        </details>
      </aside>

      <section aria-live="polite">
        <div className="mb-3.5 flex flex-wrap items-center justify-between gap-3">
          <p><strong>{list.length}</strong> {list.length === 1 ? "producto" : "productos"}</p>
          <label>Ordenar por{" "}
            <select value={q.get("sort") ?? "rel"} onChange={(e) => set("sort", e.target.value)} className="rounded-[10px] border-2 border-line bg-white px-2.5 py-1.5 font-bold">
              {Object.entries(SORTS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        </div>
        {pills.length > 0 && (
          <div className="mb-[18px] flex flex-wrap gap-2">
            {pills.map((k) => <button key={k} type="button" onClick={() => set(k, "")} aria-label={`Quitar filtro ${pillLabel(k)}`} className="rounded-full bg-lilac px-3.5 py-0.5 text-[.85rem] font-extrabold hover:bg-pink-soft">{pillLabel(k)} ✕</button>)}
          </div>
        )}
        {list.length ? <ProductGrid products={list} /> : (
          <div className="grid justify-items-center gap-3 px-5 py-14 text-center">
            <Mascot size={120} face="cry" /><h2 className="text-[1.6rem]">No encontramos nada 😿</h2>
            <p className="text-ink-soft">Prueba con otra palabra o quita algunos filtros.</p>
            <Link to="/tienda" className="btn">Ver todo</Link>
          </div>
        )}
      </section>
    </div>
  </>);
}
