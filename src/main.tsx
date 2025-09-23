import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { setupIonicReact } from '@ionic/react';
setupIonicReact();

/* Ionic core + basic styles (required once) */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Root div #root not found. Check index.html");
}
const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
