import { Toaster } from "sonner";
import React from "react";

const GlobalToaster = () => (
  <Toaster
    position="top-center"
    richColors
    toastOptions={{
      style: {
        background: "#0f172a",
        color: "white",
        border: "1px solid #334155",
      },
    }}
  />
);

export default GlobalToaster;
