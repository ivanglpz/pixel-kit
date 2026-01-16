import { atom } from "jotai";
import { Boxes } from "lucide-static";
import { useMemo } from "react";
import { Text } from "react-konva";
import { CreateShapeSchema } from "../helpers/shape-schema";
import { chooseColor } from "../utils/chooseColor";
import { SVG } from "../utils/svg";
import { SHAPE_ICON } from "./icon.shape";

type ShapeLabelProps = {
  x: number;
  y: number;
  label: string;
  color: string;
};
console.log(SVG.Encode(Boxes), "Boxes");

export const ShapeLabel = ({ x, y, label, color }: ShapeLabelProps) => {
  const state = useMemo(
    () =>
      atom(
        CreateShapeSchema({
          x: atom(x),
          y: atom(y - 18),
          image: atom({
            src: SVG.Encode(Boxes),
            width: 24,
            height: 24,
            name: "icon",
          }),
          width: atom(15),
          height: atom(15),
          strokeColor: atom<string>(chooseColor(color)),
          strokeWidth: atom(1),
        })
      ),
    [x, y, color]
  );
  return (
    <>
      <SHAPE_ICON
        shape={{
          id: "label-icon",
          state: state,
        }}
        options={{
          background: color,
          isLocked: true,
          showLabel: false,
        }}
      />
      <Text
        x={x + 18}
        y={y - 30}
        text={`${label.slice(0, 25)}`}
        fill={chooseColor(color)}
        fontStyle="semibold"
      ></Text>
    </>
  );
};
