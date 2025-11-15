import { css } from "@stylespixelkit/css";
import { useSetAtom } from "jotai";
import { useState } from "react";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Send } from "lucide-react";
import { constants } from "../constants/color";
import { GET_EXPORT_JSON } from "../states/mode";
import { SHAPE_XD_DATA } from "../states/shape";
import { Input } from "./input";
import { Loading } from "./loading";

export const ChatTool = () => {
  const [text, setText] = useState("");

  const SET_DATA = useSetAtom(SHAPE_XD_DATA);
  const GET_SHAPES = useSetAtom(GET_EXPORT_JSON);

  const mutate = useMutation({
    mutationKey: ["chat", text],
    mutationFn: async () => {
      const { shapes } = GET_SHAPES();

      const response = await axios.post("/api/chat", {
        prompt: text,
        shapes,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log(data);

      SET_DATA(data?.data);
    },
  });

  return (
    <section
      className={
        "w-[360px] h-[140px] absolute bottom-0  m-4 p-2  border dark:border-gray-600 rounded-lg shadow-lg bg-muted"
      }
      style={{
        position: "absolute",
        bottom: 0,
      }}
    >
      <div
        className={css({
          display: "flex",
          flexDirection: "column",
          gap: "md",
          width: "100%",
          height: "100%",
        })}
      >
        <Input.withPause>
          <Input.TextArea
            value={text}
            placeholder="Write something..."
            onChange={(e) => setText(e)}
            style={{
              flex: 1,
              resize: "none",
            }}
          />
        </Input.withPause>

        <div className="w-full flex justify-end items-center">
          <button
            type="submit"
            disabled={mutate.isPending}
            className={css({
              padding: "md",
              backgroundColor: "primary",
              color: "white",
              borderRadius: "md",
              cursor: "pointer",
              opacity: mutate.isPending ? 0.7 : 1,
              "&:hover": {
                opacity: 0.9,
              },
              fontSize: "11px",
            })}
            onClick={() => {
              mutate.mutate();
            }}
          >
            {mutate.isPending ? (
              <Loading color={constants.theme.colors.white} />
            ) : (
              <Send size={14} />
            )}
          </button>
        </div>
      </div>
    </section>
  );
};
