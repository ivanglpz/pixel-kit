import { useMemo } from "react";
import { Circle, Group, Rect, Text } from "react-konva";
import { chooseColor } from "../utils/chooseColor";

type ShapeIdentifierProps = {
  x: number;
  y: number;
  label: string;
  color: string;
  isComponent: boolean;
};

const CHIP_HEIGHT = 18;
const CHIP_RADIUS = 9;
const CHIP_OFFSET_Y = 24;
const CHIP_PADDING_X = 8;
const CHIP_TEXT_SIZE = 10;
const CHIP_MARKER_RADIUS = 3;
const CHIP_MARKER_GAP = 4;
const MAX_LABEL_LENGTH = 16;

export const ShapeIdentifier = ({
  x,
  y,
  label,
  color,
  isComponent,
}: ShapeIdentifierProps) => {
  const textColor = useMemo(() => chooseColor(color), [color]);
  const labelText = useMemo(() => {
    return label.trim().replace(/\s+/g, " ").slice(0, MAX_LABEL_LENGTH);
  }, [label]);

  const chipFill =
    textColor === "#FFFFFF" ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.18)";
  const chipStroke =
    textColor === "#FFFFFF" ? "rgba(255,255,255,0.28)" : "rgba(15,23,42,0.3)";

  const markerOffset = isComponent
    ? CHIP_MARKER_RADIUS * 2 + CHIP_MARKER_GAP
    : 0;
  const chipWidth = Math.max(
    44,
    Math.min(164, labelText.length * 6.2 + CHIP_PADDING_X * 2 + markerOffset),
  );
  const chipY = y - CHIP_OFFSET_Y;
  const textX = x + CHIP_PADDING_X + markerOffset;

  if (!labelText) return null;

  return (
    <Group listening={false}>
      <Rect
        x={x}
        y={chipY}
        width={chipWidth}
        height={CHIP_HEIGHT}
        cornerRadius={CHIP_RADIUS}
        fill={chipFill}
        stroke={chipStroke}
        strokeWidth={1}
      />
      {isComponent ? (
        <Circle
          x={x + CHIP_PADDING_X + CHIP_MARKER_RADIUS}
          y={chipY + CHIP_HEIGHT / 2}
          radius={CHIP_MARKER_RADIUS}
          fill={textColor}
          opacity={0.9}
        />
      ) : null}
      <Text
        x={textX}
        y={chipY + 4}
        text={labelText}
        fill={textColor}
        fontSize={CHIP_TEXT_SIZE}
        fontStyle="bold"
        letterSpacing={0.2}
      />
    </Group>
  );
};
