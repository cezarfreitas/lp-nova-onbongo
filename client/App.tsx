import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GA4 from "./components/GA4";

// Configure o seu Measurement ID do GA4 aqui
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX"; // Substitua pelo seu ID

const App = () => (
  <BrowserRouter>
    <GA4 measurementId={GA4_MEASUREMENT_ID} />
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

// Ensure root is only created once
const container = document.getElementById("root")!;
let root = (container as any)._reactRoot;

if (!root) {
  root = createRoot(container);
  (container as any)._reactRoot = root;
}

root.render(<App />);
