import { InputAtomText } from "@/editor/components/input-atom-text";
import {
  IPage,
  NEW_PAGE,
  PAGE_ID_ATOM,
  PAGES_BY_TYPE_ATOM,
} from "@/editor/states/pages";
import { PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { File, Plus } from "lucide-react";
import { useRef, useState } from "react";

const TogglePage = ({
  page,
  isSelected,
  onClick,
}: {
  page: IPage;
  isSelected: boolean;
  onClick: () => void;
}) => {
  const [show, setShow] = useState(false);
  const name = useAtomValue(page.name);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <li
      key={`page-${page.id}`}
      className={css({
        padding: "md",
        flex: 1,
        borderRadius: "md",
        display: "grid",
        gridTemplateColumns: "15px 1fr",
        alignItems: "center",
        gap: "md",
        backgroundColor: isSelected ? "gray.800" : "transparent",
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
      <File size={14} />
      {show ? (
        <InputAtomText atom={page.name} />
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
  );
};

export const SidebarLeftPages = () => {
  const pages = useAtomValue(PAGES_BY_TYPE_ATOM);
  const newPage = useSetAtom(NEW_PAGE);
  const [selectedPage, setSelectedPage] = useAtom(PAGE_ID_ATOM);
  const ListRef = useRef<HTMLDivElement>(null);
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
            ListRef.current?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <Plus size={14} />
        </button>
      </div>
      <ul
        className={css({
          overflowY: "scroll",
          height: "100%",
        })}
      >
        {pages?.map((page) => {
          return (
            <TogglePage
              key={page.id}
              page={page}
              isSelected={selectedPage === page.id}
              onClick={() => setSelectedPage(page.id)}
            />
          );
        })}
        <div ref={ListRef} />
      </ul>
    </section>
  );
};
