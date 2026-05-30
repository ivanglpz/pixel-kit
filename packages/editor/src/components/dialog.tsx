import { X } from "lucide-react";
import React, {
  cloneElement,
  isValidElement,
  MouseEvent,
  ReactElement,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { constants } from "../constants/color";

type DialogProps = {
  visible: boolean;
  children: ReactNode;
  onClose: VoidFunction;
};

const Provider = ({ children, onClose, visible }: DialogProps) => {
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );

  useEffect(() => {
    setPortalContainer(document.getElementById("pixel-app") || document.body);
  }, []);

  const enhancedChildren = isValidElement(children)
    ? cloneElement(children as ReactElement, {
        onClick: (e: MouseEvent) => {
          e.stopPropagation();
          const original = (children as ReactElement).props.onClick;
          if (original) original(e);
        },
      })
    : children;

  if (!visible || !portalContainer) return null;
  return portalContainer
    ? createPortal(
        <main
          className="absolute inset-0 z-[9999] flex h-full w-full items-center justify-center bg-black/50"
          onClick={onClose}
        >
          {enhancedChildren}
        </main>,
        portalContainer
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
      className="flex h-[30px] w-[30px] cursor-pointer items-center justify-center rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600"
    >
      <X size={constants.icon.size + 10} />
    </button>
  );
};

type HeaderProps = {
  children: ReactNode;
};
const Header = ({ children }: HeaderProps) => {
  return (
    <header className="flex flex-col gap-4">
      <div className="flex items-center justify-between">{children}</div>
    </header>
  );
};
type ContainerProps = {
  children: ReactNode;
  fullWidth?: boolean;
  fullHeight?: boolean;
};
const Area = ({ children }: { children: ReactNode }) => {
  const enhanceChild = (child: ReactNode): ReactNode => {
    if (!React.isValidElement(child)) return child;
    return React.cloneElement(child as ReactElement, {
      ...child.props,
      onClick: (e: React.MouseEvent<HTMLDivElement, globalThis.MouseEvent>) =>
        e?.stopPropagation(),
    });
  };
  return <>{React.Children.map(children, enhanceChild)}</>;
};
const Container = ({ children, fullWidth, fullHeight }: ContainerProps) => {
  return (
    <div
      className={[
        "flex min-h-[240px] min-w-[450px] max-h-[520px] max-w-[600px] flex-col gap-4 rounded-lg border border-neutral-200 bg-background p-4 transition-[opacity,transform] duration-300 dark:border-neutral-700",
        fullWidth ? "w-full" : "w-auto",
        fullHeight ? "h-full" : "h-auto",
      ].join(" ")}
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
  Area,
};
