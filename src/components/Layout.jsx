import { useEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";

export default function Layout() {
  const { pathname } = useLocation();
  const main = useRef(null);

  // Al cambiar de página: volver arriba y mover el foco al contenido (accesibilidad).
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);

  return (<>
    <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-[99] focus:rounded-[10px] focus:bg-white focus:px-3.5 focus:py-2"
      onClick={(e) => { e.preventDefault(); main.current?.focus(); }}>Saltar al contenido</a>
    <Header />
    <main id="main" ref={main} tabIndex={-1} className="min-h-[60vh]"><Outlet /></main>
    <Footer />
    <CartDrawer />
  </>);
}
