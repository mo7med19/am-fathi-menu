import { useState } from "react";
import Header from "./components/Header";
import Home from "./pages/Home";
import FloatingCart from "./components/FloatingCart";
import MiniCart from "./components/MiniCart";
import menu from "./data/menu2.json";

function App() {
  const [cartOpen, setCartOpen] = useState(false);

  const theme = menu.theme || {};
  const cssVars = {
    "--primary": theme.primary || "#4f6f52",
    "--secondary": theme.secondary || "#314b35",
    "--accent": theme.accent || "#c99a4a",
    "--background": theme.background || "#f8f3e9",
    "--surface": theme.surface || "#ffffff",
    "--text": theme.text || "#241f1a",
    "--muted": theme.muted || "#8a7b6e"
  };

  return (
    <div style={cssVars}>
      <Header onOpenCart={() => setCartOpen(true)} />
      <Home />
      <FloatingCart onOpen={() => setCartOpen(true)} />
      <MiniCart open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
