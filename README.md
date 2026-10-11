# Meworld 🐱

Tienda de ropa con gatos (ilustraciones kawaii y humor gatuno), bajo el modelo print on demand con [tee.cl](https://tee.cl).

Esta es la **maqueta estática** de la tienda: HTML, CSS y JS sin dependencias ni build. Sirve para validar el diseño y el catálogo antes de pasar a Shopify.

## Ver la maqueta

```bash
python3 -m http.server 8000   # y abrir http://localhost:8000
```

## Estructura

| Archivo | Qué hace |
|---|---|
| `index.html` | Página única: hero, catálogo, historia, FAQ, carrito |
| `css/style.css` | Estilo kawaii (paleta pastel en `:root`) |
| `js/products.js` | Catálogo de ejemplo (precios en CLP **placeholder**) |
| `js/art.js` | Gatos y prendas dibujados en SVG |
| `js/app.js` | Filtros y carrito (guardado en `localStorage`) |

## Pendiente antes de vender

- [ ] **Confirmar con tee.cl** si hay integración con Shopify (app/API) o si los pedidos se pasan a mano/CSV, y sus costos base, plazos y formatos de archivo.
- [ ] Reemplazar los gatos SVG por las ilustraciones reales (alta resolución, según las guías de impresión de tee.cl).
- [ ] Definir precios con margen sobre el costo de tee.cl + envío + comisión de Shopify/pasarela.
- [ ] Migrar a un tema de Shopify (Liquid) y conectar el pago (el botón «Pagar» hoy es solo una maqueta).
- [ ] Usar solo diseños propios: los memes conocidos suelen tener derechos de autor.
- [ ] Definir políticas de devolución y plazos de despacho (hoy son texto de ejemplo en la FAQ).
