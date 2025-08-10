import { css } from "@stylespixelkit/css";
import axios from "axios";
import { atom, useAtomValue, useSetAtom } from "jotai";
import { FormEvent, useEffect, useState } from "react";
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

const autoshapes = [
  {
    id: "0d1d49a2-0a47-4c78-a1b9-e2b3b6076153",
    tool: "BOX",
    x: 0,
    y: 0,
    parentId: null,
    rotation: 0,
    isLocked: false,
    label: "Main Background",
    fills: [
      {
        color: "#ffffff",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1280,
    height: 832,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "b8b9a8d6-4d1a-4b6f-b6f6-5188c649f41e",
    tool: "GROUP",
    x: 0,
    y: 0,
    parentId: null,
    rotation: 0,
    isLocked: false,
    label: "Header",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1280,
    height: 100,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "f9291c99-4349-4e71-8a60-5626b4f5828f",
    tool: "TEXT",
    x: 20,
    y: 30,
    parentId: "b8b9a8d6-4d1a-4b6f-b6f6-5188c649f41e",
    rotation: 0,
    isLocked: false,
    label: "Logo",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 100,
    height: 40,
    text: "Logo",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 24,
    fontWeight: "bold",
    bezier: false,
  },
  {
    id: "2afadce2-8f78-44d3-bdcc-23ec58c14c7c",
    tool: "TEXT",
    x: 120,
    y: 30,
    parentId: "b8b9a8d6-4d1a-4b6f-b6f6-5188c649f41e",
    rotation: 0,
    isLocked: false,
    label: "Nav Menu",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    text: "Home | Shop | About | Contact",
    width: 600,
    height: 40,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "center",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "5b651493-a940-4935-aee9-8690c69d4acd",
    tool: "IMAGE",
    x: 0,
    y: 100,
    parentId: null,
    rotation: 0,
    isLocked: false,
    label: "Banner Image",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1280,
    height: 400,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    src: "./placeholder.svg",
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "2f5739b7-49d8-400a-abf8-233fa2c65367",
    tool: "GROUP",
    x: 0,
    y: 500,
    parentId: null,
    rotation: 0,
    isLocked: false,
    label: "Product Section",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1280,
    height: 250,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "c277efd6-bfb3-45e2-8e11-97118a4dde6c",
    tool: "GROUP",
    x: 20,
    y: 0,
    parentId: "2f5739b7-49d8-400a-abf8-233fa2c65367",
    rotation: 0,
    isLocked: false,
    label: "Product Box 1",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 250,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "70717f16-c184-45b8-aba6-c9b6518be53b",
    tool: "IMAGE",
    x: 0,
    y: 0,
    parentId: "c277efd6-bfb3-45e2-8e11-97118a4dde6c",
    rotation: 0,
    isLocked: false,
    label: "Product Image 1",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 150,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    src: "./placeholder.svg",
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "cc517388-441b-454d-84e2-b651d32200c5",
    tool: "TEXT",
    x: 0,
    y: 160,
    parentId: "c277efd6-bfb3-45e2-8e11-97118a4dde6c",
    rotation: 0,
    isLocked: false,
    label: "Product Name 1",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "Product Name 1",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "c7e70976-5ac5-49ee-97a3-0efb5aabed3e",
    tool: "TEXT",
    x: 0,
    y: 200,
    parentId: "c277efd6-bfb3-45e2-8e11-97118a4dde6c",
    rotation: 0,
    isLocked: false,
    label: "Product Price 1",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "$99.99",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "d3e28dcf-8a1f-4916-bf52-b0c495d37804",
    tool: "GROUP",
    x: 340,
    y: 0,
    parentId: "2f5739b7-49d8-400a-abf8-233fa2c65367",
    rotation: 0,
    isLocked: false,
    label: "Product Box 2",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 250,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "e4d55415-a833-45c9-bd1d-fcfb282a35e9",
    tool: "IMAGE",
    x: 0,
    y: 0,
    parentId: "d3e28dcf-8a1f-4916-bf52-b0c495d37804",
    rotation: 0,
    isLocked: false,
    label: "Product Image 2",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 150,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    src: "./placeholder.svg",
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "edabe6aa-caef-46b6-8440-206297f00225",
    tool: "TEXT",
    x: 0,
    y: 160,
    parentId: "d3e28dcf-8a1f-4916-bf52-b0c495d37804",
    rotation: 0,
    isLocked: false,
    label: "Product Name 2",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "Product Name 2",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "0c79c9f5-c9ec-4b6d-8425-affbc8bb1e3b",
    tool: "TEXT",
    x: 0,
    y: 200,
    parentId: "d3e28dcf-8a1f-4916-bf52-b0c495d37804",
    rotation: 0,
    isLocked: false,
    label: "Product Price 2",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "$149.99",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "f107cdb2-6282-42c8-a93d-3adf95a217c2",
    tool: "GROUP",
    x: 660,
    y: 0,
    parentId: "2f5739b7-49d8-400a-abf8-233fa2c65367",
    rotation: 0,
    isLocked: false,
    label: "Product Box 3",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 250,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "1a1467e7-4c6e-4b05-9a07-95112d9043bf",
    tool: "IMAGE",
    x: 0,
    y: 0,
    parentId: "f107cdb2-6282-42c8-a93d-3adf95a217c2",
    rotation: 0,
    isLocked: false,
    label: "Product Image 3",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 150,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    src: "./placeholder.svg",
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "85f41596-6055-4ae9-80e4-8ff7b5faa3de",
    tool: "TEXT",
    x: 0,
    y: 160,
    parentId: "f107cdb2-6282-42c8-a93d-3adf95a217c2",
    rotation: 0,
    isLocked: false,
    label: "Product Name 3",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "Product Name 3",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "af39e889-6b85-4d2f-9ea9-c506c7d3779e",
    tool: "TEXT",
    x: 0,
    y: 200,
    parentId: "f107cdb2-6282-42c8-a93d-3adf95a217c2",
    rotation: 0,
    isLocked: false,
    label: "Product Price 3",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "$199.99",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "fba0f7d6-e6d8-4e5b-92aa-e1bcac56ebd7",
    tool: "GROUP",
    x: 980,
    y: 0,
    parentId: "2f5739b7-49d8-400a-abf8-233fa2c65367",
    rotation: 0,
    isLocked: false,
    label: "Product Box 4",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 250,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "346556ee-58f7-40b8-93d7-c76a57d163a5",
    tool: "IMAGE",
    x: 0,
    y: 0,
    parentId: "fba0f7d6-e6d8-4e5b-92aa-e1bcac56ebd7",
    rotation: 0,
    isLocked: false,
    label: "Product Image 4",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 150,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    src: "./placeholder.svg",
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "13cb5e6f-6f74-44e5-8c31-a0c628bb1da9",
    tool: "TEXT",
    x: 0,
    y: 160,
    parentId: "fba0f7d6-e6d8-4e5b-92aa-e1bcac56ebd7",
    rotation: 0,
    isLocked: false,
    label: "Product Name 4",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "Product Name 4",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "d0949445-96f8-4404-8d6f-54ff72298398",
    tool: "TEXT",
    x: 0,
    y: 200,
    parentId: "fba0f7d6-e6d8-4e5b-92aa-e1bcac56ebd7",
    rotation: 0,
    isLocked: false,
    label: "Product Price 4",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 300,
    height: 30,
    text: "$249.99",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "middle",
    fontSize: 18,
    bezier: false,
  },
  {
    id: "d711b7ec-4390-468f-8dee-b72d099f18f2",
    tool: "GROUP",
    x: 0,
    y: 750,
    parentId: null,
    rotation: 0,
    isLocked: false,
    label: "Footer",
    fills: [],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1280,
    height: 82,
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "left",
    verticalAlign: "top",
    bezier: false,
  },
  {
    id: "6f865683-aff1-4e1a-8a03-f2e415dd94da",
    tool: "TEXT",
    x: 20,
    y: 20,
    parentId: "d711b7ec-4390-468f-8dee-b72d099f18f2",
    rotation: 0,
    isLocked: false,
    label: "Footer Text",
    fills: [
      {
        color: "#000000",
        opacity: 1,
        visible: true,
      },
    ],
    strokes: [],
    strokeWidth: 0,
    effects: [],
    bordersRadius: [],
    width: 1240,
    height: 42,
    text: "© 2023 E-commerce Site. All Rights Reserved.",
    visible: true,
    isWritingNow: false,
    isBlocked: false,
    dash: 0,
    opacity: 1,
    align: "center",
    verticalAlign: "middle",
    fontSize: 16,
    bezier: false,
  },
];
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
      console.log(JSON.parse(assistantMessage.content ?? "[]"), "array");

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

  useEffect(() => {
    setShapes(
      autoshapes?.map((e: IShape) => {
        return {
          id: e.id,
          pageId,
          parentId: e?.parentId,
          state: atom(e as IShape),
          tool: e?.tool as IKeyMethods,
        };
      })
    );
  }, []);

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
