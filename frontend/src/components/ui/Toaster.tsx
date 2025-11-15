import { Toaster } from "sonner";
import React from "react";

const GlobalToaster = () => (
  <Toaster
    position="top-center"
    closeButton
    expand={true}
    richColors
    toastOptions={{
      className:
        "backdrop-blur-xl bg-slate-900/80 border border-white/10 text-white shadow-lg shadow-black/30 rounded-2xl px-4 py-3",
      style: {
        fontSize: "0.9rem",
      },
      success: {
        className:
          "backdrop-blur-xl bg-green-600/30 border border-green-400/40 shadow-green-500/20 text-white",
      },
      error: {
        className:
          "backdrop-blur-xl bg-red-600/30 border border-red-400/40 shadow-red-500/20 text-white",
      },
      info: {
        className:
          "backdrop-blur-xl bg-blue-600/30 border border-blue-400/40 shadow-blue-500/20 text-white",
      },
      warning: {
        className:
          "backdrop-blur-xl bg-yellow-600/30 border border-yellow-400/40 shadow-yellow-500/20 text-white",
      },
    }}
  />
);

export default GlobalToaster;
