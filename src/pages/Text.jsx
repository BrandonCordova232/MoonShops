import { Link } from "react-router-dom";
import { Mascot } from "../lib/Art";
import { Crumbs } from "../components/Section";
import { useDocumentTitle } from "../lib/useDocumentTitle";

function TextPage({ title, children }) {
  useDocumentTitle(`${title} · Meworld`);
  return (
    <div className="wrap max-w-[800px] pb-16">
      <div className="pb-2 pt-7"><Crumbs items={[["Inicio", "/"], [title]]} /><h1 className="mt-2 text-[clamp(1.8rem,4vw,2.6rem)]">{title}</h1></div>
      {children}
    </div>
  );
}

export function About() {
  return (
    <TextPage title="Nosotros">
      <div className="mt-4 grid items-center gap-8 max-[760px]:justify-items-center max-[760px]:text-center min-[761px]:grid-cols-[200px_1fr]">
        <Mascot size={200} face="sparkle" />
        <div className="grid gap-3 text-[1.05rem] text-ink-soft">
          <p>Meworld nació de una obsesión: los gatos. Somos una tienda chilena de ropa con ilustraciones kawaii y humor gatuno, con diseños propios.</p>
          <p>Imprimimos cada prenda bajo pedido, así no hay stock que sobre y cada polera sale fresquita.</p>
          <p>Si tu gato te juzga en silencio, aquí encontrarás tu polera.</p>
        </div>
      </div>
    </TextPage>
  );
}

const FAQ = [
  ["¿Cuánto demora mi pedido?", "Al ser impresión bajo pedido, primero se produce y luego se despacha. Los plazos exactos se publicarán al lanzar la tienda."],
  ["¿Los diseños son originales?", "Sí. Dibujamos nuestros gatos; no usamos memes con derechos de autor de terceros."],
  ["¿Puedo cambiar o devolver una prenda?", "Aceptamos cambios por talla equivocada o falla de impresión. La política definitiva se publicará al lanzar."],
  ["¿Cómo elijo mi talla?", "En cada producto encontrarás una guía de medidas con el ancho, largo y manga de la prenda en plano."],
];

export function Help() {
  return (
    <TextPage title="Ayuda y preguntas frecuentes">
      <div className="mt-4">
        {FAQ.map(([q, a], i) => (
          <details key={q} open={i === 0} className="border-t border-line py-3.5 last:border-b">
            <summary className="font-display text-[1.08rem] font-semibold">{q}</summary>
            <p className="mt-2.5 text-ink-soft">{a}</p>
          </details>
        ))}
      </div>
    </TextPage>
  );
}

export function NotFound() {
  useDocumentTitle("Página no encontrada · Meworld");
  return (
    <div className="grid justify-items-center gap-3 px-5 py-20 text-center">
      <Mascot size={120} face="meh" /><h1 className="text-[1.6rem]">Esta página se fue a cazar mariposas 🦋</h1>
      <Link to="/" className="btn">Volver al inicio</Link>
    </div>
  );
}
