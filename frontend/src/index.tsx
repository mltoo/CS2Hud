import { createRoot } from "react-dom/client";
import * as React from "react";
import { App } from "./App";
import "@fontsource/montserrat/500.css";
import "../svgImport.d.ts";

const container = document.getElementById("react-container");
if (container != null) {
    const root = createRoot(container);
    root.render(<React.StrictMode><App/></React.StrictMode>);
} else {
    console.error("Could not get 'react-container' element!");
}
