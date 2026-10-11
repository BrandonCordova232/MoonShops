// Ilustraciones kawaii en SVG puro (sin imágenes externas).
(function () {
  const INK = "#5b3a4e";

  function eyes(face) {
    switch (face) {
      case "happy":
        return `<path d="M34 54q6-9 12 0M74 54q6-9 12 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>`;
      case "sleepy":
        return `<path d="M34 54q6 6 12 0M74 54q6 6 12 0" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round"/>
                <text x="92" y="32" font-size="14" fill="${INK}" font-family="sans-serif" font-weight="700">z</text>
                <text x="102" y="22" font-size="10" fill="${INK}" font-family="sans-serif" font-weight="700">z</text>`;
      case "sparkle":
        return `<ellipse cx="40" cy="54" rx="7" ry="8.5" fill="${INK}"/><ellipse cx="80" cy="54" rx="7" ry="8.5" fill="${INK}"/>
                <circle cx="37.5" cy="50.5" r="2.8" fill="#fff"/><circle cx="77.5" cy="50.5" r="2.8" fill="#fff"/>
                <circle cx="42.5" cy="58" r="1.4" fill="#fff"/><circle cx="82.5" cy="58" r="1.4" fill="#fff"/>`;
      case "meh":
        return `<circle cx="40" cy="55" r="3.6" fill="${INK}"/><circle cx="80" cy="55" r="3.6" fill="${INK}"/>
                <path d="M32 47h16M72 47h16" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
      case "cry":
        return `<ellipse cx="40" cy="54" rx="6.5" ry="8" fill="${INK}"/><ellipse cx="80" cy="54" rx="6.5" ry="8" fill="${INK}"/>
                <circle cx="38" cy="51" r="2.6" fill="#fff"/><circle cx="78" cy="51" r="2.6" fill="#fff"/>
                <path d="M36 64q-3 9 0 12q3-3 0-12zM84 64q-3 9 0 12q3-3 0-12z" fill="#8fd3ff"/>`;
      case "uwu":
        return `<path d="M32 50l8 5-8 5M88 50l-8 5 8 5" fill="none" stroke="${INK}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>`;
      default:
        return "";
    }
  }

  function mouth(face) {
    if (face === "meh") return `<path d="M54 71h12" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    if (face === "cry") return `<path d="M54 74q6-6 12 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    return `<path d="M54 68q3 5 6 0q3 5 6 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  }

  // Cabeza de gato; devuelve un <g> en un viewBox de 120x100.
  function catHead({ fur, ear, face }) {
    return `
    <g>
      <path d="M18 44L22 10l30 18z" fill="${fur}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M102 44L98 10 68 28z" fill="${fur}" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>
      <path d="M26 36l2-14 14 8z" fill="${ear}"/><path d="M94 36l-2-14-14 8z" fill="${ear}"/>
      <ellipse cx="60" cy="58" rx="46" ry="38" fill="${fur}" stroke="${INK}" stroke-width="3"/>
      ${eyes(face)}
      <ellipse cx="25" cy="66" rx="8" ry="5" fill="${ear}" opacity=".75"/>
      <ellipse cx="95" cy="66" rx="8" ry="5" fill="${ear}" opacity=".75"/>
      <path d="M57 62h6l-3 4z" fill="${ear}" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>
      ${mouth(face)}
      <path d="M6 60l14 2M6 70l14-3M114 60l-14 2M114 70l-14-3" stroke="${INK}" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
    </g>`;
  }

  const SHAPES = {
    tee: `<path d="M70 40L100 26Q130 46 160 26L192 40L224 76L200 96L184 82V222H76V82L60 96L36 76Z"/>`,
    hoodie: `<path d="M66 44Q130 6 194 44L238 150L206 164L184 116V226H76V116L54 164L22 150Z"/>
             <path d="M98 30Q130 70 162 30" fill="none"/><path d="M116 62v22M144 62v22" fill="none"/>`,
    tote: `<path d="M76 96h108l10 140H66z"/><path d="M98 96V70q0-28 32-28t32 28v26" fill="none"/>`
  };

  // Producto completo: prenda del color elegido + gato estampado.
  function productArt(p, hex) {
    const shape = SHAPES[p.type] || SHAPES.tee;
    const y = p.type === "tote" ? 126 : p.type === "hoodie" ? 104 : 86;
    const fill = hex || p.colors[0].hex;
    return `<svg viewBox="0 0 260 260" role="img" aria-label="${p.name}" xmlns="http://www.w3.org/2000/svg">
      <g fill="${fill}" stroke="${INK}" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round">${shape}</g>
      <g transform="translate(97 ${y}) scale(.55)">${catHead(p.cat)}</g>
    </svg>`;
  }

  // Detalle del estampado (cabeza grande sobre fondo del color de la prenda).
  function printArt(p, hex) {
    return `<svg viewBox="0 0 120 100" role="img" aria-label="Estampado de ${p.name}" xmlns="http://www.w3.org/2000/svg">
      <rect width="120" height="100" fill="${hex || p.colors[0].hex}"/><g transform="translate(6 4) scale(.9)">${catHead(p.cat)}</g></svg>`;
  }

  function mascot(size) {
    return `<svg viewBox="0 0 120 100" width="${size}" height="${size * 100 / 120}" role="img" aria-label="Meworld" xmlns="http://www.w3.org/2000/svg">${catHead({ fur: "#fff4ec", ear: "#ffb3cf", face: "happy" })}</svg>`;
  }

  window.Art = { productArt, printArt, mascot, catHead };
})();
