import { ICON_MODES_TABS } from "@/editor/icons/mode";
import {
  DELETE_PROJECT,
  IPROJECT,
  NEW_PROJECT,
  PROJECT_ID_ATOM,
  PROJECTS_ATOM,
} from "@/editor/states/projects";
import { PAUSE_MODE_ATOM } from "@/editor/states/tool";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Home, Plus, X } from "lucide-react";
import { useRouter } from "next/router";
import { useState } from "react";
import { Valid } from "./valid";

export const Tab = ({
  project,
  onClick,
  onDelete,
  isEnable,
  isSelected,
}: {
  project: IPROJECT;
  onClick: VoidFunction;
  onDelete: VoidFunction;
  isEnable: boolean;
  isSelected: boolean;
}) => {
  const [text, setText] = useAtom(project.name);
  const [hover, sethover] = useState(false);
  const mode = useAtomValue(project.MODE_ATOM);
  const [show, setShow] = useState(false);
  const setPause = useSetAtom(PAUSE_MODE_ATOM);

  return (
    <button
      className={css({
        display: "grid",
        gridTemplateColumns: "20px 100px 20px",
        gap: "md",
        alignContent: "center",
        backgroundColor: isSelected ? "primary" : "transparent",
        height: "100%",
        padding: "lg",
      })}
      onClick={onClick}
      onMouseEnter={() => sethover(true)}
      onMouseLeave={() => {
        sethover(false);
        setShow(false);
        setPause(false);
      }}
      onDoubleClick={() => {
        setShow(true);
        setPause(true);
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
        <input
          type="text"
          value={text}
          onChange={(e) => {
            setText(e?.target?.value);
            setPause(true);
          }}
          className={css({
            backgroundColor: "transparent",
            fontSize: "sm",
          })}
          onClick={() => setPause(true)}
          onBlur={() => setPause(false)}
          onMouseLeave={() => setPause(false)}
        />
      ) : (
        <span
          className={css({
            fontSize: "sm",
            flex: 1,
            textAlign: "left",
            lineClamp: 1,
            wordBreak: "break-all",
            lineHeight: 1.14,
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
        <Valid isValid={hover && isEnable}>
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
            <X size={14} />
          </button>
        </Valid>
      </div>
    </button>
  );
};
export const TabsProjects = () => {
  const router = useRouter();
  const listProjects = useAtomValue(PROJECTS_ATOM);
  const setNew = useSetAtom(NEW_PROJECT);
  const [selected, setSelected] = useAtom(PROJECT_ID_ATOM);
  const setDelete = useSetAtom(DELETE_PROJECT);
  return (
    <header
      className={css({
        display: "grid",
        alignItems: "center",
        justifyContent: "center",
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
        borderBottomColor: "border", // ← usa el semantic token
        gridTemplateColumns: "25px 1fr 25px",
        gap: "lg",
        paddingLeft: "lg",
        paddingRight: "lg",
      })}
    >
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
        <Home size={18} />
      </button>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          gap: "md",
          overflow: "hidden",
          overflowX: "scroll",
          alignItems: "center",
          height: "100%",
        })}
      >
        {listProjects?.map((e) => {
          return (
            <Tab
              key={e?.ID}
              isSelected={e?.ID === selected}
              project={e}
              isEnable={listProjects?.length > 1}
              onClick={() => {
                setSelected(e.ID);
                router.push("/app/project");
              }}
              onDelete={() => {
                setDelete(e?.ID);
              }}
            />
          );
        })}
      </div>
      <div
        className={css({
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        })}
      >
        <button
          onClick={() => {
            setNew();
          }}
          className={css({
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
          })}
        >
          <Plus size={22} />
        </button>
      </div>
    </header>
  );
};
