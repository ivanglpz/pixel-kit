import { InputAtomText } from "@/editor/components/input-atom-text";
import {
  IPage,
  NEW_PAGE,
  PAGE_ID_ATOM,
  PAGES_BY_TYPE_ATOM,
} from "@/editor/states/pages";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { useState } from "react";

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
  const [name, setName] = useAtom(page.name);
  return (
    <li
      key={`page-${page.id}`}
      className={css({
        padding: "md",
        flex: 1,
        borderRadius: "md",
        backgroundColor: isSelected ? "gray.900" : "transparent",
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
      onBlur={() => setShow(false)}
      // quiero que si el cursor se salga entonces lo ponga en show false
      onMouseLeave={() => setShow(false)}
      //  onClick={onClick}
    >
      {show ? (
        <InputAtomText atom={page.name} />
      ) : (
        <span
          className={css({
            fontSize: "sm",
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
          onClick={() => newPage()}
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
      </ul>
    </section>
  );
};
