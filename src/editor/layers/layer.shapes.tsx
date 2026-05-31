import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { CSSProperties, PointerEvent, ReactNode, useMemo, useRef } from "react";
import { constants } from "../constants/color";
import { SVG } from "../utils/svg";
import { SELECTED_SHAPES_BY_IDS_ATOM } from "../states/shape";
import { RESOLVE_DROP_TARGET } from "../states/shapes/move";
import ALL_SHAPES_ATOM from "../states/shapes/store";
import { ALL_SHAPES } from "../states/shapes/types";
import { START_TIMER_ATOM } from "../states/timer";
import { IShapeTool } from "../states/tool";
import { POSITION_SCALE_ATOM } from "../states/pages";
import { ShapeState } from "../shapes/types/shape.state";

type ShapeIteratorProps = {
  item: ALL_SHAPES;
  options: {
    isLocked: boolean;
    background: string;
    showIdentifier: boolean;
    withinLayout?: boolean;
  };
};

type DragState = {
  pointerId: number;
  startClientX: number;
  startClientY: number;
  startX: number;
  startY: number;
};

type ResizeState = DragState & {
  startWidth: number;
  startHeight: number;
};

const px = (value: number) => `${value}px`;

const shadowStyle = (shape: ResolvedHtmlShape): string | undefined => {
  if (!shape.shadowBlur && !shape.shadowOffsetX && !shape.shadowOffsetY) {
    return undefined;
  }

  return `${shape.shadowOffsetX}px ${shape.shadowOffsetY}px ${shape.shadowBlur}px rgba(0, 0, 0, ${shape.shadowOpacity})`;
};

const borderRadiusStyle = (shape: ResolvedHtmlShape) =>
  shape.isAllBorderRadius
    ? `${shape.borderTopLeftRadius}px ${shape.borderTopRightRadius}px ${shape.borderBottomRightRadius}px ${shape.borderBottomLeftRadius}px`
    : px(shape.borderRadius);

const baseShapeStyle = (
  shape: ResolvedHtmlShape,
  withinLayout: boolean,
): CSSProperties => ({
  position: withinLayout ? "relative" : "absolute",
  left: withinLayout ? undefined : shape.x,
  top: withinLayout ? undefined : shape.y,
  width: shape.fillContainerWidth && withinLayout ? "100%" : shape.width,
  height: shape.fillContainerHeight && withinLayout ? "100%" : shape.height,
  minWidth: shape.minWidth || undefined,
  minHeight: shape.minHeight || undefined,
  maxWidth: shape.maxWidth || undefined,
  maxHeight: shape.maxHeight || undefined,
  transform: `rotate(${shape.rotation}deg)`,
  transformOrigin: "top left",
  opacity: shape.opacity,
  display: shape.visible ? undefined : "none",
  boxSizing: "border-box",
  background: shape.fillColor,
  border:
    shape.strokeWidth > 0
      ? `${shape.strokeWidth}px solid ${shape.strokeColor}`
      : undefined,
  borderRadius: borderRadiusStyle(shape),
  boxShadow: shadowStyle(shape),
  overflow: shape.tool === "FRAME" ? "hidden" : undefined,
  pointerEvents: shape.listening ? "auto" : "none",
  cursor: shape.isSelected ? "move" : "default",
});

type ResolvedHtmlShape = ReturnType<typeof useResolvedHtmlShape>;

const useResolvedHtmlShape = (
  item: ALL_SHAPES,
  options: ShapeIteratorProps["options"],
) => {
  const state = useAtomValue(item.state);
  const scale = useAtomValue(POSITION_SCALE_ATOM);
  const [selectedIds, setSelectedIds] = useAtom(SELECTED_SHAPES_BY_IDS_ATOM);
  const setDropCoords = useSetAtom(RESOLVE_DROP_TARGET);
  const START = useSetAtom(START_TIMER_ATOM);
  const dragRef = useRef<DragState | null>(null);
  const resizeRef = useRef<ResizeState | null>(null);

  const tool = useAtomValue(state.tool);
  const parentId = useAtomValue(state.parentId);
  const sourceShapeId = useAtomValue(state.sourceShapeId);
  const x = useAtomValue(state.x);
  const y = useAtomValue(state.y);
  const width = useAtomValue(state.width);
  const height = useAtomValue(state.height);
  const rotation = useAtomValue(state.rotation);
  const visible = useAtomValue(state.visible);
  const isLocked = useAtomValue(state.isLocked);
  const isComponent = useAtomValue(state.isComponent);
  const label = useAtomValue(state.label);
  const opacity = useAtomValue(state.opacity);
  const fillColor = useAtomValue(state.fillColor);
  const strokeColor = useAtomValue(state.strokeColor);
  const strokeWidth = useAtomValue(state.strokeWidth);
  const lineCap = useAtomValue(state.lineCap);
  const lineJoin = useAtomValue(state.lineJoin);
  const dash = useAtomValue(state.dash);
  const isAllBorderRadius = useAtomValue(state.isAllBorderRadius);
  const borderRadius = useAtomValue(state.borderRadius);
  const borderTopLeftRadius = useAtomValue(state.borderTopLeftRadius);
  const borderTopRightRadius = useAtomValue(state.borderTopRightRadius);
  const borderBottomRightRadius = useAtomValue(state.borderBottomRightRadius);
  const borderBottomLeftRadius = useAtomValue(state.borderBottomLeftRadius);
  const shadowColor = useAtomValue(state.shadowColor);
  const shadowBlur = useAtomValue(state.shadowBlur);
  const shadowOffsetX = useAtomValue(state.shadowOffsetX);
  const shadowOffsetY = useAtomValue(state.shadowOffsetY);
  const shadowOpacity = useAtomValue(state.shadowOpacity);
  const children = useAtomValue(state.children);
  const isLayout = useAtomValue(state.isLayout);
  const flexDirection = useAtomValue(state.flexDirection);
  const justifyContent = useAtomValue(state.justifyContent);
  const alignItems = useAtomValue(state.alignItems);
  const flexWrap = useAtomValue(state.flexWrap);
  const gap = useAtomValue(state.gap);
  const isAllPadding = useAtomValue(state.isAllPadding);
  const padding = useAtomValue(state.padding);
  const paddingTop = useAtomValue(state.paddingTop);
  const paddingRight = useAtomValue(state.paddingRight);
  const paddingBottom = useAtomValue(state.paddingBottom);
  const paddingLeft = useAtomValue(state.paddingLeft);
  const fillContainerWidth = useAtomValue(state.fillContainerWidth);
  const fillContainerHeight = useAtomValue(state.fillContainerHeight);
  const minWidth = useAtomValue(state.minWidth);
  const minHeight = useAtomValue(state.minHeight);
  const maxWidth = useAtomValue(state.maxWidth);
  const maxHeight = useAtomValue(state.maxHeight);
  const points = useAtomValue(state.points);
  const image = useAtomValue(state.image);
  const text = useAtomValue(state.text);
  const fontFamily = useAtomValue(state.fontFamily);
  const fontWeight = useAtomValue(state.fontWeight);
  const fontSize = useAtomValue(state.fontSize);
  const fontStyle = useAtomValue(state.fontStyle);
  const textDecoration = useAtomValue(state.textDecoration);
  const align = useAtomValue(state.align);
  const verticalAlign = useAtomValue(state.verticalAlign);

  const isSelected = selectedIds.some((selection) => selection.id === item.id);
  const listening = !options.isLocked && !isLocked && !sourceShapeId;

  const setX = useSetAtom(state.x);
  const setY = useSetAtom(state.y);
  const setWidth = useSetAtom(state.width);
  const setHeight = useSetAtom(state.height);

  const onPointerDown = (event: PointerEvent<Element>) => {
    if (!listening) return;
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    setSelectedIds({ id: item.id, parentId });
    dragRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: x,
      startY: y,
    };
  };

  const onPointerMove = (event: PointerEvent<Element>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    event.stopPropagation();
    setX(drag.startX + (event.clientX - drag.startClientX) / scale.x);
    setY(drag.startY + (event.clientY - drag.startClientY) / scale.y);
  };

  const onPointerUp = (event: PointerEvent<Element>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    event.stopPropagation();
    setDropCoords({ x, y });
    START();
  };

  const onResizePointerDown = (event: PointerEvent<Element>) => {
    event.stopPropagation();
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeRef.current = {
      pointerId: event.pointerId,
      startClientX: event.clientX,
      startClientY: event.clientY,
      startX: x,
      startY: y,
      startWidth: width,
      startHeight: height,
    };
  };

  const onResizePointerMove = (event: PointerEvent<Element>) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    event.stopPropagation();
    setWidth(
      Math.max(
        5,
        resize.startWidth + (event.clientX - resize.startClientX) / scale.x,
      ),
    );
    setHeight(
      Math.max(
        5,
        resize.startHeight + (event.clientY - resize.startClientY) / scale.y,
      ),
    );
  };

  const onResizePointerUp = (event: PointerEvent<Element>) => {
    const resize = resizeRef.current;
    if (!resize || resize.pointerId !== event.pointerId) return;
    resizeRef.current = null;
    event.stopPropagation();
    START();
  };

  return {
    id: item.id,
    tool,
    parentId,
    x,
    y,
    width,
    height,
    rotation,
    visible,
    isLocked,
    isComponent,
    label,
    opacity,
    fillColor,
    strokeColor,
    strokeWidth,
    lineCap,
    lineJoin,
    dash,
    isAllBorderRadius,
    borderRadius,
    borderTopLeftRadius,
    borderTopRightRadius,
    borderBottomRightRadius,
    borderBottomLeftRadius,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
    shadowOpacity,
    children,
    isLayout,
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gap,
    isAllPadding,
    padding,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    fillContainerWidth,
    fillContainerHeight,
    minWidth,
    minHeight,
    maxWidth,
    maxHeight,
    points,
    image,
    text,
    fontFamily,
    fontWeight,
    fontSize,
    fontStyle,
    textDecoration,
    align,
    verticalAlign,
    isSelected,
    listening,
    events: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
    resizeEvents: {
      onPointerDown: onResizePointerDown,
      onPointerMove: onResizePointerMove,
      onPointerUp: onResizePointerUp,
      onPointerCancel: onResizePointerUp,
    },
  };
};

const ShapeIdentifier = ({
  shape,
  color,
}: {
  shape: ResolvedHtmlShape;
  color: string;
}) => {
  if (!shape.label) return null;

  return (
    <div
      style={{
        position: "absolute",
        left: shape.x,
        top: shape.y - 20,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 4,
        pointerEvents: "none",
        fontSize: 10,
        color,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: constants.theme.colors.primary,
        }}
      />
      <span>{shape.label}</span>
    </div>
  );
};

const SelectionHandles = ({ shape }: { shape: ResolvedHtmlShape }) => {
  if (!shape.isSelected || shape.isLocked) return null;

  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: -1,
          border: `1px solid ${constants.theme.colors.primary}`,
          pointerEvents: "none",
          zIndex: 5,
        }}
      />
      <div
        {...shape.resizeEvents}
        style={{
          position: "absolute",
          right: -5,
          bottom: -5,
          width: 10,
          height: 10,
          borderRadius: 2,
          background: constants.theme.colors.primary,
          cursor: "nwse-resize",
          zIndex: 6,
        }}
      />
    </>
  );
};

const TextShape = ({ shape }: { shape: ResolvedHtmlShape }) => (
  <div
    data-shape-id={shape.id}
    {...shape.events}
    style={{
      ...baseShapeStyle(shape, false),
      fontFamily: shape.fontFamily,
      fontWeight: shape.fontWeight,
      fontStyle: shape.fontStyle,
      fontSize: shape.fontSize,
      textDecoration: shape.textDecoration,
      textAlign: shape.align,
      color: shape.fillColor,
      background: "transparent",
      lineHeight: 1.45,
      whiteSpace: "pre-wrap",
      overflow: "hidden",
      alignContent:
        shape.verticalAlign === "middle"
          ? "center"
          : shape.verticalAlign === "bottom"
            ? "end"
            : "start",
    }}
  >
    {shape.text}
    <SelectionHandles shape={shape} />
  </div>
);

const ImageShape = ({ shape }: { shape: ResolvedHtmlShape }) => (
  <div
    data-shape-id={shape.id}
    {...shape.events}
    style={baseShapeStyle(shape, false)}
  >
    <img
      alt={shape.image.name}
      src={shape.image.src}
      draggable={false}
      style={{
        width: "100%",
        height: "100%",
        objectFit: "cover",
        display: "block",
        borderRadius: "inherit",
        pointerEvents: "none",
      }}
    />
    <SelectionHandles shape={shape} />
  </div>
);

const IconShape = ({ shape }: { shape: ResolvedHtmlShape }) => {
  const src = useMemo(() => {
    if (!shape.image?.src) return "/placeholder.svg";
    const svgText = SVG.Decode(shape.image.src)
      .replace(/stroke-width="[^"]*"/g, `stroke-width="${shape.strokeWidth}"`)
      .replace(
        /stroke="currentColor"/g,
        `stroke="${shape.strokeColor || "#000000"}"`,
      );
    return SVG.Encode(svgText);
  }, [shape.image?.src, shape.strokeColor, shape.strokeWidth]);

  return (
    <div
      data-shape-id={shape.id}
      {...shape.events}
      style={baseShapeStyle(shape, false)}
    >
      <img
        alt={shape.image.name}
        src={src}
        draggable={false}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
          display: "block",
          pointerEvents: "none",
        }}
      />
      <SelectionHandles shape={shape} />
    </div>
  );
};

const DrawShape = ({ shape }: { shape: ResolvedHtmlShape }) => {
  const bounds = shape.points.reduce(
    (acc, value, index) => {
      if (index % 2 === 0) {
        return { ...acc, maxX: Math.max(acc.maxX, value) };
      }
      return { ...acc, maxY: Math.max(acc.maxY, value) };
    },
    { maxX: shape.width, maxY: shape.height },
  );

  return (
    <svg
      data-shape-id={shape.id}
      {...shape.events}
      style={{
        ...baseShapeStyle(shape, false),
        overflow: "visible",
        background: "transparent",
      }}
      width={Math.max(shape.width, bounds.maxX)}
      height={Math.max(shape.height, bounds.maxY)}
    >
      <polyline
        points={shape.points
          .map((point, index) => (index % 2 === 0 ? `${point},` : `${point} `))
          .join("")}
        fill="none"
        stroke={shape.strokeColor}
        strokeWidth={shape.strokeWidth}
        strokeLinecap={shape.lineCap}
        strokeLinejoin={shape.lineJoin}
        strokeDasharray={shape.dash > 0 ? `${shape.dash}` : undefined}
      />
    </svg>
  );
};

const FrameShape = ({
  item,
  shape,
  options,
}: {
  item: ALL_SHAPES;
  shape: ResolvedHtmlShape;
  options: ShapeIteratorProps["options"];
}) => {
  const padding = shape.isAllPadding
    ? `${shape.paddingTop}px ${shape.paddingRight}px ${shape.paddingBottom}px ${shape.paddingLeft}px`
    : shape.padding;
  const layoutStyle: CSSProperties = shape.isLayout
    ? {
        display: "flex",
        flexDirection: shape.flexDirection,
        justifyContent: shape.justifyContent,
        alignItems: shape.alignItems,
        flexWrap: shape.flexWrap,
        gap: shape.gap,
      }
    : {};

  return (
    <div
      data-shape-id={shape.id}
      {...shape.events}
      style={{
        ...baseShapeStyle(shape, Boolean(options.withinLayout)),
        ...layoutStyle,
        padding,
      }}
    >
      {shape.children.map((child) => (
        <ShapeIterator
          key={child.id}
          item={child}
          options={{
            ...options,
            isLocked: options.isLocked || Boolean(shape.isLocked),
            background: shape.fillColor,
            showIdentifier: false,
            withinLayout: shape.isLayout,
          }}
        />
      ))}
      <SelectionHandles shape={shape} />
    </div>
  );
};

export const ShapeIterator = ({ item, options }: ShapeIteratorProps) => {
  const shape = useResolvedHtmlShape(item, options);
  if (!shape.visible) return null;

  const renderShape = (tool: IShapeTool): ReactNode => {
    if (tool === "TEXT") return <TextShape shape={shape} />;
    if (tool === "IMAGE") return <ImageShape shape={shape} />;
    if (tool === "ICON") return <IconShape shape={shape} />;
    if (tool === "DRAW") return <DrawShape shape={shape} />;
    return <FrameShape item={item} shape={shape} options={options} />;
  };

  return (
    <>
      {options.showIdentifier ? (
        <ShapeIdentifier shape={shape} color={options.background} />
      ) : null}
      {renderShape(shape.tool)}
    </>
  );
};

export const LayerShapes = () => {
  const shapes = useAtomValue(ALL_SHAPES_ATOM);

  return (
    <div id="layer-shapes" style={{ position: "absolute", inset: 0 }}>
      {shapes.map((item) => (
        <ShapeIterator
          key={item.id}
          item={item}
          options={{
            isLocked: false,
            background: constants.theme.colors.black,
            showIdentifier: true,
          }}
        />
      ))}
    </div>
  );
};
