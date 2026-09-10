import React from "react";
import ReactDOM from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";

import App from "./App";
import ErrorFallback from "./ui/ErrorFallback";
import { supabaseConfigurationError } from "./services/supabase";

const rootElement = document.getElementById("root");

if (rootElement === null) {
  throw new Error('Application root element "#root" was not found.');
}

const root = ReactDOM.createRoot(rootElement);

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
