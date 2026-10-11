import { useEffect, useRef } from "react";

// <dialog> nativo: foco atrapado, Escape y fondo bloqueado sin librerías.
export default function Dialog({ open, onClose, title, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);
  return (
    <dialog ref={ref} aria-labelledby="dialog-title" onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      className="m-auto w-[calc(100%-32px)] max-w-[520px] rounded-card border-0 bg-cream p-0 text-ink shadow-lift backdrop:bg-ink/50">
      <div className="p-[22px]">
        <div className="flex items-center justify-between">
          <h2 id="dialog-title" className="text-[1.4rem]">{title}</h2>
          <button className="icon-btn" aria-label="Cerrar" onClick={onClose}>✕</button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
