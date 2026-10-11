import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { clp, searchProducts } from "../lib/format";
import { ProductArt } from "../lib/Art";

export default function SearchBox() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const box = useRef(null);
  const results = searchProducts(term);

  // En la tienda el campo refleja la búsqueda activa; en otras páginas se vacía.
  const active = pathname === "/tienda" ? params.get("q") ?? "" : "";
  useEffect(() => { setTerm(active); setOpen(false); }, [active, pathname]);

  useEffect(() => {
    const away = (e) => { if (!box.current?.contains(e.target)) setOpen(false); };
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("click", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("click", away); document.removeEventListener("keydown", esc); };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const t = term.trim();
    setOpen(false);
    navigate(t ? `/tienda?q=${encodeURIComponent(t)}` : "/tienda");
  };
  const showList = open && term.trim() !== "";

  return (
    <form ref={box} onSubmit={submit} role="search" autoComplete="off"
      className="relative order-5 w-full min-[761px]:order-none min-[761px]:mx-auto min-[761px]:max-w-[560px] min-[761px]:flex-1">
      <label htmlFor="q" className="sr-only">Buscar productos</label>
      <span aria-hidden="true" className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[.95rem]">🔍</span>
      <input id="q" type="search" value={term} placeholder="Buscar gatitos, poleras, polerones…"
        aria-expanded={showList} aria-controls="suggest" className="field pl-[46px]"
        onChange={(e) => { setTerm(e.target.value); setOpen(true); }} onFocus={() => setOpen(true)} />
      {showList && (
        <div id="suggest" role="listbox" className="absolute inset-x-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-line bg-white shadow-lift">
          {results.length ? (<>
            {results.slice(0, 5).map((p) => (
              <Link key={p.id} to={`/producto/${p.id}`} role="option" aria-selected="false" onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 no-underline hover:bg-pink-soft focus:bg-pink-soft">
                <span className="w-[46px] flex-none rounded-[10px] bg-pink-soft"><ProductArt product={p} /></span>
                <span><strong>{p.name}</strong><br /><small className="text-ink-soft">{clp(p.price)}</small></span>
              </Link>
            ))}
            <Link to={`/tienda?q=${encodeURIComponent(term.trim())}`} role="option" aria-selected="false" onClick={() => setOpen(false)}
              className="block border-t border-line px-3.5 py-2.5 text-center font-extrabold no-underline hover:bg-pink-soft">
              Ver los {results.length} resultados
            </Link>
          </>) : <p className="p-4 text-center text-ink-soft">Sin resultados para «{term}» 😿</p>}
        </div>
      )}
    </form>
  );
}
