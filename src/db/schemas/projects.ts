import { MODE } from "@/editor/states/mode";
import mongoose, { Schema, Types } from "mongoose";

export type ProjectRole = "developer" | "designer" | "qa" | "viewer";

export interface IProjectMember {
  user: Types.ObjectId;
  role: ProjectRole;
}

type ProjectSchema = {
  _id: string;
  name: string;
  organization: Types.ObjectId;
  createdBy: Types.ObjectId;
  data: string;
  previewUrl: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  mode: MODE;
  isPublic: boolean;
};

const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
    isPublic: { type: Boolean, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
    data: {
      type: String,
      default: JSON.stringify({
        DESIGN_MODE: {
          LIST: [],
        },
      }),
    },
    previewUrl: { type: String, default: "./default_bg.png" },
    version: { type: Number, default: 1 },
    mode: { type: String, default: "DESIGN_MODE" },
  },
  { timestamps: true },
);

export const Project =
  mongoose.models.projects ||
  mongoose.model<ProjectSchema>("projects", ProjectSchema);
