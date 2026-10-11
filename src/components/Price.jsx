import { clp } from "../lib/format";

export default function Price({ product, big = false }) {
  const { price, compareAt } = product;
  return (
    <p className="mt-1 flex flex-wrap items-baseline gap-2">
      <span className={`font-display font-semibold ${big ? "text-[1.7rem]" : "text-[1.15rem]"}`}>{clp(price)}</span>
      {compareAt && (<>
        <s className="text-[.9rem] text-ink-soft">{clp(compareAt)}</s>
        <span className="rounded-md bg-[#ffe0e8] px-1.5 text-[.78rem] font-extrabold text-[#c2255c]">-{Math.round((1 - price / compareAt) * 100)}%</span>
      </>)}
    </p>
  );
}
