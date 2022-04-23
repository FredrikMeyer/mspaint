import React from "react";
import "./index.css";
import App from "./App";

import { createRoot } from "react-dom/client";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // eslint-disable-next-line no-console
  console.error("No root element found!");
}
