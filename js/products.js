// ============================================================
//  DATOS DE LA TIENDA (todo lo marcado como EJEMPLO se reemplaza
//  con los datos reales antes del lanzamiento).
// ============================================================

window.STORE = {
  name: "Meworld",
  freeShippingFrom: 40000,          // EJEMPLO: umbral de envío gratis (CLP)
  productionNote: "Producción bajo pedido"
};

// Tipos de prenda (filtro "Tipo")
window.TYPES = { tee: "Poleras", hoodie: "Polerones", tote: "Accesorios" };

// EJEMPLO: nombres de categorías / colecciones. Cámbialos aquí y la
// navegación, los filtros y las tarjetas se actualizan solos.
window.COLLECTIONS = [
  { id: "col-a", name: "Categoría A", blurb: "Gatitos tiernos y suaves" },
  { id: "col-b", name: "Categoría B", blurb: "Humor y actitud gatuna" },
  { id: "col-c", name: "Categoría C", blurb: "Memes originales" }
];

// Paleta de colores de prenda
const C = {
  rosa:  { name: "Rosa chicle",  hex: "#ffd6e7" },
  lila:  { name: "Lila",         hex: "#d9ccff" },
  menta: { name: "Menta",        hex: "#c9f1e4" },
  mant:  { name: "Mantequilla",  hex: "#fff2b8" },
  cielo: { name: "Cielo",        hex: "#c6e5ff" },
  dura:  { name: "Durazno",      hex: "#ffe0cc" },
  crema: { name: "Crema",        hex: "#fdf6e3" },
  blanco:{ name: "Blanco",       hex: "#ffffff" }
};

window.SIZES = {
  tee: ["XS", "S", "M", "L", "XL", "XXL"],
  hoodie: ["S", "M", "L", "XL"],
  tote: ["Única"]
};

// EJEMPLO: ficha técnica por tipo. Confirmar con tee.cl (material, gramaje, origen).
window.SPECS = {
  tee: [
    ["Material", "100% algodón peinado"],
    ["Gramaje", "180 g/m²"],
    ["Corte", "Regular, unisex"],
    ["Cuello", "Redondo con rib 1×1"],
    ["Técnica de estampado", "DTG (impresión digital directa)"],
    ["Cuidado", "Lavar del revés a máx. 30 °C. No usar secadora. Planchar al revés a baja temperatura."],
    ["Producción", "Bajo pedido"]
  ],
  hoodie: [
    ["Material", "80% algodón · 20% poliéster, felpa afelpada"],
    ["Gramaje", "280 g/m²"],
    ["Corte", "Relajado, unisex"],
    ["Capucha", "Doble capa con cordón"],
    ["Bolsillo", "Canguro frontal"],
    ["Técnica de estampado", "DTG (impresión digital directa)"],
    ["Cuidado", "Lavar del revés a máx. 30 °C. No usar secadora ni blanqueador."],
    ["Producción", "Bajo pedido"]
  ],
  tote: [
    ["Material", "100% algodón, lona"],
    ["Gramaje", "220 g/m²"],
    ["Medidas", "38 × 42 cm"],
    ["Asas", "Largo 65 cm, costura reforzada"],
    ["Técnica de estampado", "DTG (impresión digital directa)"],
    ["Cuidado", "Lavar a mano o a máx. 30 °C. No usar secadora."],
    ["Producción", "Bajo pedido"]
  ]
};

// EJEMPLO: guías de tallas (medidas en cm, prenda plana).
window.SIZECHART = {
  tee: { head: ["Talla", "Ancho", "Largo", "Manga"],
    rows: [["XS", 47, 66, 19], ["S", 50, 68, 20], ["M", 53, 70, 21], ["L", 56, 72, 22], ["XL", 59, 74, 23], ["XXL", 62, 76, 24]] },
  hoodie: { head: ["Talla", "Ancho", "Largo", "Manga"],
    rows: [["S", 54, 66, 60], ["M", 57, 68, 62], ["L", 60, 70, 63], ["XL", 63, 72, 64]] },
  tote: { head: ["Medida", "Ancho", "Alto", "Asa"], rows: [["Única", 38, 42, 65]] }
};

// EJEMPLO: catálogo. Precios en CLP.
window.PRODUCTS = [
  { id: "poler-mochi", name: "Polera Gato Mochi", type: "tee", collection: "col-a", price: 17990, isNew: true,
    colors: [C.rosa, C.blanco, C.menta], cat: { fur: "#fff4ec", ear: "#ffb3cf", face: "happy" },
    desc: "Un gatito redondo y blandito como mochi. Estampado frontal de colores suaves sobre algodón peinado." },
  { id: "poler-siesta", name: "Polera Siesta Eterna", type: "tee", collection: "col-a", price: 17990, best: true,
    colors: [C.lila, C.cielo, C.crema], cat: { fur: "#e8e1ff", ear: "#b9a6ff", face: "sleepy" },
    desc: "Para quienes viven en modo siesta, igual que su gato. Cómoda, ligera y con mucha paz." },
  { id: "poler-sparkle", name: "Polera Ojitos Brillantes", type: "tee", collection: "col-b", price: 17990, isNew: true,
    colors: [C.menta, C.rosa, C.mant], cat: { fur: "#ffffff", ear: "#ffc2d6", face: "sparkle" },
    desc: "Ojos enormes y corazón aún más grande. El clásico kawaii que combina con todo." },
  { id: "poler-meh", name: "Polera Gato Meh", type: "tee", collection: "col-c", price: 16990, compareAt: 19990,
    colors: [C.mant, C.blanco, C.cielo], cat: { fur: "#ffd9a8", ear: "#ffb98a", face: "meh" },
    desc: "Cero ganas, máxima estética. Ilustración original de humor gatuno." },
  { id: "poler-lloron", name: "Polera Gato Llorón", type: "tee", collection: "col-c", price: 16990,
    colors: [C.cielo, C.lila], cat: { fur: "#f1f1f1", ear: "#ffb3cf", face: "cry" },
    desc: "Cuando llega la cuenta de la luz. Un drama adorable estampado en tu pecho." },
  { id: "poler-uwu", name: "Polera Gato UwU", type: "tee", collection: "col-c", price: 16990, best: true,
    colors: [C.rosa, C.blanco, C.dura], cat: { fur: "#ffffff", ear: "#ff9fbd", face: "uwu" },
    desc: "uwu. Sin más explicación." },
  { id: "poleron-nube", name: "Polerón Gato Nube", type: "hoodie", collection: "col-a", price: 32990, isNew: true,
    colors: [C.lila, C.crema, C.cielo], cat: { fur: "#ffffff", ear: "#ffb3cf", face: "sleepy" },
    desc: "Polerón con capucha para días de frío y de gato encima. Interior afelpado." },
  { id: "poleron-bigote", name: "Polerón Bigotitos", type: "hoodie", collection: "col-b", price: 32990, compareAt: 36990,
    colors: [C.dura, C.rosa, C.menta], cat: { fur: "#ffd9a8", ear: "#ffb98a", face: "happy" },
    desc: "Bigotes, mejillas rosadas y bolsillo canguro. Un abrazo en forma de polerón." },
  { id: "poleron-meh", name: "Polerón Gato Meh", type: "hoodie", collection: "col-c", price: 32990,
    colors: [C.mant, C.blanco], cat: { fur: "#ffd9a8", ear: "#ffb98a", face: "meh" },
    desc: "La actitud del gato indiferente, ahora con capucha." },
  { id: "tote-mininos", name: "Tote Bag Mininos", type: "tote", collection: "col-a", price: 11990, best: true,
    colors: [C.crema, C.rosa], cat: { fur: "#ffd6e7", ear: "#ff9fbd", face: "sparkle" },
    desc: "Para llevar el súper, los libros o los snacks del gato." },
  { id: "tote-uwu", name: "Tote Bag UwU", type: "tote", collection: "col-c", price: 11990,
    colors: [C.cielo, C.menta], cat: { fur: "#ffffff", ear: "#ffb3cf", face: "uwu" },
    desc: "Lona resistente con una carita imposible de ignorar." },
  { id: "tote-siesta", name: "Tote Bag Siesta", type: "tote", collection: "col-b", price: 11990, isNew: true,
    colors: [C.lila, C.crema], cat: { fur: "#e8e1ff", ear: "#b9a6ff", face: "sleepy" },
    desc: "El tote más tranquilo del mundo. Duerme mientras tú compras." }
];
