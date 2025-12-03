import { ALL_SHAPES } from "@/editor/states/shapes";
import { PrimitiveAtom } from "jotai";
import { ShapeBase } from "./shape.base";

type ExtraProps = {
  children: ALL_SHAPES[];
};

type WrappedExtraProps = {
  [K in keyof ExtraProps]: PrimitiveAtom<ExtraProps[K]>;
};

type BaseWithoutChildren = Omit<ShapeBase, "children">;

export type ShapeState = {
  [K in keyof BaseWithoutChildren]: K extends "id" | "tool"
    ? BaseWithoutChildren[K]
    : PrimitiveAtom<BaseWithoutChildren[K]>;
} & WrappedExtraProps;
