import { ALL_SHAPES } from "@/editor/states/shapes";
import { JotaiState } from "../type.shape";
import { ShapeBase } from "./shape.base";

type ExtraProps = {
  children: ALL_SHAPES[];
};

type WrappedExtraProps = {
  [K in keyof ExtraProps]: JotaiState<ExtraProps[K]>;
};

type BaseWithoutChildren = Omit<ShapeBase, "children">;

export type ShapeState = {
  [K in keyof BaseWithoutChildren]: K extends "id" | "tool"
    ? BaseWithoutChildren[K]
    : JotaiState<BaseWithoutChildren[K]>;
} & WrappedExtraProps;
