import { css } from "@stylespixelkit/css";
import React, { Children, isValidElement, ReactNode, useState } from "react";

interface SegmentationItemProps {
  id: string;
  title: string;
  children: ReactNode;
}

interface SegmentationProps {
  children: ReactNode;
}

export const Segmentation: React.FC<SegmentationProps> & {
  Item: React.FC<SegmentationItemProps>;
} = ({ children }) => {
  const items = Children.toArray(children).filter(isValidElement);
  const [activeId, setActiveId] = useState(
    (items[0] as any)?.props.id // primer elemento activo
  );

  const activeItem = items.find(
    (item: any) => item.props.id === activeId
  ) as any;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Lista de títulos */}
      <div
        className={css({
          borderColor: "gray.100",
          borderWidth: 1,
          backgroundColor: "gray.50",
          _dark: {
            backgroundColor: "gray.900",
            borderColor: "gray.800",
          },
          display: "grid",
          gridTemplateColumns: "2",
          padding: "sm",
          borderRadius: "lg",
          marginBottom: "lg",
        })}
      >
        {items.map((item: any) => (
          <button
            key={item.props.id}
            onClick={() => setActiveId(item.props.id)}
            className={css({
              backgroundColor:
                activeId === item.props.id ? "primary" : "transparent",
              padding: "md",
              borderRadius: "md",
              cursor: "pointer",
            })}
          >
            <p
              className={css({
                fontSize: "sm",
                color: activeId === item.props.id ? "white" : "text",
                fontWeight: 600,
              })}
            >
              {item.props.title}
            </p>
          </button>
        ))}
      </div>

      {/* Contenido activo */}
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflow: "hidden",
        })}
      >
        {activeItem?.props.children}
      </div>
    </div>
  );
};

// Componente Item (solo se usa para estructurar)
Segmentation.Item = ({ children }: SegmentationItemProps) => {
  return <>{children}</>;
};
Segmentation.Item.displayName = "Item-segmentation";
