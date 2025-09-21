import { css } from "@stylespixelkit/css";
import { X } from "lucide-react";
import {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
} from "react";
import { createPortal } from "react-dom";
import { constants } from "../constants/color";

type DialogProps = {
  visible: boolean;
  children: ReactNode;
  onClose: VoidFunction;
};

export const Provider = ({ children, onClose, visible }: DialogProps) => {
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

  if (!visible) return null;
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

type CloseProps = {
  onClose: VoidFunction;
};

const Close = ({ onClose }: CloseProps) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClose();
      }}
      className={css({
        width: 30,
        height: 30,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: "lg",
        cursor: "pointer",
        _hover: {
          backgroundColor: "gray.150",
        },
        _dark: {
          _hover: {
            backgroundColor: "gray.600",
          },
        },
      })}
    >
      <X size={constants.icon.size} />
    </button>
  );
};

type HeaderProps = {
  children: ReactNode;
};
const Header = ({ children }: HeaderProps) => {
  return (
    <header
      className={css({
        display: "flex",
        flexDirection: "column",
        gap: "lg",
      })}
    >
      <div
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        })}
      >
        {children}
      </div>
    </header>
  );
};
type ContainerProps = {
  children: ReactNode;
};
const Container = ({ children }: ContainerProps) => {
  return (
    <div
      className={css({
        padding: "lg",
        gap: "lg",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "bg",
        borderRadius: "lg",
        border: "container",
        maxWidth: 600,
        minWidth: 300,
        width: "auto",
        maxHeight: 520,
        height: "auto",
        gridAutoRows: "60px",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      })}
      onClick={(e) => e?.stopPropagation()}
    >
      {children}
    </div>
  );
};
export const Dialog = {
  Provider,
  Header,
  Container,
  Close,
};
