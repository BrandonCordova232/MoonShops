import { SIZECHART } from "../data/store";

export default function SizeTable({ type }) {
  const c = SIZECHART[type];
  return (<>
    <table className="specs chart">
      <thead><tr>{c.head.map((h, i) => <th key={h} scope="col">{h}{i > 0 && " (cm)"}</th>)}</tr></thead>
      <tbody>{c.rows.map((r) => <tr key={r[0]}>{r.map((x, i) => i ? <td key={i}>{x}</td> : <th key={i} scope="row">{x}</th>)}</tr>)}</tbody>
    </table>
    <p className="mt-2 text-[.85rem] text-ink-soft">Medidas de la prenda en plano. Referenciales.</p>
  </>);
}
