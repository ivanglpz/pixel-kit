import { css } from "@stylespixelkit/css";
import axios from "axios";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { FormEvent, useState } from "react";
import { useTool } from "../hooks";
import { IShape } from "../shapes/type.shape";
import { STAGE_DIMENSION_ATOM } from "../states/dimension";
import { PAGE_ID_ATOM } from "../states/pages";
import ALL_SHAPES_ATOM from "../states/shapes";
import { IKeyMethods } from "../states/tool";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dimension = useAtomValue(STAGE_DIMENSION_ATOM);
  const pageId = useAtomValue(PAGE_ID_ATOM);
  const setShapes = useSetAtom(ALL_SHAPES_ATOM);
  const { setTool } = useTool();
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const prompt = `
You are a senior UI programmer creating user interface designs for PC or Mobile based on the USER REQUEST.

The designs can represent various scenarios such as:

An e-commerce website page

A personal portfolio

A mobile user settings screen

A mobile chat screen

Device dimensions:

PC: 1280px x 832px

Mobile: 440px x 956px

Resources:
For images, use: ./placeholder.svg (set this URL in the src property of IShape when the element is an image).

For icons (SVG), do not include them for now.

Background and Text Rules:
If you use a GROUP or BOX as the base background of the design, set its fills[0].color to #ffffff (pure white).

Any text element placed directly on a white background must have its fills[0].color set to a dark color (e.g., black #000000) for good contrast.

If text is placed on a non-white background (e.g., inside a group or box with colored fills), choose the text’s fills[0].color to ensure high contrast with that background color.

Consider that a text element can be inside another text’s area or inside a group with any background color, so the fills[0].color of the text must always ensure readability.

Nesting and Positioning Rules:
When adding elements inside a GROUP or BOX, the element’s x and y coordinates must be relative to the parent container’s top-left corner.

Do not position nested elements as if they were on the main canvas; their coordinates must be adjusted to the container’s coordinate space.

Avoid using arbitrary fixed positions like x: 10, y: 10 unless they are correct relative to the parent container’s dimensions and position.

Nesting Constraint:
Do not nest elements inside a BOX. Nesting of elements is only allowed inside GROUP elements.

If you want to nest elements, always use GROUP elements as containers, which also have styles.

Schema:
You must generate objects following this schema exactly. All properties must be present.
If a property is not needed, set it to:

"" for text

[] for arrays

false for booleans

0 for numbers


export type Fill = {
  color: string;
  opacity: number;
  visible: boolean;
};

export type Stroke = {
  color: string;
  visible: boolean;
};

export type Effect = {
  type: "shadow" | "blur" | "glow";
  visible: boolean;
  x: number;
  y: number;
  color: string;
  opacity: number;
  blur: number;
};

export type IShape = {
  id: string;
  tool: "BOX" | "TEXT" | "CIRCLE" | "LINE" | "IMAGE" | "DRAW" | "GROUP";
  x: number;
  y: number;
  parentId: string | null;
  rotation: number;
  isLocked: boolean;
  label: string;
  fills: Fill[];
  strokes: Stroke[];
  strokeWidth: number;
  effects: Effect[];
  bordersRadius: number[];
  width?: number;
  height?: number;
  text?: string;
  visible: boolean;
  isWritingNow: boolean;
  resolution?: "portrait" | "landscape";
  isBlocked: boolean;
  points?: number[];
  src?: string;
  closed?: boolean;
  rotate?: number;
  lineCap?: string;
  lineJoin?: string;
  dash: number;
  opacity: number;
  align: "left" | "center" | "right" | "justify";
  verticalAlign: "top" | "middle" | "bottom";
  fontSize?: number;
  fontStyle?: string;
  fontFamily?: string;
  textDecoration?: string;
  fontWeight?: "bold" | "normal" | "lighter" | "bolder" | "100" | "900";
  borderRadius?: number;
  isAllBorderRadius?: boolean;
  zIndex?: number;
  bezier: boolean;
};
UUIDs and Hierarchy Rules:
You must generate unique id values as UUIDs for each element.

To group elements, set their parentId to the id of a GROUP element.

Groups can contain other groups (nested grouping is allowed).

Output Rules:
Return an array of IShape objects.

Do not format as Markdown, code blocks, or template strings.

No comments, greetings, or explanations.

Must start with [ and end with ] so it can be directly parsed as JSON.

USER REQUEST

${input}

`;

      console.log(prompt, "prompt");

      const response = await axios.post("/api/chat", {
        messages: [
          ...messages,
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const assistantMessage = response.data.message;

      setShapes(
        JSON.parse(assistantMessage.content ?? "[]")?.map((e: IShape) => {
          return {
            id: e.id,
            pageId,
            parentId: e?.parentId,
            state: atom(e as IShape),
            tool: e?.tool as IKeyMethods,
          };
        })
      );
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        height: "100%",
        gap: "lg",
      })}
    >
      {/* Chat History */}
      <div
        className={css({
          flex: 1,
          overflowY: "auto",
          padding: "md",
          display: "flex",
          flexDirection: "column",
          gap: "md",
          backgroundColor: "bg.muted",
          borderRadius: "md",
        })}
      >
        {messages.map((message, index) => (
          <div
            key={index}
            className={css({
              padding: "md",
              backgroundColor: message.role === "user" ? "primary" : "bg",
              color: message.role === "user" ? "white" : "text",
              borderRadius: "md",
              alignSelf: message.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "80%",
              fontSize: "11px",
            })}
          >
            {message.content}
          </div>
        ))}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "md",
        })}
      >
        <textarea
          value={input}
          onFocus={() => setTool("WRITING")}
          onChange={(e) => setInput(e.target.value)}
          onClick={() => {
            setTool("WRITING");
          }}
          placeholder="Type your message..."
          className={css({
            padding: "md",
            borderRadius: "md",
            backgroundColor: "bg.muted",
            borderWidth: "1px",
            borderStyle: "solid",
            borderColor: "border",
            color: "text",
            resize: "none",
            minHeight: "60px",
            outline: "none",
            "&:focus": {
              borderColor: "primary",
            },
            fontSize: "sm",
          })}
        />
        <button
          type="submit"
          disabled={isLoading}
          className={css({
            padding: "md",
            backgroundColor: "primary",
            color: "white",
            borderRadius: "md",
            cursor: "pointer",
            opacity: isLoading ? 0.7 : 1,
            "&:hover": {
              opacity: 0.9,
            },
            fontSize: "11px",
          })}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>
      </form>
    </div>
  );
};
