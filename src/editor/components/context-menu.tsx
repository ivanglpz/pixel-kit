// components/ContextMenu.tsx
import { css } from "@stylespixelkit/css";
import React, { ReactNode, useEffect, useRef } from "react";

export interface ContextMenuOption {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  isEnabled: boolean;
  style?: "default" | "danger";
}

interface ContextMenuProps {
  options: ContextMenuOption[];
  id: string;
}

import { atom, useAtom } from "jotai";

export interface OpenMenuState {
  id: string;
  x: number;
  y: number;
}

const openContextMenuAtom = atom<OpenMenuState | null>(null);

export const useContextMenu = () => {
  const [openMenu, setOpenMenu] = useAtom(openContextMenuAtom);

  const open = (id: string, x: number, y: number) => setOpenMenu({ id, x, y });
  const close = () => setOpenMenu(null);
  const isOpen = (id: string) => openMenu?.id === id;
  const position = openMenu ? { x: openMenu.x, y: openMenu.y } : null;

  return { open, close, isOpen, position };
};

export const ContextMenu: React.FC<ContextMenuProps> = ({ options, id }) => {
  const { open, close, isOpen, position } = useContextMenu();
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener("click", (e) => handleClickOutside(e));
    return () => {
      document.removeEventListener("click", (e) => handleClickOutside(e));
    };
  }, []);

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    close();
  };

  return (
    <>
      {isOpen(id) && position && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: position.y - 40,
            left: position.x,
            zIndex: 1000,
          }}
          className={css({
            padding: "md",
            gap: "md",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "bg",
            borderRadius: "lg",
            border: "container",
            width: 120,
            height: "auto",
          })}
          onClick={(e) => e.stopPropagation()}
        >
          {options
            ?.filter((e) => e?.isEnabled)
            .map((option, index) => (
              <button
                key={index}
                onClick={() => handleOptionClick(option.onClick)}
                className={css({
                  padding: "md",
                  cursor: "pointer",
                  display: "grid",
                  borderRadius: "4",
                  _hover: { backgroundColor: "bg.elevated" },
                  gridTemplateColumns: "15px 1fr",
                  alignItems: "center",
                  gap: "md",
                })}
              >
                <div
                  className={css({
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  })}
                >
                  {option.icon}
                </div>
                <div className={css({ display: "flex" })}>
                  <p className={css({ fontSize: "10px" })}>{option.label}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </>
  );
};
