import {
  IPage,
  NEW_PAGE,
  PAGE_ID_ATOM,
  PAGES_ATOM,
} from "@/editor/states/pages";
import { PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { Reorder, useDragControls } from "framer-motion";
import { useAtom, useSetAtom } from "jotai";
import { File, GripVertical, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Input } from "../components/input";

const DraggableRootItem = ({
  page,
  isSelected,
  onClick,
}: {
  page: IPage;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [show, setShow] = useState(false);
  const [name, setName] = useAtom(page.name);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);
  const rootDragControls = useDragControls();

  const handleDragStart = (e: React.PointerEvent) => {
    e.stopPropagation(); // Prevenir que el evento se propague al padre
    rootDragControls.start(e);
  };
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Reorder.Item
      key={page.id}
      value={page}
      dragListener={false} // ✅ Deshabilitar listener automático
      dragControls={rootDragControls} // ✅ Usar controles manuales
      style={{
        borderRadius: "6px",
        userSelect: "none",
      }}
      whileDrag={{
        scale: 1.02,
        boxShadow: "0px 5px 15px rgba(0,0,0,0.2)",
        zIndex: 1000,
      }}
    >
      <li
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        key={`page-${page.id}`}
        className={css({
          padding: "md",
          borderRadius: "md",
          alignItems: "center",
          gap: "md",
          _dark: {
            backgroundColor: isSelected ? "gray.800" : "transparent",
          },
          backgroundColor: isSelected ? "gray.150" : "transparent",
          display: "grid",
          gridTemplateColumns: "15px 15px 1fr",
          _hover: {
            backgroundColor: "gray.100",
            _dark: {
              backgroundColor: "gray.800",
            },
          },
        })}
        onClick={onClick}
        onDoubleClick={() => {
          setShow(true);
          onClick();
        }}
        onBlur={() => {
          setPause(false);
          setShow(false);
        }}
      >
        {/* ✅ Drag Handle mejorado */}
        <div
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            cursor: "grab",
            _active: {
              cursor: "grabbing",
            },
          })}
          onPointerDown={handleDragStart} // ✅ Usar el handler mejorado
        >
          <GripVertical size={14} opacity={isHovered ? 1 : 0.3} />
        </div>
        <File size={14} />
        {show ? (
          <Input.withPause>
            <Input.Text
              value={name}
              onChange={(e) => setName(e)}
              style={{
                width: "auto",
                border: "none",
                backgroundColor: "transparent",
                color: "text",
                paddingLeft: "0px",
                padding: "sm",
                height: "15px",
                borderRadius: "0px",
                fontSize: "x-small",
              }}
            />
          </Input.withPause>
        ) : (
          <span
            className={css({
              fontSize: "x-small",
            })}
          >
            {name}
          </span>
        )}
      </li>
    </Reorder.Item>
  );
};

export const SidebarLeftPages = () => {
  const [pages, setPages] = useAtom(PAGES_ATOM);
  const newPage = useSetAtom(NEW_PAGE);
  const [selectedPage, setSelectedPage] = useAtom(PAGE_ID_ATOM);
  const ListRef = useRef<HTMLDivElement>(null);

  const handleReorder = (newOrder: typeof pages) => {
    setPages(newOrder);
  };
  return (
    <section
      className={css({
        display: "flex",
        flexDirection: "column",
      })}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "sm",
          alignItems: "center",
          justifyContent: "space-between",
          paddingBottom: "lg",
        })}
      >
        <p
          className={css({
            fontSize: "sm",
            fontWeight: 600,
          })}
        >
          Pages
        </p>
        <button
          className={css({
            display: "flex",
            flexDirection: "row",
            gap: "sm",
            alignItems: "center",
          })}
          onClick={() => {
            newPage();
            setTimeout(() => {
              ListRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
        >
          <Plus size={14} />
        </button>
      </div>

      <Reorder.Group
        axis="y"
        values={pages}
        onReorder={handleReorder}
        style={{
          display: "flex",
          flexDirection: "column",
          listStyle: "none",
          margin: 0,
          padding: 0,
          overflowY: "scroll",
          height: "100%",
          overflowX: "hidden",
        }}
      >
        {pages.map((item) => (
          <DraggableRootItem
            key={item.id}
            page={item}
            isSelected={selectedPage === item.id}
            onClick={() => setSelectedPage(item.id)}
          />
        ))}
        <div ref={ListRef} />
      </Reorder.Group>
    </section>
  );
};
