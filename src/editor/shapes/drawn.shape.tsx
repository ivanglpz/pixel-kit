import Konva from "konva";
import { MutableRefObject, useEffect, useRef } from "react";
import { Line, Transformer } from "react-konva";
import { IShapeWithEvents } from "./type.shape";

const AtomElementDraw = (item: IShapeWithEvents) => {
  const { draggable, isSelected } = item;
  const shapeRef = useRef<Konva.Line>();
  const trRef = useRef<Konva.Transformer>();

  useEffect(() => {
    if (isSelected) {
      if (trRef.current && shapeRef.current) {
        trRef.current.nodes([shapeRef.current]);
        trRef.current?.getLayer()?.batchDraw();
      }
    }
  }, [isSelected]);
  return null;
  // return (
  //   <>
  //     <Line
  //       {...item}
  //       id={item?.id}
  //       points={item?.points}
  //       stroke={item?.style?.stroke}
  //       shadowColor={item?.style?.shadowColor}
  //       shadowOpacity={item?.style?.shadowOpacity}
  //       shadowOffsetX={item?.style?.shadowOffset?.x}
  //       shadowOffsetY={item?.style?.shadowOffset?.y}
  //       shadowBlur={item?.style?.shadowBlur}
  //       strokeWidth={item?.style?.strokeWidth}
  //       globalCompositeOperation="source-over"
  //       lineCap="round"
  //       lineJoin="round"
  //       // rotation={rotate}
  //       draggable={draggable}
  //       ref={shapeRef as MutableRefObject<Konva.Line>}
  //       onClick={() => onSelect(item)}
  //       onTap={() => onSelect(item)}
  //       onDragEnd={(e) => {
  //         onChange({
  //           ...item,
  //           x: e.target.x(),
  //           y: e.target.y(),
  //         });
  //       }}
  //       onTransformEnd={(e) => {
  //         const rotate = e.target.rotation();
  //         if (shapeRef?.current) {
  //           const node = shapeRef.current;
  //           const scaleX = node.scaleX();
  //           const scaleY = node.scaleY();
  //           onChange({
  //             ...item,
  //             x: node.x(),
  //             y: node.y(),
  //             rotate,
  //             width: Math.max(5, node.width() * scaleX),
  //             height: Math.max(node.height() * scaleY),
  //           });
  //         }
  //       }}
  //     />
  //     {isSelected && (
  //       <Transformer
  //         ref={trRef as MutableRefObject<Konva.Transformer>}
  //         keepRatio
  //         ignoreStroke
  //         enabledAnchors={[
  //           "top-right",
  //           "top-left",
  //           "bottom-left",
  //           "bottom-right",
  //         ]}
  //         boundBoxFunc={(oldBox, newBox) => {
  //           if (newBox.width < 5 || newBox.height < 5) {
  //             return oldBox;
  //           }
  //           return newBox;
  //         }}
  //       />
  //     )}
  //   </>
  // );
};

export default AtomElementDraw;
