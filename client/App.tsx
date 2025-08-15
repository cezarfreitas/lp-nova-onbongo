import "./global.css";

import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import GA4 from "./components/GA4";
import { GA4_CONFIG, isGA4Configured } from "./config/ga4";

const App = () => (
  <BrowserRouter>
    {isGA4Configured() && <GA4 measurementId={GA4_CONFIG.measurementId} />}
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
