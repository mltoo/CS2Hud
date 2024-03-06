import { createRoot } from "react-dom/client";
import * as React from "react";
import { App } from "./App";
import "@fontsource/montserrat/500.css";

const container = document.getElementById("react-container");
if (container != null) {
    const root = createRoot(container);
    root.render(<App/>);
} else {
    console.error("Could not get 'react-container' element!");
}
