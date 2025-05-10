/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { FC, ReactNode, useEffect, useRef } from "react";
import LogoApp from "../Tools";
import LayoutEditorSidebarRight from "../right";
import { useReference } from "@/editor/hooks/reference";

type Props = {
  children: ReactNode;
};

export const LayoutPixelEditorDraw: FC<Props> = ({ children }) => {
  const constraintsRef = useRef(null);

  const { handleSetRef } = useReference({
    type: "CONTAINER",
    ref: constraintsRef,
  });
  useEffect(() => {
    handleSetRef({
      type: "CONTAINER",
      ref: constraintsRef,
    });
  }, [constraintsRef]);

  return (
    <main
      className={css({
        height: "100dvh",
        width: "100dvw",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "black",
      })}
    >
      <div
        className={css({
          width: "100dvw",
          height: "100dvh",
          display: "grid",
          gridTemplateColumns: "1fr 240px",
        })}
      >
        <div
          className={css({
            height: "100%",
            width: "100%",
            position: "relative",
          })}
          ref={constraintsRef}
        >
          {children}
        </div>
        <LayoutEditorSidebarRight />
      </div>
    </main>
  );
};
