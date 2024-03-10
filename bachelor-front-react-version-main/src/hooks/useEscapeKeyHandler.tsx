import { useEffect } from "react";

function useEscapeKeyHandler(callback: () => void) {
  useEffect(() => {
    function handleKeyup(event: KeyboardEvent) {
      if (event.key === "Escape") {
        callback();
      }
    }

    document.addEventListener("keyup", handleKeyup);
    return () => document.removeEventListener("keyup", handleKeyup);
  }, []);
}

export default useEscapeKeyHandler;
