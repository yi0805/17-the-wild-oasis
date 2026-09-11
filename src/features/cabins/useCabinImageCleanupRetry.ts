import { useEffect, useRef } from "react";
import { retryCabinImageCleanup } from "../../services/apiCabinImageCleanup";

export function useCabinImageCleanupRetry() {
  const hasRetried = useRef(false);

  useEffect(() => {
    if (hasRetried.current) return;

    hasRetried.current = true;
    void retryCabinImageCleanup();
  }, []);
}
