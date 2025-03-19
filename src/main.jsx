import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./css/index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);

// async function applyFix() {
//   const form = $0;
//   await setElementStyles(form, {
//     'width': '100%',
//     'max-width': '100%',
//     'padding': '0',
//     'gap': '8px'
//   });
//   const input = form.querySelector('.search-input');
//     await setElementStyles(input, {
//     'flex-grow': '1',
//     'width': 'auto'
//   });
// }
// applyFix();
