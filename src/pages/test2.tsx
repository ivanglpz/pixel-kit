import { css } from "@stylespixelkit/css";
import { Box } from "lucide-react";
import React, { MouseEvent, ReactNode, useState } from "react";

import { useEffect, useRef } from "react";

export interface ContextMenuOption {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}

interface ContextMenuProps {
  options: ContextMenuOption[];
  children: ReactNode;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ options, children }) => {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleContextMenu = (e: MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setMenuPos({ x: e.clientX, y: e.clientY });
  };

  const handleClickOutside = (e: MouseEvent<Document>) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setMenuPos(null);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside as any);
    return () => {
      document.removeEventListener("click", handleClickOutside as any);
    };
  }, []);

  const handleOptionClick = (onClick: () => void) => {
    onClick();
    setMenuPos(null);
  };

  return (
    <div
      onContextMenu={handleContextMenu}
      style={{ width: "100%", height: "100%" }}
    >
      {children}

      {menuPos && (
        <div
          ref={menuRef}
          style={{
            position: "absolute",
            top: menuPos.y,
            left: menuPos.x,
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
          onClick={(e) => e.stopPropagation()} // evita que se cierre al hacer click dentro
        >
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option.onClick)}
              className={css({
                padding: "md",
                cursor: "pointer",
                display: "grid",
                borderRadius: "4",
                _hover: {
                  backgroundColor: "bg.elevated",
                },
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
              <div
                className={css({
                  display: "flex",
                })}
              >
                <p
                  className={css({
                    fontSize: "10px",
                  })}
                >
                  {option.label}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const App: React.FC = () => {
  const options: ContextMenuOption[] = [
    {
      label: "Option 1",
      icon: <Box size={14} />,
      onClick: () => alert("Option 1 clicked"),
    },
    {
      label: "Option 2",
      icon: <Box size={14} />,

      onClick: () => alert("Option 2 clicked"),
    },
    {
      label: "Option 3",
      icon: <Box size={14} />,

      onClick: () => alert("Option 3 clicked"),
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <ContextMenu options={options}>
        <p>Right-click anywhere in this area</p>
      </ContextMenu>
    </div>
  );
};

export default App;
