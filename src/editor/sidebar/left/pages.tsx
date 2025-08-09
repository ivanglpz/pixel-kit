import { InputAtomText } from "@/editor/components/input-atom-text";
import {
  NEW_PAGE,
  PAGE_ID_ATOM,
  PAGES_BY_TYPE_ATOM,
} from "@/editor/states/pages";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Plus } from "lucide-react";

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
            fontSize: "md",
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
          <p
            className={css({
              fontSize: "sm",
            })}
          >
            Add
          </p>
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
            <li
              key={`page-${page.id}`}
              className={css({
                padding: "md",
                flex: 1,
                backgroundColor:
                  page.id === selectedPage ? "gray.600" : "transparent",
                _hover: {
                  backgroundColor: "gray.100",
                  _dark: {
                    backgroundColor: "gray.800",
                  },
                },
              })}
              onClick={() => setSelectedPage(page.id)}
            >
              <InputAtomText atom={page.name} />
            </li>
          );
        })}
      </ul>
    </section>
  );
};
