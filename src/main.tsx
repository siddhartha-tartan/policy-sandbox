import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import ProviderWrapper from "./ProviderWrapper";
import Router from "./Router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ProviderWrapper>
      <Router />
    </ProviderWrapper>
  </React.StrictMode>
);
