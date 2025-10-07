import { Input } from "@/editor/components/input";
import { useAutoSave } from "@/editor/hooks/useAutoSave";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { IEDITORPROJECT } from "@/editor/states/projects";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue } from "jotai";
import { X } from "lucide-react";
import { useState } from "react";

type TabProps = {
  project: IEDITORPROJECT;
  onClick: VoidFunction;
  onDelete: VoidFunction;
  isSelected: boolean;
};

export const Tab = ({ project, onClick, onDelete, isSelected }: TabProps) => {
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
