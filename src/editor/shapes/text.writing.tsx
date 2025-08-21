// /* eslint-disable react-hooks/exhaustive-deps */
// import { PrimitiveAtom, useAtom, useSetAtom } from "jotai";
// import { createPortal } from "react-dom";
// import { Html } from "react-konva-utils";

// import { constants } from "../constants/color";
// import { ALL_SHAPES } from "../states/shapes";
// import { PAUSE_MODE_ATOM } from "../states/tool";
// import { IShape, WithInitialValue } from "./type.shape";

// type Props = {
//   item: ALL_SHAPES;
//   onLeave: VoidFunction;
// };

// export const PortalTextWriting = ({ item, onLeave }: Props) => {
//   const [box, setBox] = useAtom(
//     item.state as PrimitiveAtom<IShape> & WithInitialValue<IShape>
//   );
//   const setPause = useSetAtom(PAUSE_MODE_ATOM);

//   const areaPosition = {
//     x: box.x,
//     y: box.y,
//   };
//   const sidebarElement = document.getElementById("pixel-kit-stage");

//   return (
//     <Html
//       divProps={{
//         style: {
//           position: "absolute",
//           top: 0,
//           left: 0,
//         },
//       }}
//     >
//       {sidebarElement && sidebarElement instanceof Element
//         ? createPortal(
//             <>
//               <textarea
//                 autoFocus
//                 onFocus={() => {
//                   setPause(true);
//                 }}
//                 onClick={() => setPause(true)}
//                 onBlur={onLeave}
//                 onMouseLeave={onLeave}
//                 style={{
//                   position: "absolute",
//                   top: areaPosition?.y - 1 + "px",
//                   left: areaPosition?.x - 1 + "px",
//                   fontFamily: box?.fontFamily,
//                   width: Number(box.width) > 100 ? box.width + "px" : "220px",
//                   height:
//                     Number(box.height) > 100 ? box.height + "px" : "100px",
//                   resize: "none",
//                   background: "red",
//                   fontWeight: box?.fontWeight ?? "normal",
//                   fontSize: box.fontSize + "px",
//                   border: `1px solid ${constants.theme.colors.primary}`,
//                   padding: "0px",
//                   margin: "0px",
//                   overflow: "hidden",
//                   outline: "none",
//                   textAlign: "left",
//                   color:
//                     box?.fills?.filter((e) => e?.visible)?.at(0)?.color ??
//                     "white",
//                   lineHeight: 1.45,
//                   textShadow:
//                     Number(
//                       box?.effects?.filter(
//                         (e) => e?.visible && e?.type === "shadow"
//                       )?.length
//                     ) > 0
//                       ? `${
//                           box?.effects
//                             ?.filter((e) => e?.visible && e?.type === "shadow")
//                             .at(0)?.x
//                         }px ${
//                           box?.effects
//                             ?.filter((e) => e?.visible && e?.type === "shadow")
//                             .at(0)?.y
//                         }px  ${
//                           box?.effects
//                             ?.filter((e) => e?.visible && e?.type === "shadow")
//                             .at(0)?.color
//                         }`
//                       : "none",
//                 }}
//                 value={box.text ?? ""}
//                 onChange={(e) => {
//                   setBox((prev) => ({
//                     ...prev,
//                     text: e.target.value,
//                   }));
//                 }}
//               />
//             </>,
//             sidebarElement
//           )
//         : null}
//     </Html>
//   );
// };
