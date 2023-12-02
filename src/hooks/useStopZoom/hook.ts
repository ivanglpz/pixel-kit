import isBrave from "@/utils/browser/browser";
import { useEffect } from "react";

const useStopZoom = () => {
  useEffect(() => {
    isBrave();
    const handleWheel = (event: WheelEvent) => {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.ctrlKey &&
        (event.key === "-" || event.key === "+" || event.key === "=")
      ) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleWheel, { passive: false });
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("wheel", handleWheel);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
};

export default useStopZoom;
