import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { STORE, byId } from "../data/store";
import { ProductArt, Mascot } from "../lib/Art";
import { clp } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const { lines, open, setOpen, total, change, remove } = useCart();
  const [note, setNote] = useState(false);
  const closeBtn = useRef(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const esc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", esc);
    return () => document.removeEventListener("keydown", esc);
  }, [open, setOpen]);

  const left = STORE.freeShippingFrom - total;
  return (<>
    {open && <div onClick={close} className="fixed inset-0 z-[60] bg-ink/45" />}
    <aside aria-label="Carrito de compras" aria-hidden={!open} inert={!open}
      className={`fixed right-0 top-0 z-[70] flex h-full w-[min(430px,100%)] flex-col bg-cream shadow-lift transition-transform duration-[250ms] ${open ? "visible translate-x-0" : "invisible translate-x-[105%]"}`}>
      <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
        <h2 className="text-[1.4rem]">Tu carrito</h2>
        <button ref={closeBtn} className="icon-btn" aria-label="Cerrar carrito" onClick={close}>✕</button>
      </div>

      {lines.length > 0 && (
        <div className="px-5 pt-3 text-[.9rem]">
          <p>{left > 0 ? <>Te faltan <strong>{clp(left)}</strong> para el envío gratis 🚚</> : <strong>¡Tienes envío gratis! 🎉</strong>}</p>
          <div className="mt-2 h-2 overflow-hidden rounded bg-line">
            <i className="block h-full rounded bg-pink-d transition-[width] duration-300" style={{ width: `${Math.min(100, (total / STORE.freeShippingFrom) * 100)}%` }} />
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto px-5 py-2">
        {lines.length === 0 ? (
          <div className="grid justify-items-center gap-3 py-10 text-center text-ink-soft">
            <Mascot size={110} />
            <p><strong>Tu carrito está vacío</strong><br />¡Adopta una prenda! 🐾</p>
            <Link to="/tienda" className="btn" onClick={close}>Ver tienda</Link>
          </div>
        ) : lines.map((l) => {
          const p = byId(l.id), c = p.colors.find((x) => x.name === l.color) ?? p.colors[0];
          return (
            <div key={`${l.id}-${l.color}-${l.size}`} className="grid grid-cols-[78px_1fr_auto] items-start gap-3.5 border-b border-line py-3.5">
              <Link to={`/producto/${p.id}`} onClick={close} className="block rounded-xl bg-pink-soft"><ProductArt product={p} hex={c.hex} /></Link>
              <div>
                <Link to={`/producto/${p.id}`} onClick={close} className="font-extrabold no-underline">{p.name}</Link>
                <small className="mb-1.5 block text-ink-soft">{c.name} · Talla {l.size}</small>
                <div className="inline-flex items-center gap-2.5">
                  <button aria-label="Quitar una unidad" onClick={() => change(l.id, l.color, l.size, -1)} className="size-7 rounded-full border-2 border-line bg-white font-extrabold hover:border-pink">−</button>
                  <span aria-live="polite">{l.qty}</span>
                  <button aria-label="Agregar una unidad" onClick={() => change(l.id, l.color, l.size, 1)} className="size-7 rounded-full border-2 border-line bg-white font-extrabold hover:border-pink">+</button>
                </div>
              </div>
              <div className="grid justify-items-end gap-2 text-right">
                <strong>{clp(p.price * l.qty)}</strong>
                <button className="link-btn" aria-label={`Eliminar ${p.name}`} onClick={() => remove(l.id, l.color, l.size)}>Eliminar</button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-line bg-white px-5 py-4">
        <div className="flex justify-between font-display text-[1.25rem] font-semibold"><span>Subtotal</span><strong>{clp(total)}</strong></div>
        <p className="mb-3 mt-0.5 text-[.85rem] text-ink-soft">Envío calculado al pagar.</p>
        <button className="btn block w-full" onClick={() => setNote(true)}>Ir a pagar</button>
        {note && <p className="mt-2.5 text-center font-bold text-ink-soft">El pago se activará cuando conectemos Shopify. 🐱</p>}
      </div>
    </aside>
  </>);
}
