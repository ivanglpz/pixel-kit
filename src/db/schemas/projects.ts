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
  createdAt: Date;
  updatedAt: Date;
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
    data: { type: String, default: "{}" },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.projects ||
  mongoose.model<IProject>("projects", ProjectSchema);
