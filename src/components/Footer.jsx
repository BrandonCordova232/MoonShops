import { useState } from "react";
import { Link } from "react-router-dom";
import { NAV } from "../lib/nav";
import { Mascot } from "../lib/Art";

const linkCls = "text-ink-soft no-underline hover:text-ink hover:underline";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const submit = (e) => {
    e.preventDefault();
    const ok = /^\S+@\S+\.\S+$/.test(email);
    setMsg(ok ? "¡Gracias! Pronto sabrás de nosotros 🐱 (demostración: aún no se guarda)" : "Escribe un correo válido, por favor.");
    if (ok) setEmail("");
  };
  return (
    <footer className="mt-20 border-t border-line bg-pink-soft">
      <div className="wrap grid gap-10 pb-7 pt-12 min-[1001px]:grid-cols-[1.2fr_2fr]">
        <div>
          <h2 className="text-[1.6rem]">Únete a la manada 🐾</h2>
          <p className="mb-3.5 mt-1.5 text-ink-soft">Recibe novedades y un gatito de regalo en tu primera compra.</p>
          <form onSubmit={submit} noValidate className="flex flex-col gap-2 min-[761px]:flex-row">
            <label htmlFor="news-email" className="sr-only">Tu correo</label>
            <input id="news-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="tu@correo.cl" className="field min-w-0 flex-1 border-white" />
            <button className="btn" type="submit">Suscribirme</button>
          </form>
          {msg && <p role="status" className="mt-2 font-bold">{msg}</p>}
        </div>
        <div className="grid grid-cols-2 gap-6 min-[761px]:grid-cols-3">
          <div><h3 className="mb-2.5 text-[1.05rem]">Tienda</h3>
            <ul className="grid gap-1.5">{NAV.map((n) => <li key={n.label}><Link to={n.to} className={linkCls}>{n.label}</Link></li>)}</ul></div>
          <div><h3 className="mb-2.5 text-[1.05rem]">Ayuda</h3>
            <ul className="grid gap-1.5">{["Envíos", "Cambios y devoluciones", "Guía de tallas", "Contacto"].map((t) => <li key={t}><Link to="/ayuda" className={linkCls}>{t}</Link></li>)}</ul></div>
          <div><h3 className="mb-2.5 text-[1.05rem]">Meworld</h3>
            <ul className="grid gap-1.5"><li><Link to="/nosotros" className={linkCls}>Nosotros</Link></li><li><Link to="/ayuda" className={linkCls}>Preguntas frecuentes</Link></li></ul></div>
        </div>
      </div>
      <div className="flex items-center justify-center gap-3.5 border-t border-line p-5 text-[.9rem] font-bold">
        <Mascot size={56} /><p>© {new Date().getFullYear()} Meworld · Hecho con 💗 en Chile</p>
      </div>
    </footer>
  );
}
