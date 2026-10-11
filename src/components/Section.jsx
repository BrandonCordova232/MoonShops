import { Link } from "react-router-dom";

export function Section({ title, link, children }) {
  return (
    <section className="wrap pt-11 min-[761px]:pt-16">
      <div className="mb-[22px] flex items-baseline justify-between">
        <h2 className="text-[clamp(1.6rem,3vw,2.1rem)]">{title}</h2>
        {link && <Link to={link[0]} className="font-extrabold text-pink-d no-underline">{link[1]}</Link>}
      </div>
      {children}
    </section>
  );
}

export function Crumbs({ items }) {
  return (
    <nav aria-label="Ruta" className="text-[.88rem] text-ink-soft">
      {items.map(([label, to], i) => (
        <span key={label}>{i > 0 && " / "}{to ? <Link to={to} className="no-underline hover:underline">{label}</Link> : <span>{label}</span>}</span>
      ))}
    </nav>
  );
}
