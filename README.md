# Meworld 🐱

Tienda de ropa con gatos (ilustraciones kawaii y humor gatuno), bajo el modelo print on demand con [tee.cl](https://tee.cl).

Esta es la **maqueta estática** de la tienda: HTML, CSS y JS sin dependencias ni build. Sirve para validar el diseño y el catálogo antes de pasar a Shopify.

## Stack

React 19 + React Router (HashRouter) + Tailwind CSS 4, empaquetado con Vite. Sin backend: es una maqueta que se sirve como sitio estático.

## Ver la maqueta

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # genera dist/ (estático, funciona en cualquier hosting)
npm run preview   # sirve el build
```

## Estructura

| Ruta | Qué hace |
|---|---|
| `src/data/store.js` | **Todos los datos**: categorías, catálogo, colores, tallas, ficha técnica y guías de medidas |
| `src/index.css` | Tema de Tailwind (`@theme`: colores, tipografías, sombras) y clases reutilizables |
| `src/lib/Art.jsx` | Gatos y prendas dibujados en SVG (componentes React) |
| `src/context/CartContext.jsx` | Estado del carrito (guardado en `localStorage`) |
| `src/components/` | Header, buscador, footer, carrito, tarjeta de producto, diálogo |
| `src/pages/` | Inicio, tienda (filtros), producto (ficha técnica), nosotros, ayuda |

## Cambiar nombres de categorías

Edita `COLLECTIONS` en `src/data/store.js` (hoy «Categoría A/B/C»). La navegación, los filtros, las tarjetas y el footer se actualizan solos.
La ficha técnica está en `SPECS` y las medidas en `SIZECHART`: valores de **ejemplo** a confirmar con tee.cl.

## Pendiente antes de vender

- [ ] **Confirmar con tee.cl** si hay integración con Shopify (app/API) o si los pedidos se pasan a mano/CSV, y sus costos base, plazos y formatos de archivo.
- [ ] Reemplazar los gatos SVG por las ilustraciones reales (alta resolución, según las guías de impresión de tee.cl).
- [ ] Definir precios con margen sobre el costo de tee.cl + envío + comisión de Shopify/pasarela.
- [ ] Migrar a un tema de Shopify (Liquid) y conectar el pago (el botón «Pagar» hoy es solo una maqueta).
- [ ] Usar solo diseños propios: los memes conocidos suelen tener derechos de autor.
- [ ] Definir políticas de devolución y plazos de despacho (hoy son texto de ejemplo en la FAQ).
