import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router";
import { queryClient } from "./queryClient";
import { router } from "./router";
import "@/app/index.css";

import { AuthProvider } from "@/features/auth/providers";

async function enableMocking() {
  if (import.meta.env.VITE_USE_MOCKS !== "true") {
    return;
  }
  const { worker } = await import("@/tests/mocks/browser");
  return worker.start();
}

enableMocking().then(() => {
  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
});
