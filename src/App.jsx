import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import FloatingCart from "./components/FloatingCart";
import MiniCart from "./components/MiniCart";
import menu from "./data/menu2.json";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  const theme = menu.theme || {};
  const cssVars = {
    "--primary": menu.theme?.primary || "#f28c18",
  "--secondary": menu.theme?.secondary || "#11100f",
  "--accent": menu.theme?.accent || "#ff9a1f",
  "--background": menu.theme?.background || "#fff7eb",
  "--surface": menu.theme?.surface || "#ffffff",
  "--text": menu.theme?.text || "#1f1a16",
  "--muted": menu.theme?.muted || "#8a7763",
  };

  return (
    <div style={cssVars}>
      <Header onOpenCart={() => setCartOpen(true)} />
      <Home />
      <FloatingCart onOpen={() => setCartOpen(true)} />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
      <ScrollToTop />
    </div>
  );
}

export default App;
