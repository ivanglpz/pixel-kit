import { constants } from "@/editor/constants/color";
import {
  BUILD_PROJECS_FROM_TABS,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
  REMOVE_PROJECT_TAB_ATOM,
} from "@/editor/states/projects";
import { GET_TABS_BY_USER, TABS_PERSIST_ATOM } from "@/editor/states/tabs";
import { userAtom } from "@/jotai/user";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Home, Plus } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { Profile } from "./Profile";
import { Tab } from "./tab";

export const TabsProjects = () => {
  const router = useRouter();
  const listProjects = useAtomValue(PROJECTS_ATOM);
  const [selected, setSelected] = useAtom(PROJECT_ID_ATOM);
  const setDelete = useSetAtom(REMOVE_PROJECT_TAB_ATOM);
  const containerRef = useRef<HTMLDivElement>(null);
  const SET = useSetAtom(BUILD_PROJECS_FROM_TABS);
  useAtomValue(TABS_PERSIST_ATOM);
  const user = useAtomValue(userAtom);
  useAtomValue(GET_TABS_BY_USER);

  useEffect(() => {
    SET();
  }, [user.data?.user?.userId]);
  return (
    <header className="grid grid-cols-[33px_1fr_40px] gap-4 border-b border-border  p-2 h-12">
      <section className="flex flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            router.push("/app");
          }}
          // className=" w-full h-full flex items-center justify-center  bg-blue-400 p-2 rounded-sm cursor-pointer "
          className={css({
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "primary",
            padding: "5px",
            cursor: "pointer",
            borderRadius: "md",
          })}
        >
          <Home
            size={constants.icon.size + 6}
            strokeWidth={2}
            color={constants.theme.colors.white}
          />
        </button>
      </section>
      <div
        className="flex flex-row items-center justify-start h-full w-full overflow-x-scroll overflow-y-hidden gap-2 [&::-webkit-scrollbar]:hidden [scrollbar-width:none]"
        ref={containerRef}
      >
        {listProjects?.map((e) => {
          return (
            <Tab
              key={e?.ID}
              isSelected={e?.ID === selected}
              project={e}
              onClick={() => {
                setSelected(e.ID);
                router.push(`/app/project/${e.ID}`);
              }}
              onDelete={() => {
                setDelete(e?.ID);
              }}
            />
          );
        })}
        <button
          onClick={() => {
            router.push("/app/project/create");
          }}
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "lg",
          })}
        >
          <Plus size={16} />
        </button>
      </div>
      <Profile />
    </header>
  );
};
