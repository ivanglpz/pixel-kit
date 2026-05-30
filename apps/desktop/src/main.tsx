import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../../src/styles/globals.css";
import App from "./app";

document.documentElement.classList.add("dark");

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Desktop renderer root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
