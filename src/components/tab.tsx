import { Input } from "@/editor/components/input";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { IPROJECT } from "@/editor/states/projects";
import { START_TIMER_ATOM } from "@/editor/states/timer";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { X } from "lucide-react";
import { useState } from "react";

type TabProps = {
  project: IPROJECT;
  onClick: VoidFunction;
  onDelete: VoidFunction;
  isSelected: boolean;
};

export const Tab = ({ project, onClick, onDelete, isSelected }: TabProps) => {
  const [text, setText] = useAtom(project.name);
  const mode = useAtomValue(project.MODE_ATOM);
  const [show, setShow] = useState(false);
  const START = useSetAtom(START_TIMER_ATOM);
  return (
    <div
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
        width: "200px",
        padding: "sm",
        borderRadius: "md",
        flexShrink: 0,
        cursor: "pointer",
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
              START();
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
    </div>
  );
};
