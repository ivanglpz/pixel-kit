import { css } from "@stylespixelkit/css";
import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";

type DialogProps = {
  children: ReactNode;
  onClose: VoidFunction;
};

export const Dialog = ({ children, onClose }: DialogProps) => {
  const Container = document.getElementById("pixel-app");

  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          const original = (children as ReactElement).props.onClick;
          if (original) original(e);
        },
      })
    : children;

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
          })}
          onClick={onClose}
        >
          {enhancedChildren}
        </main>,
        Container
      )
    : null;
};
