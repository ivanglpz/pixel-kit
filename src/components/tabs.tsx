import {
  DELETE_PROJECT_ATOM,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
  SET_PROJECTS_FROM_TABS,
} from "@/editor/states/projects";
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
  const setDelete = useSetAtom(DELETE_PROJECT_ATOM);
  const containerRef = useRef<HTMLDivElement>(null);
  const SET = useSetAtom(SET_PROJECTS_FROM_TABS);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    SET();
  }, [user.data?.user?.userId]);
  return (
    <header
      // className={css({
      //   display: "grid",
      //   alignItems: "center",
      //   justifyContent: "center",
      //   borderBottomWidth: "1px",
      //   borderBottomStyle: "solid",
      //   borderBottomColor: "border", // ← usa el semantic token
      //   gridTemplateColumns: "36px 1fr 40px",
      //   gap: "lg",
      //   paddingLeft: "lg",
      //   paddingRight: "lg",
      // })}
      className="grid grid-cols-[33px_1fr_40px] gap-4 border-b border-border  p-2 h-12"
    >
      <section className="flex flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            router.push("/app");
          }}
          className=" w-full h-full flex items-center justify-center  bg-neutral-150 p-2 rounded-sm cursor-pointer dark:bg-neutral-700"
        >
          <Home size={16} />
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
