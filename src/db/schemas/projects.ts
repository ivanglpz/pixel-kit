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
  members: IProjectMember[];
  createdAt: Date;
  updatedAt: Date;
}

const ProjectMemberSchema = new Schema<IProjectMember>({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  role: {
    type: String,
    enum: ["developer", "designer", "viewer", "commenter"],
    required: true,
  },
});

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
    members: { type: [ProjectMemberSchema], default: [] },
  },
  { timestamps: true }
);

export const Project =
  mongoose.models.projects ||
  mongoose.model<IProject>("projects", ProjectSchema);
