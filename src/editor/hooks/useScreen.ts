/* eslint-disable react-hooks/exhaustive-deps */
import { atom, useAtom } from "jotai";
import { useEffect, useRef, useState } from "react";

const screenDimension = atom({
  width: 0,
  height: 0,
});

const useScreen = () => {
  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useAtom(screenDimension);

  useEffect(() => {
    if (divRef.current) {
      setDimensions({
        width: divRef.current.offsetWidth,
        height: divRef.current.offsetHeight,
      });
    }
  }, [divRef]);

  const [show, setShow] = useState(false);

  const handleResize = () => {
    setShow(false);
    const divElement = divRef.current;
    if (divElement) {
      const { width, height } = divElement.getBoundingClientRect();
      setDimensions({
        width,
        height,
      });
      setTimeout(() => {
        setShow(true);
      }, 500);
    }
  };

  useEffect(() => {
    const divElement = divRef.current;
    if (!divElement) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(divElement);
    return () => {
      resizeObserver.unobserve(divElement);
    };
  }, []);
  return {
    show,
    ref: divRef,
    width: dimensions.width,
    height: dimensions.height,
  };
};

export default useScreen;
