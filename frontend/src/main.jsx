import "@fontsource/press-start-2p";
import "./index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <App />
    </StrictMode>
);