import { useEffect, useState } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { STORE } from "../data/store";
import { NAV } from "../lib/nav";
import { Mascot } from "../lib/Art";
import { clp } from "../lib/format";
import { useCart } from "../context/CartContext";
import SearchBox from "./SearchBox";

export default function Header() {
  const { count, setOpen } = useCart();
  const [menu, setMenu] = useState(false);
  const { pathname } = useLocation();
  const [params] = useSearchParams();
  const onShop = pathname === "/tienda";
  useEffect(() => setMenu(false), [pathname]);

  return (<>
    <div className="bg-ink px-4 py-2 text-center text-[.85rem] font-bold tracking-[.02em] text-butter">
      ✨ Envío gratis sobre {clp(STORE.freeShippingFrom)} · {STORE.productionNote} ✨
    </div>
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur-md">
      <div className="wrap flex flex-wrap items-center gap-2 py-2.5 min-[761px]:flex-nowrap min-[761px]:gap-5 min-[761px]:py-3">
        <button className="icon-btn min-[761px]:hidden" aria-label="Abrir menú" aria-expanded={menu} aria-controls="nav" onClick={() => setMenu((m) => !m)}>☰</button>
        <Link to="/" aria-label="Meworld, ir al inicio" className="mr-auto flex flex-none items-center gap-2 font-display text-[1.45rem] font-bold no-underline min-[761px]:mr-0 min-[761px]:text-[1.7rem]">
          <Mascot size={40} /> Meworld
        </Link>
        <SearchBox />
        <button className="icon-btn" aria-label="Abrir carrito" onClick={() => setOpen(true)}>
          <span aria-hidden="true">🛍️</span>
          {count > 0 && <span className="absolute right-0 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-pink-d px-1 text-[.72rem] font-extrabold text-white">{count}</span>}
        </button>
      </div>
      <nav id="nav" aria-label="Categorías" onClick={() => setMenu(false)}
        className={`wrap flex-col gap-1.5 pb-3 min-[761px]:flex min-[761px]:flex-row min-[761px]:overflow-x-auto min-[761px]:pb-2.5 ${menu ? "flex" : "hidden"}`}>
        {NAV.map((n) => (
          <Link key={n.label} to={n.to} aria-current={onShop && n.test(params) ? "page" : undefined}
            className={`whitespace-nowrap rounded-full px-3.5 py-2.5 text-[.95rem] font-extrabold no-underline transition hover:bg-pink-soft min-[761px]:px-4 min-[761px]:py-1.5 aria-[current=page]:bg-ink aria-[current=page]:text-butter ${n.hot ? "text-sale" : ""}`}>
            {n.label}
          </Link>
        ))}
      </nav>
    </header>
  </>);
}
