/* eslint-disable react-hooks/exhaustive-deps */
import { FC, ReactNode, useEffect, useRef, useState } from "react";
import { Stage } from "react-konva";
import { useEvent, useStage, useZoom } from "../core/hooks";
import { css } from "../../../styled-system/css";

type Props = {
  children: ReactNode;
};

const PixelKitEditor: FC<Props> = ({ children }) => {
  const { onWheel, zoom: stage } = useZoom();
  const { handleMouseDown, handleMouseUp, handleMouseMove, stageDataRef } =
    useEvent();

  const { config } = useStage();

  const divRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [show, setShow] = useState(false);

  const handleResize = () => {
    setShow(false);
    const divElement = divRef.current;
    if (divElement) {
      const { width, height } = divElement.getBoundingClientRect();
      setDimensions({
        width,
        height,
      });
      setTimeout(() => {
        setShow(true);
      }, 500);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const divElement = divRef.current;
    if (!divElement) return;

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(divElement);
    return () => {
      resizeObserver.unobserve(divElement);
    };
  }, []);

  return (
    <main
      ref={divRef}
      id="StageViewer"
      className={`CursorDefault ${css({
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      })}`}
      style={{
        // background: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABkAAAAZCAYAAADE6YVjAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAxSURBVHgB7dYxDQAACANBwHbFQ7BAQqd/Ab21Kanju29k9ysMgYCAgICAgICcS8fvGhWuCe+rNdorAAAAAElFTkSuQmCC")`,
        backgroundPosition: "100% 100%",
        backgroundAttachment: "fixed",
        backgroundSize: `calc(10px * ${stage.scale})`,
        backgroundColor: config.backgroundColor,
      }}
    >
      {show ? (
        <Stage
          ref={stageDataRef}
          width={dimensions.width}
          height={dimensions.height}
          onWheel={onWheel}
          scaleX={stage.scale}
          scaleY={stage.scale}
          onMouseDown={handleMouseDown}
          onMousemove={handleMouseMove}
          onMouseup={handleMouseUp}
          x={stage.x}
          y={stage.y}
        >
          {children}
        </Stage>
      ) : (
        <p
          className={css({
            color: "text",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask id="path-1-inside-1_865_433" fill="white">
              <path d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z" />
            </mask>
            <path
              d="M43.5714 11H49V27.2857H43.5714V16.4286H16.4286V43.5714H27.2857V49H11V11H43.5714ZM32.7143 38.1429V32.7143H49V38.1429H43.5714V43.5714H38.1429V49H32.7143V38.1429ZM43.5714 43.5714V49H49V43.5714H43.5714Z"
              fill="black"
            />
            <path
              d="M49 11H86V-26H49V11ZM49 27.2857V64.2857H86V27.2857H49ZM43.5714 27.2857H6.57143V64.2857H43.5714V27.2857ZM43.5714 16.4286H80.5714V-20.5714H43.5714V16.4286ZM16.4286 16.4286V-20.5714H-20.5714V16.4286H16.4286ZM16.4286 43.5714H-20.5714V80.5714H16.4286V43.5714ZM27.2857 43.5714H64.2857V6.57143H27.2857V43.5714ZM27.2857 49V86H64.2857V49H27.2857ZM11 49H-26V86H11V49ZM11 11V-26H-26V11H11ZM32.7143 32.7143V-4.28571H-4.28571V32.7143H32.7143ZM49 32.7143H86V-4.28571H49V32.7143ZM49 38.1429V75.1429H86V38.1429H49ZM43.5714 38.1429V1.14286H6.57143V38.1429H43.5714ZM38.1429 43.5714V6.57143H1.14286V43.5714H38.1429ZM38.1429 49V86H75.1429V49H38.1429ZM32.7143 49H-4.28571V86H32.7143V49ZM43.5714 49H6.57143V86H43.5714V49ZM49 49V86H86V49H49ZM49 43.5714H86V6.57143H49V43.5714ZM43.5714 48H49V-26H43.5714V48ZM12 11V27.2857H86V11H12ZM49 -9.71429H43.5714V64.2857H49V-9.71429ZM80.5714 27.2857V16.4286H6.57143V27.2857H80.5714ZM43.5714 -20.5714H16.4286V53.4286H43.5714V-20.5714ZM-20.5714 16.4286V43.5714H53.4286V16.4286H-20.5714ZM16.4286 80.5714H27.2857V6.57143H16.4286V80.5714ZM-9.71429 43.5714V49H64.2857V43.5714H-9.71429ZM27.2857 12H11V86H27.2857V12ZM48 49V11H-26V49H48ZM11 48H43.5714V-26H11V48ZM69.7143 38.1429V32.7143H-4.28571V38.1429H69.7143ZM32.7143 69.7143H49V-4.28571H32.7143V69.7143ZM12 32.7143V38.1429H86V32.7143H12ZM49 1.14286H43.5714V75.1429H49V1.14286ZM6.57143 38.1429V43.5714H80.5714V38.1429H6.57143ZM43.5714 6.57143H38.1429V80.5714H43.5714V6.57143ZM1.14286 43.5714V49H75.1429V43.5714H1.14286ZM38.1429 12H32.7143V86H38.1429V12ZM69.7143 49V38.1429H-4.28571V49H69.7143ZM6.57143 43.5714V49H80.5714V43.5714H6.57143ZM43.5714 86H49V12H43.5714V86ZM86 49V43.5714H12V49H86ZM49 6.57143H43.5714V80.5714H49V6.57143Z"
              fill="white"
              mask="url(#path-1-inside-1_865_433)"
            />
          </svg>
          Pixel Kit is loading...
        </p>
      )}
    </main>
  );
};

export default PixelKitEditor;
