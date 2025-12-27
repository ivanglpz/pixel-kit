import { MODE } from "@/editor/states/mode";
import mongoose, { Document, Schema, Types } from "mongoose";

export type ProjectRole = "developer" | "designer" | "qa" | "viewer";

export interface IProjectMember {
  user: Types.ObjectId;
  role: ProjectRole;
}

export interface IProject extends Document {
  name: string;
  organization: Types.ObjectId;
  createdBy: Types.ObjectId;
  data: string;
  previewUrl: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
  mode: MODE;
}

const ProjectSchema: Schema<IProject> = new Schema(
  {
    name: { type: String, required: true },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "organizations",
      required: true,
    },
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
  { timestamps: true }
);

export const Project =
  mongoose.models.projects ||
  mongoose.model<IProject>("projects", ProjectSchema);
