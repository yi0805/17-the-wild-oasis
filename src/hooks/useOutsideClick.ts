import { useEffect, useRef } from "react";

export default function useOutsideClick<T extends HTMLElement>(
  handler: () => void,
  listenCapture = true,
) {
  const ref = useRef<T | null>(null);

  useEffect(
    function () {
      function handleClick(event: MouseEvent) {
        if (
          ref.current &&
          event.target instanceof Node &&
          !ref.current.contains(event.target)
        ) {
          handler();
        }
      }

      document.addEventListener("click", handleClick, listenCapture);

      return () =>
        document.removeEventListener("click", handleClick, listenCapture);
    },
    [handler, listenCapture],
  );

  return ref;
}
