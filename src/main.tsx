import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css"; // <-- THIS IS CRITICAL
import "flowbite"; // <-- enables Flowbite’s tiny JS (for data-* toggles)

const queryClient = new QueryClient();

const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>
);
