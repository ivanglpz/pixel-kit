/* eslint-disable react-hooks/exhaustive-deps */
import { css } from "@stylespixelkit/css";
import { FC, ReactNode, useEffect, useRef } from "react";
import LayoutEditorSidebarRight from "./_layoutImage";
import { useReference } from "../hooks/useReference";

type Props = {
  children: ReactNode;
};

const LayoutPixelEditor: FC<Props> = ({ children }) => {
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
          gridTemplateColumns: "240px 1fr 240px",
        })}
      >
        <LayoutEditorSidebarRight />

        {children}
        <LayoutEditorSidebarRight />
      </div>
    </main>
  );
};

export default LayoutPixelEditor;
