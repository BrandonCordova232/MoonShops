(function () {
  const $ = (s) => document.querySelector(s);
  const clp = (n) => "$" + n.toLocaleString("es-CL");
  const SIZES = ["S", "M", "L", "XL"];
  const KEY = "meworld-cart-v1";

  // Carrito: [{ id, size, qty }]
  let cart = [];
  try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) {} };
  const find = (id) => window.PRODUCTS.find((p) => p.id === id);
  // Descarta ids que ya no existen en el catálogo
  cart = cart.filter((l) => find(l.id) && l.qty > 0);

  // Decoración
  $("#logo-cat").innerHTML = Art.mascot(38);
  $("#hero-art").innerHTML = `<svg viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">${Art.catHead({ fur: "#fff4ec", ear: "#ffb3cf", face: "sparkle" })}</svg>`;
  $("#story-art").innerHTML = Art.mascot(220);
  $("#foot-cat").innerHTML = Art.mascot(64);
  $("#year").textContent = new Date().getFullYear();

  // Filtros + catálogo
  const cats = ["todo", ...new Set(window.PRODUCTS.map((p) => p.category))];
  let active = "todo";
  function renderFilters() {
    $("#filters").innerHTML = cats.map((c) =>
      `<button class="chip" data-cat="${c}" aria-pressed="${c === active}">${c[0].toUpperCase() + c.slice(1)}</button>`).join("");
  }
  function renderGrid() {
    const list = window.PRODUCTS.filter((p) => active === "todo" || p.category === active);
    $("#grid").innerHTML = list.map((p) => `
      <article class="card">
        ${p.tag ? `<span class="tag">${p.tag}</span>` : ""}
        <div class="art">${Art.productArt(p)}</div>
        <h3>${p.name}</h3><p>${p.desc}</p>
        <div class="row">
          <span class="price">${clp(p.price)}</span>
          <select class="size" aria-label="Talla de ${p.name}">${SIZES.map((s) => `<option>${s}</option>`).join("")}</select>
          <button class="btn" data-add="${p.id}">Agregar</button>
        </div>
      </article>`).join("");
  }
  $("#filters").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    active = b.dataset.cat; renderFilters(); renderGrid();
  });
  $("#grid").addEventListener("click", (e) => {
    const b = e.target.closest("[data-add]"); if (!b) return;
    const size = b.closest(".card").querySelector(".size").value;
    const line = cart.find((l) => l.id === b.dataset.add && l.size === size);
    line ? line.qty++ : cart.push({ id: b.dataset.add, size, qty: 1 });
    renderCart(); openCart();
  });

  // Carrito
  function renderCart() {
    save();
    $("#cart-count").textContent = cart.reduce((n, l) => n + l.qty, 0);
    $("#cart-total").textContent = clp(cart.reduce((n, l) => n + find(l.id).price * l.qty, 0));
    $("#cart-items").innerHTML = cart.length ? cart.map((l, i) => {
      const p = find(l.id);
      return `<div class="line">
        <div class="art">${Art.productArt(p)}</div>
        <div><strong>${p.name}</strong><br><small>Talla ${l.size} · ${clp(p.price)}</small>
          <div class="qty"><button data-q="-1" data-i="${i}" aria-label="Menos">−</button>${l.qty}<button data-q="1" data-i="${i}" aria-label="Más">+</button></div></div>
        <button class="rm" data-rm="${i}" aria-label="Quitar ${p.name}">✕</button></div>`;
    }).join("") : `<div class="empty">${Art.mascot(110)}<p>Tu carrito está vacío.<br>¡Adopta una polera! 🐾</p></div>`;
  }
  $("#cart-items").addEventListener("click", (e) => {
    const q = e.target.closest("[data-q]"), r = e.target.closest("[data-rm]");
    if (q) { const l = cart[+q.dataset.i]; l.qty += +q.dataset.q; if (l.qty <= 0) cart.splice(+q.dataset.i, 1); }
    else if (r) cart.splice(+r.dataset.rm, 1);
    else return;
    renderCart();
  });
  const drawer = $("#drawer"), overlay = $("#overlay");
  function openCart() { drawer.classList.add("open"); drawer.setAttribute("aria-hidden", "false"); overlay.hidden = false; $("#close-cart").focus(); }
  function closeCart() { drawer.classList.remove("open"); drawer.setAttribute("aria-hidden", "true"); overlay.hidden = true; $("#open-cart").focus(); }
  $("#open-cart").onclick = openCart; $("#close-cart").onclick = closeCart; overlay.onclick = closeCart;
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("open")) closeCart(); });
  $("#checkout").onclick = () => { $("#checkout-note").hidden = false; };

  renderFilters(); renderGrid(); renderCart();
})();
