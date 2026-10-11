import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { byId } from "../data/store";

const KEY = "meworld-cart-v2";
const CartContext = createContext(null);

function load() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return Array.isArray(raw) ? raw.filter((l) => byId(l.id) && l.qty > 0) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch { /* sin almacenamiento */ }
  }, [lines]);

  const value = useMemo(() => {
    const same = (l, id, color, size) => l.id === id && l.color === color && l.size === size;
    return {
      lines,
      open,
      setOpen,
      count: lines.reduce((n, l) => n + l.qty, 0),
      total: lines.reduce((n, l) => n + byId(l.id).price * l.qty, 0),
      add: (id, color, size, qty) => {
        setLines((ls) => ls.some((l) => same(l, id, color, size))
          ? ls.map((l) => (same(l, id, color, size) ? { ...l, qty: l.qty + qty } : l))
          : [...ls, { id, color, size, qty }]);
        setOpen(true);
      },
      change: (id, color, size, delta) =>
        setLines((ls) => ls.map((l) => (same(l, id, color, size) ? { ...l, qty: l.qty + delta } : l)).filter((l) => l.qty > 0)),
      remove: (id, color, size) => setLines((ls) => ls.filter((l) => !same(l, id, color, size))),
    };
  }, [lines, open]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
