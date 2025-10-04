import { Input } from "@/editor/components/input";
import { useAutoSave } from "@/editor/hooks/useAutoSave";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import {
  DELETE_PROJECT,
  IEDITORPROJECT,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
  SET_PROJECTS_FROM_TABS,
} from "@/editor/states/projects";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Home, Plus, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Profile } from "./Profile";

const Tab = ({
  project,
  onClick,
  onDelete,
  isSelected,
}: {
  project: IEDITORPROJECT;
  onClick: VoidFunction;
  onDelete: VoidFunction;
  isSelected: boolean;
}) => {
  const [text, setText] = useAtom(project.name);
  const mode = useAtomValue(project.MODE_ATOM);
  const [show, setShow] = useState(false);
  const { debounce } = useAutoSave();

  return (
    <button
      className={css({
        display: "grid",
        gridTemplateColumns: "20px 1fr 20px",
        gap: "md",
        alignContent: "center",
        alignItems: "center",
        _dark: {
          backgroundColor: isSelected ? "gray.700" : "transparent",
        },
        backgroundColor: isSelected ? "gray.150" : "transparent",
        height: "100%",
        width: "190px",
        minWidth: "190px",
        paddingLeft: "md",
        paddingRight: "md",
      })}
      onClick={onClick}
      onMouseLeave={() => {
        setShow(false);
      }}
      onDoubleClick={() => {
        setShow(true);
      }}
    >
      <div
        className={css({
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        })}
      >
        {ICON_MODES_TABS[mode]}
      </div>
      {show ? (
        <Input.withPause>
          <Input.Text
            value={text}
            onChange={(e) => {
              setText(e);
              debounce.execute();
            }}
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
            textAlign: "left",
            lineClamp: 1,
            wordBreak: "break-all",
          })}
        >
          {text}
        </span>
      )}

      <div
        className={css({
          display: "flex",
        })}
      >
        <button
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          })}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <X size={16} />
        </button>
      </div>
    </button>
  );
};
export const TabsProjects = () => {
  const router = useRouter();
  const listProjects = useAtomValue(PROJECTS_ATOM);
  const [selected, setSelected] = useAtom(PROJECT_ID_ATOM);
  const setDelete = useSetAtom(DELETE_PROJECT);
  const containerRef = useRef<HTMLDivElement>(null);
  const SET = useSetAtom(SET_PROJECTS_FROM_TABS);
  useEffect(() => {
    SET();
  }, []);
  return (
    <header
      className={css({
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "border", // ← usa el semantic token
        gridTemplateColumns: "20px 1fr 40px",
        gap: "lg",
        paddingLeft: "lg",
        paddingRight: "lg",
      })}
    >
      <section className="flex flex-row items-center justify-center gap-4">
        <button
          onClick={() => {
            router.push("/app");
          }}
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          })}
        >
          <Home size={16} />
        </button>
      </section>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          overflow: "hidden",
          overflowX: "scroll",
          alignItems: "center",
          height: "100%",
        })}
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
