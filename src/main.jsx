import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import App from "./App.jsx";
import ErrorFallback from "./ui/ErrorFallback.jsx";
import { supabaseConfigurationError } from "./services/supabase";

const root = ReactDOM.createRoot(document.getElementById("root"));

if (supabaseConfigurationError) {
  root.render(
    <React.StrictMode>
      <main role="alert">
        <h1>Application configuration error</h1>
        <p>{supabaseConfigurationError}</p>
      </main>
    </React.StrictMode>,
  );
} else {
  root.render(
    <React.StrictMode>
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onReset={() => window.location.replace("/")}
      >
        <App />
      </ErrorBoundary>
    </React.StrictMode>,
  );
}
