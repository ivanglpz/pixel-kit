import { css } from "@stylespixelkit/css";
import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  visible: boolean;
  children: ReactNode;
  onClose: VoidFunction;
};

export const Dialog = ({ children, onClose, visible }: DialogProps) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [isAnimating, setIsAnimating] = useState(false);
  const Container = document.getElementById("pixel-app");

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      // Pequeño delay para permitir que el elemento se renderice antes de la animación
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      // Esperar a que termine la animación antes de desmontar
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          const original = (children as ReactElement).props.onClick;
          if (original) original(e);
        },
      })
    : children;

  if (!shouldRender) return null;
  return Container
    ? createPortal(
        <main
          className={css({
            position: "absolute",
            top: 0,
            zIndex: 9999,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isAnimating ? 1 : 0,
            transform: isAnimating ? "scale(1)" : "scale(0.95)",
            transition: "opacity 0.3s ease, transform 0.3s ease",
          })}
          onClick={onClose}
        >
          {enhancedChildren}
        </main>,
        Container
      )
    : null;
};
