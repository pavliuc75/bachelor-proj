import { useEffect, useState } from "react";
import debounce from "lodash/debounce";

function useScreenInnerWidthChangeHandler(): number {
  const [screenInnerWidth, setScreenInnerWidth] = useState(window.innerWidth);

  useEffect(() => {
    function onResize() {
      debounce(function () {
        setScreenInnerWidth(window.innerWidth);
      }, 10)();
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return screenInnerWidth;
}

export default useScreenInnerWidthChangeHandler;
