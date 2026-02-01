import { Button } from "@/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Input as InputShadcn } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/editor/components/input";
import { ICON_MODES_TABS } from "@/editor/icons/mode";
import { IPROJECT } from "@/editor/states/projects";
import { START_TIMER_ATOM } from "@/editor/states/timer";
import { css } from "@stylespixelkit/css";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Clipboard, X } from "lucide-react";
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
  const [isPublic, setIsPublic] = useAtom(project.ISPUBLIC);
  const [show, setShow] = useState(false);
  const START = useSetAtom(START_TIMER_ATOM);
  return (
    <ContextMenu>
      <ContextMenuTrigger>
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
      </ContextMenuTrigger>
      <ContextMenuContent className="p-3 flex flex-col w-[260px] h-[200px] text-[12px] gap-4">
        <div className="flex flex-col gap-1">
          <p
            className={css({
              fontSize: "sm",
              fontWeight: 600,
            })}
          >
            Name
          </p>
          <Input.withPause>
            <InputShadcn
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                START();
              }}
            />
          </Input.withPause>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p
            className={css({
              fontSize: "sm",
              fontWeight: 600,
            })}
          >
            Public
          </p>
          <Switch
            checked={isPublic}
            onCheckedChange={() => {
              setIsPublic(!isPublic);
              START();
            }}
          />
        </div>
        {isPublic ? (
          <div className="flex flex-col gap-1">
            <p
              className={css({
                fontSize: "sm",
                fontWeight: 600,
              })}
            >
              URL
            </p>
            <div className="flex flex-row gap-2">
              <Input.withPause>
                <InputShadcn
                  value={`${window.location.host}/project/${project?.ID}`}
                />
              </Input.withPause>
              <Button
                variant={"default"}
                className="w-10 flex items-center justify-center"
                onClick={() => {}}
              >
                <Clipboard size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </ContextMenuContent>
    </ContextMenu>
  );
};
