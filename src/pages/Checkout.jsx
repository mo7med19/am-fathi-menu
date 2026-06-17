import MiniCart from "../components/MiniCart";

export default function Checkout() {
  return <MiniCart open onClose={() => window.history.back()} />;
}
