import { Text } from "react-konva";
import { chooseColor } from "../utils/chooseColor";

type ShapeLabelProps = {
  x: number;
  y: number;
  label: string;
  color: string;
};

export const ShapeLabel = ({ x, y, label, color }: ShapeLabelProps) => {
  return (
    <Text
      x={x}
      y={y - 30}
      text={`${label.slice(0, 25)}`}
      fill={chooseColor(color)}
      fontStyle="semibold"
    ></Text>
  );
};
