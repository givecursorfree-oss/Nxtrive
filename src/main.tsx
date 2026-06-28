import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { SmoothScroll } from "./components/providers/SmoothScroll";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SmoothScroll>
      <App />
    </SmoothScroll>
  </StrictMode>,
);

document.body.classList.add("js-ready");
