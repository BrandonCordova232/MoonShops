(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const clp = (n) => "$" + n.toLocaleString("es-CL");
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const { PRODUCTS, TYPES, COLLECTIONS, SIZES, SPECS, SIZECHART, STORE } = window;
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const colName = (id) => (COLLECTIONS.find((c) => c.id === id) || {}).name || "";
  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  /* ---------------- Carrito ---------------- */
  const KEY = "meworld-cart-v2";
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  cart = cart.filter((l) => byId(l.id) && l.qty > 0);
  const saveCart = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };

  function renderCart() {
    saveCart();
    const count = cart.reduce((n, l) => n + l.qty, 0);
    const total = cart.reduce((n, l) => n + byId(l.id).price * l.qty, 0);
    $("#cart-count").textContent = count;
    $("#cart-count").hidden = count === 0;
    $("#cart-total").textContent = clp(total);
    const left = STORE.freeShippingFrom - total;
    $("#ship").innerHTML = count === 0 ? "" : left > 0
      ? `<p>Te faltan <strong>${clp(left)}</strong> para el envío gratis 🚚</p><div class="bar"><i style="width:${Math.min(100, total / STORE.freeShippingFrom * 100)}%"></i></div>`
      : `<p><strong>¡Tienes envío gratis!</strong> 🎉</p><div class="bar"><i style="width:100%"></i></div>`;
    $("#cart-items").innerHTML = cart.length ? cart.map((l, i) => {
      const p = byId(l.id), c = p.colors.find((x) => x.name === l.color) || p.colors[0];
      return `<div class="line">
        <a class="art" href="#/producto/${p.id}" data-close>${Art.productArt(p, c.hex)}</a>
        <div><a class="line-name" href="#/producto/${p.id}" data-close>${esc(p.name)}</a>
          <small>${esc(c.name)} · Talla ${esc(l.size)}</small>
          <div class="qty"><button data-q="-1" data-i="${i}" aria-label="Quitar una unidad">−</button><span aria-live="polite">${l.qty}</span><button data-q="1" data-i="${i}" aria-label="Agregar una unidad">+</button></div></div>
        <div class="line-right"><strong>${clp(p.price * l.qty)}</strong><button class="link" data-rm="${i}" aria-label="Eliminar ${esc(p.name)}">Eliminar</button></div></div>`;
    }).join("") : `<div class="empty">${Art.mascot(110)}<p><strong>Tu carrito está vacío</strong><br>¡Adopta una prenda! 🐾</p><a class="btn" href="#/tienda" data-close>Ver tienda</a></div>`;
  }
  $("#cart-items").addEventListener("click", (e) => {
    if (e.target.closest("[data-close]")) closeCart();
    const q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty <= 0) cart.splice(+q.dataset.i, 1); }
    else if (r) cart.splice(+r.dataset.rm, 1);
    else return;
    renderCart();
  });
  const drawer = $("#drawer"), overlay = $("#overlay");
  function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; $("#close-cart").focus(); }
  function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; }
  $("#open-cart").onclick = openCart; $("#close-cart").onclick = closeCart; overlay.onclick = closeCart;
  $("#checkout").onclick = () => { $("#checkout-note").hidden = false; };
  function addToCart(id, color, size, qty) {
    const l = cart.find((x) => x.id === id && x.color === color && x.size === size);
    l ? (l.qty += qty) : cart.push({ id, color, size, qty });
    renderCart(); openCart();
  }

  /* ---------------- Componentes ---------------- */
  function priceHTML(p) {
    return `<span class="price">${clp(p.price)}</span>${p.compareAt ? `<s class="was">${clp(p.compareAt)}</s><span class="off">-${Math.round((1 - p.price / p.compareAt) * 100)}%</span>` : ""}`;
  }
  function card(p) {
    const badge = p.compareAt ? "Oferta" : p.isNew ? "Nuevo" : p.best ? "Más vendido" : "";
    return `<article class="card" data-card="${p.id}">
      <a class="card-img" href="#/producto/${p.id}" aria-label="${esc(p.name)}">
        ${badge ? `<span class="tag ${p.compareAt ? "sale" : ""}">${badge}</span>` : ""}
        <span class="card-art">${Art.productArt(p, p.colors[0].hex)}</span>
      </a>
      <div class="card-body">
        <div class="swatches" role="group" aria-label="Colores de ${esc(p.name)}">${p.colors.map((c, i) =>
          `<button class="sw" style="--c:${c.hex}" data-pv="${p.id}" data-hex="${c.hex}" aria-label="${esc(c.name)}" aria-pressed="${i === 0}" title="${esc(c.name)}"></button>`).join("")}</div>
        <h3><a href="#/producto/${p.id}">${esc(p.name)}</a></h3>
        <p class="meta">${TYPES[p.type]} · ${esc(colName(p.collection))}</p>
        <p class="prices">${priceHTML(p)}</p>
      </div></article>`;
  }
  const grid = (list) => `<div class="grid">${list.map(card).join("")}</div>`;

  /* ---------------- Navegación / cabecera ---------------- */
  const NAV = [
    { label: "Novedades", href: "#/tienda?nuevo=1", test: (q) => q.get("nuevo") },
    ...Object.entries(TYPES).map(([k, v]) => ({ label: v, href: `#/tienda?tipo=${k}`, test: (q) => q.get("tipo") === k })),
    ...COLLECTIONS.map((c) => ({ label: c.name, href: `#/tienda?col=${c.id}`, test: (q) => q.get("col") === c.id })),
    { label: "Ofertas", href: "#/tienda?oferta=1", test: (q) => q.get("oferta"), hot: true }
  ];
  function renderNav(route) {
    const onShop = route.parts[0] === "tienda";
    $("#nav").innerHTML = NAV.map((n) =>
      `<a href="${n.href}" class="${n.hot ? "hot" : ""}" ${onShop && n.test(route.q) ? 'aria-current="page"' : ""}>${n.label}</a>`).join("");
  }
  $("#promo").innerHTML = `<span>✨ Envío gratis sobre ${clp(STORE.freeShippingFrom)} · ${STORE.productionNote} ✨</span>`;
  $("#logo-cat").innerHTML = Art.mascot(40);
  $("#foot-cat").innerHTML = Art.mascot(56);
  $("#year").textContent = new Date().getFullYear();
  $("#foot-shop").innerHTML = NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join("");

  const menuBtn = $("#menu-btn");
  menuBtn.onclick = () => { const o = $("#nav").classList.toggle("open"); menuBtn.setAttribute("aria-expanded", o); };
  $("#nav").addEventListener("click", () => { $("#nav").classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); });

  /* ---------------- Buscador con sugerencias ---------------- */
  const qInput = $("#q"), sug = $("#suggest");
  function searchProducts(term) {
    const t = norm(term.trim()); if (!t) return [];
    return PRODUCTS.filter((p) => norm([p.name, p.desc, TYPES[p.type], colName(p.collection), ...p.colors.map((c) => c.name)].join(" ")).includes(t));
  }
  function closeSuggest() { sug.hidden = true; qInput.setAttribute("aria-expanded", "false"); }
  qInput.addEventListener("input", () => {
    const term = qInput.value, res = searchProducts(term);
    if (!term.trim()) return closeSuggest();
    sug.innerHTML = res.length
      ? res.slice(0, 5).map((p) => `<a role="option" href="#/producto/${p.id}"><span class="mini">${Art.productArt(p)}</span><span><strong>${esc(p.name)}</strong><br><small>${clp(p.price)}</small></span></a>`).join("") +
        `<a role="option" class="all" href="#/tienda?q=${encodeURIComponent(term.trim())}">Ver los ${res.length} resultados</a>`
      : `<p class="none">Sin resultados para «${esc(term)}» 😿</p>`;
    sug.hidden = false; qInput.setAttribute("aria-expanded", "true");
  });
  $("#search").addEventListener("submit", (e) => {
    e.preventDefault(); const t = qInput.value.trim(); closeSuggest();
    location.hash = t ? `#/tienda?q=${encodeURIComponent(t)}` : "#/tienda";
  });
  sug.addEventListener("click", closeSuggest);
  document.addEventListener("click", (e) => { if (!e.target.closest("#search")) closeSuggest(); });
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if ($("#dialog").open) return;
    if (drawer.classList.contains("open")) { closeCart(); $("#open-cart").focus(); }
    closeSuggest();
  });

  /* ---------------- Vistas ---------------- */
  function homeView() {
    const news = PRODUCTS.filter((p) => p.isNew).slice(0, 4), best = PRODUCTS.filter((p) => p.best).slice(0, 4);
    return `
    <section class="hero">
      <div class="hero-text">
        <p class="eyebrow">Colección 001 · Gatitos</p>
        <h1>Ropa para quienes aman a los <em>gatos</em></h1>
        <p>Ilustraciones kawaii y humor gatuno, impresos bajo pedido en prendas suaves. Diseños originales, hechos en Chile.</p>
        <a class="btn" href="#/tienda">Comprar ahora</a>
        <a class="btn ghost" href="#/tienda?nuevo=1">Ver novedades</a>
      </div>
      <div class="hero-art" aria-hidden="true"><svg viewBox="0 0 120 100">${Art.catHead({ fur: "#fff4ec", ear: "#ffb3cf", face: "sparkle" })}</svg></div>
    </section>
    <section class="perks" aria-label="Beneficios">
      <div><b>🚚</b><span><strong>Envíos a todo Chile</strong><small>Gratis sobre ${clp(STORE.freeShippingFrom)}</small></span></div>
      <div><b>🎨</b><span><strong>Diseños originales</strong><small>Ilustrados por nosotros</small></span></div>
      <div><b>🧵</b><span><strong>Impresión bajo pedido</strong><small>Cada prenda, solo para ti</small></span></div>
      <div><b>💌</b><span><strong>Cambios fáciles</strong><small>Por talla o falla de impresión</small></span></div>
    </section>
    <section class="section"><div class="section-head"><h2>Compra por tipo</h2></div>
      <div class="tiles">${Object.entries(TYPES).map(([k, v], i) => {
        const p = PRODUCTS.find((x) => x.type === k);
        return `<a class="tile t${i}" href="#/tienda?tipo=${k}"><span class="tile-art">${Art.productArt(p, p.colors[0].hex)}</span><span class="tile-name">${v}<small>Ver todo →</small></span></a>`;
      }).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>Novedades</h2><a href="#/tienda?nuevo=1">Ver todas →</a></div>${grid(news)}</section>
    <section class="section"><div class="section-head"><h2>Categorías</h2></div>
      <div class="cols3">${COLLECTIONS.map((c, i) => `<a class="collection c${i}" href="#/tienda?col=${c.id}"><h3>${esc(c.name)}</h3><p>${esc(c.blurb)}</p><span>Explorar →</span></a>`).join("")}</div></section>
    <section class="section"><div class="section-head"><h2>Los favoritos</h2><a href="#/tienda">Ver toda la tienda →</a></div>${grid(best)}</section>`;
  }

  const PRICE_RANGES = { "1": ["Hasta $15.000", 0, 15000], "2": ["$15.000 – $25.000", 15000, 25000], "3": ["Más de $25.000", 25000, 1e9] };
  const SORTS = { rel: "Destacados", "precio-asc": "Precio: menor a mayor", "precio-desc": "Precio: mayor a menor", nuevo: "Novedades", nombre: "Nombre A–Z" };
  const ALL_COLORS = [...new Map(PRODUCTS.flatMap((p) => p.colors).map((c) => [c.name, c])).values()];
  const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Única"];

  function filterList(q) {
    let list = PRODUCTS.slice();
    if (q.get("q")) { const ids = new Set(searchProducts(q.get("q")).map((p) => p.id)); list = list.filter((p) => ids.has(p.id)); }
    if (q.get("tipo")) list = list.filter((p) => p.type === q.get("tipo"));
    if (q.get("col")) list = list.filter((p) => p.collection === q.get("col"));
    if (q.get("nuevo")) list = list.filter((p) => p.isNew);
    if (q.get("oferta")) list = list.filter((p) => p.compareAt);
    if (q.get("talla")) list = list.filter((p) => SIZES[p.type].includes(q.get("talla")));
    if (q.get("color")) list = list.filter((p) => p.colors.some((c) => c.name === q.get("color")));
    if (q.get("precio")) { const [, lo, hi] = PRICE_RANGES[q.get("precio")] || [0, 0, 1e9]; list = list.filter((p) => p.price >= lo && p.price < hi); }
    const s = q.get("sort");
    if (s === "precio-asc") list.sort((a, b) => a.price - b.price);
    else if (s === "precio-desc") list.sort((a, b) => b.price - a.price);
    else if (s === "nuevo") list.sort((a, b) => !!b.isNew - !!a.isNew);
    else if (s === "nombre") list.sort((a, b) => a.name.localeCompare(b.name, "es"));
    return list;
  }

  function shopView(q) {
    const list = filterList(q);
    const title = q.get("q") ? `Resultados para «${esc(q.get("q"))}»` : q.get("nuevo") ? "Novedades" : q.get("oferta") ? "Ofertas"
      : q.get("tipo") ? TYPES[q.get("tipo")] : q.get("col") ? esc(colName(q.get("col"))) : "Toda la tienda";
    const radio = (name, val, label, extra = "") => `<label class="opt"><input type="radio" name="${name}" value="${val}" ${(q.get(name) || "") === val ? "checked" : ""}><span>${label}${extra}</span></label>`;
    const cnt = (fn) => ` <em>${PRODUCTS.filter(fn).length}</em>`;
    const active = ["q", "tipo", "col", "talla", "color", "precio", "nuevo", "oferta"].filter((k) => q.get(k));
    return `
    <div class="page-head"><nav class="crumbs" aria-label="Ruta"><a href="#/">Inicio</a> / <span>${title}</span></nav>
      <h1>${title}</h1></div>
    <div class="shop">
      <aside class="filters"><details id="filters-box" ${matchMedia("(min-width: 900px)").matches ? "open" : ""}><summary>Filtros${active.length ? ` <span class="badge-sm">${active.length}</span>` : ""}</summary>
        <form id="filters" aria-label="Filtros">
          <fieldset><legend>Tipo</legend>${radio("tipo", "", "Todos")}${Object.entries(TYPES).map(([k, v]) => radio("tipo", k, v, cnt((p) => p.type === k))).join("")}</fieldset>
          <fieldset><legend>Categoría</legend>${radio("col", "", "Todas")}${COLLECTIONS.map((c) => radio("col", c.id, esc(c.name), cnt((p) => p.collection === c.id))).join("")}</fieldset>
          <fieldset><legend>Talla</legend><div class="chips">${ALL_SIZES.map((s) => `<label class="chip"><input type="radio" name="talla" value="${s}" ${q.get("talla") === s ? "checked" : ""}><span>${s}</span></label>`).join("")}</div></fieldset>
          <fieldset><legend>Color</legend><div class="chips">${ALL_COLORS.map((c) => `<label class="chip sw-chip"><input type="radio" name="color" value="${esc(c.name)}" ${q.get("color") === c.name ? "checked" : ""}><span class="dot" style="--c:${c.hex}"></span><span class="sr">${esc(c.name)}</span></label>`).join("")}</div></fieldset>
          <fieldset><legend>Precio</legend>${radio("precio", "", "Cualquiera")}${Object.entries(PRICE_RANGES).map(([k, v]) => radio("precio", k, v[0])).join("")}</fieldset>
          ${active.length ? `<a class="btn ghost block" href="#/tienda">Limpiar filtros</a>` : ""}
        </form></details></aside>
      <section class="results" aria-live="polite">
        <div class="toolbar"><p><strong>${list.length}</strong> ${list.length === 1 ? "producto" : "productos"}</p>
          <label>Ordenar por <select id="sort">${Object.entries(SORTS).map(([k, v]) => `<option value="${k}" ${(q.get("sort") || "rel") === k ? "selected" : ""}>${v}</option>`).join("")}</select></label></div>
        ${active.filter((k) => k !== "nuevo" && k !== "oferta").length ? `<div class="pills">${active.map((k) => `<a class="pill" data-drop="${k}" href="#" aria-label="Quitar filtro ${k}">${esc(k === "tipo" ? TYPES[q.get(k)] : k === "col" ? colName(q.get(k)) : k === "precio" ? (PRICE_RANGES[q.get(k)] || ["?"])[0] : q.get(k))} ✕</a>`).join("")}</div>` : ""}
        ${list.length ? grid(list) : `<div class="none-box">${Art.mascot(120)}<h2>No encontramos nada 😿</h2><p>Prueba con otra palabra o quita algunos filtros.</p><a class="btn" href="#/tienda">Ver todo</a></div>`}
      </section>
    </div>`;
  }

  /* --- Producto --- */
  let sel = {};
  function productView(id) {
    const p = byId(id); if (!p) return null;
    sel = { color: p.colors[0], size: SIZES[p.type].length === 1 ? SIZES[p.type][0] : "", qty: 1, view: 0 };
    const sizes = SIZES[p.type], chart = SIZECHART[p.type];
    const related = PRODUCTS.filter((x) => x.id !== p.id && (x.collection === p.collection || x.type === p.type)).slice(0, 4);
    return `
    <div class="page-head"><nav class="crumbs" aria-label="Ruta"><a href="#/">Inicio</a> / <a href="#/tienda?tipo=${p.type}">${TYPES[p.type]}</a> / <span>${esc(p.name)}</span></nav></div>
    <div class="pdp">
      <div class="gallery">
        <div class="thumbs" role="group" aria-label="Vistas del producto">
          <button class="thumb" data-view="0" aria-pressed="true" aria-label="Vista frontal"><span id="th0">${Art.productArt(p, sel.color.hex)}</span></button>
          <button class="thumb" data-view="1" aria-pressed="false" aria-label="Detalle del estampado"><span id="th1">${Art.printArt(p, sel.color.hex)}</span></button>
        </div>
        <div class="stage" id="stage">${Art.productArt(p, sel.color.hex)}</div>
      </div>
      <div class="info">
        <p class="meta">${TYPES[p.type]} · <a href="#/tienda?col=${p.collection}">${esc(colName(p.collection))}</a></p>
        <h1>${esc(p.name)}</h1>
        <p class="prices big">${priceHTML(p)}</p>
        <p class="lead">${esc(p.desc)}</p>
        <div class="opt-block"><p class="opt-label">Color: <strong id="color-label">${esc(sel.color.name)}</strong></p>
          <div class="swatches lg" role="group" aria-label="Color">${p.colors.map((c, i) => `<button class="sw" style="--c:${c.hex}" data-color="${esc(c.name)}" aria-pressed="${i === 0}" aria-label="${esc(c.name)}" title="${esc(c.name)}"></button>`).join("")}</div></div>
        <div class="opt-block"><p class="opt-label">Talla: <strong id="size-label">${esc(sel.size || "—")}</strong>
          ${p.type !== "tote" ? `<button class="link" data-dialog="sizes">Guía de tallas</button>` : ""}</p>
          <div class="sizes" role="group" aria-label="Talla">${sizes.map((s) => `<button class="size-btn" data-size="${s}" aria-pressed="${sel.size === s}">${s}</button>`).join("")}</div>
          <p class="error" id="size-error" role="alert" hidden>Elige una talla para continuar.</p></div>
        <div class="buy"><div class="qty lg"><button data-pq="-1" aria-label="Menos">−</button><span id="pq" aria-live="polite">1</span><button data-pq="1" aria-label="Más">+</button></div>
          <button class="btn buy-btn" id="add">Agregar al carrito</button></div>
        <ul class="assure"><li>🚚 Envío gratis sobre ${clp(STORE.freeShippingFrom)}</li><li>🧵 ${STORE.productionNote}</li><li>💌 Cambio por talla o falla de impresión</li></ul>
        <div class="acc">
          <details open><summary>Ficha técnica</summary>
            <table class="specs"><tbody>${(SPECS[p.type]).map(([k, v]) => `<tr><th scope="row">${k}</th><td>${esc(v)}</td></tr>`).join("")}<tr><th scope="row">Colores</th><td>${p.colors.map((c) => esc(c.name)).join(", ")}</td></tr><tr><th scope="row">Tallas</th><td>${sizes.join(", ")}</td></tr></tbody></table>
            <p class="small">Datos referenciales; se confirmarán con el proveedor de impresión antes del lanzamiento.</p></details>
          <details><summary>Guía de medidas</summary>${sizeTable(chart)}</details>
          <details><summary>Cuidados</summary><p>${esc(SPECS[p.type].find((r) => r[0] === "Cuidado")[1])}</p></details>
          <details><summary>Envíos y cambios</summary><p>Cada prenda se produce bajo pedido, por lo que los plazos de despacho se informarán al lanzar la tienda. Aceptamos cambios por talla equivocada o falla de impresión.</p></details>
        </div>
      </div>
    </div>
    <section class="section"><div class="section-head"><h2>También te puede gustar</h2></div>${grid(related)}</section>`;
  }
  function sizeTable(c) {
    return `<table class="specs chart"><thead><tr>${c.head.map((h, i) => `<th scope="col">${h}${i ? " (cm)" : ""}</th>`).join("")}</tr></thead><tbody>${c.rows.map((r) => `<tr>${r.map((x, i) => i ? `<td>${x}</td>` : `<th scope="row">${x}</th>`).join("")}</tr>`).join("")}</tbody></table>
      <p class="small">Medidas de la prenda en plano. Referenciales.</p>`;
  }

  function textPage(title, body) {
    return `<div class="page-head"><nav class="crumbs"><a href="#/">Inicio</a> / <span>${title}</span></nav><h1>${title}</h1></div><div class="prose">${body}</div>`;
  }
  const ABOUT = `<div class="story"><div>${Art.mascot(200)}</div><div><p>Meworld nació de una obsesión: los gatos. Somos una tienda chilena de ropa con ilustraciones kawaii y humor gatuno, con diseños propios.</p><p>Imprimimos cada prenda bajo pedido, así no hay stock que sobre y cada polera sale fresquita.</p><p>Si tu gato te juzga en silencio, aquí encontrarás tu polera.</p></div></div>`;
  const HELP = `<details open><summary>¿Cuánto demora mi pedido?</summary><p>Al ser impresión bajo pedido, primero se produce y luego se despacha. Los plazos exactos se publicarán al lanzar la tienda.</p></details>
    <details><summary>¿Los diseños son originales?</summary><p>Sí. Dibujamos nuestros gatos; no usamos memes con derechos de autor de terceros.</p></details>
    <details><summary>¿Puedo cambiar o devolver una prenda?</summary><p>Aceptamos cambios por talla equivocada o falla de impresión. La política definitiva se publicará al lanzar.</p></details>
    <details><summary>¿Cómo elijo mi talla?</summary><p>En cada producto encontrarás una guía de medidas con el ancho, largo y manga de la prenda en plano.</p></details>`;

  /* ---------------- Router ---------------- */
  function parse() {
    const h = location.hash.replace(/^#\/?/, ""); const [path, qs = ""] = h.split("?");
    return { parts: path.split("/").filter(Boolean), q: new URLSearchParams(qs) };
  }
  function render() {
    const route = parse(), view = $("#view"); const [r, arg] = route.parts;
    let html, title = "Meworld · Ropa de gatos kawaii";
    if (!r) html = homeView();
    else if (r === "tienda") { html = shopView(route.q); title = "Tienda · Meworld"; }
    else if (r === "producto") { html = productView(arg); if (html) title = `${byId(arg).name} · Meworld`; }
    else if (r === "nosotros") { html = textPage("Nosotros", ABOUT); title = "Nosotros · Meworld"; }
    else if (r === "ayuda") { html = textPage("Ayuda y preguntas frecuentes", HELP); title = "Ayuda · Meworld"; }
    if (!html) html = `<div class="none-box">${Art.mascot(120)}<h2>Esta página se fue a cazar mariposas 🦋</h2><a class="btn" href="#/">Volver al inicio</a></div>`;
    view.innerHTML = html; document.title = title; renderNav(route);
    qInput.value = r === "tienda" ? (route.q.get("q") || "") : ""; closeSuggest();
    window.scrollTo(0, 0); view.focus({ preventScroll: true });
  }
  window.addEventListener("hashchange", render);

  /* ---------------- Eventos de las vistas ---------------- */
  const view = $("#view");
  view.addEventListener("change", (e) => {
    if (e.target.closest("#filters") || e.target.id === "sort") {
      const q = parse().q;
      if (e.target.id === "sort") { e.target.value === "rel" ? q.delete("sort") : q.set("sort", e.target.value); }
      else { const { name, value } = e.target; value ? q.set(name, value) : q.delete(name); }
      location.hash = "#/tienda" + ([...q].length ? "?" + q.toString() : "");
    }
  });
  view.addEventListener("click", (e) => {
    const drop = e.target.closest("[data-drop]");
    if (drop) { e.preventDefault(); const q = parse().q; q.delete(drop.dataset.drop); location.hash = "#/tienda" + ([...q].length ? "?" + q.toString() : ""); return; }
    // vista previa de color en tarjetas
    const pv = e.target.closest("[data-pv]");
    if (pv) {
      const c = pv.closest(".card"); $$("[data-pv]", c).forEach((b) => b.setAttribute("aria-pressed", b === pv));
      $(".card-art", c).innerHTML = Art.productArt(byId(pv.dataset.pv), pv.dataset.hex); return;
    }
    // producto
    const id = (location.hash.match(/producto\/([^?]+)/) || [])[1], p = id && byId(id);
    if (!p) return;
    const col = e.target.closest("[data-color]"), sz = e.target.closest("[data-size]"), pq = e.target.closest("[data-pq]"), vw = e.target.closest("[data-view]");
    if (col) {
      sel.color = p.colors.find((c) => c.name === col.dataset.color);
      $$("[data-color]").forEach((b) => b.setAttribute("aria-pressed", b === col)); $("#color-label").textContent = sel.color.name; paintStage(p);
    } else if (sz) {
      sel.size = sz.dataset.size; $$("[data-size]").forEach((b) => b.setAttribute("aria-pressed", b === sz)); $("#size-label").textContent = sel.size; $("#size-error").hidden = true;
    } else if (pq) { sel.qty = Math.min(10, Math.max(1, sel.qty + +pq.dataset.pq)); $("#pq").textContent = sel.qty; }
    else if (vw) { sel.view = +vw.dataset.view; $$("[data-view]").forEach((b) => b.setAttribute("aria-pressed", b === vw)); paintStage(p); }
    else if (e.target.closest("#add")) {
      if (!sel.size) { $("#size-error").hidden = false; $(".sizes .size-btn").focus(); return; }
      addToCart(p.id, sel.color.name, sel.size, sel.qty);
    } else if (e.target.closest("[data-dialog]")) {
      $("#dialog-body").innerHTML = `<div class="dialog-head"><h2 id="dialog-title">Guía de tallas</h2><button class="icon-btn" id="dialog-close" aria-label="Cerrar">✕</button></div>${sizeTable(SIZECHART[p.type])}`;
      $("#dialog").showModal();
    }
  });
  function paintStage(p) {
    $("#stage").innerHTML = sel.view ? Art.printArt(p, sel.color.hex) : Art.productArt(p, sel.color.hex);
    $("#th0").innerHTML = Art.productArt(p, sel.color.hex); $("#th1").innerHTML = Art.printArt(p, sel.color.hex);
  }
  $("#dialog").addEventListener("click", (e) => { if (e.target.id === "dialog" || e.target.id === "dialog-close") $("#dialog").close(); });

  $("#news-form").addEventListener("submit", (e) => {
    e.preventDefault(); const em = $("#news-email"), m = $("#news-msg"); m.hidden = false;
    m.textContent = em.checkValidity() && em.value ? "¡Gracias! Pronto sabrás de nosotros 🐱 (demostración: aún no se guarda)" : "Escribe un correo válido, por favor.";
    if (em.checkValidity() && em.value) em.value = "";
  });

  renderCart(); render();
})();
