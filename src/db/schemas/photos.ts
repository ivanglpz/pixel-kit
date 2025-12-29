import mongoose, { Document, model, Schema, Types } from "mongoose";

export type PhotoType = "PUBLIC" | "PREVIEW";

interface Photo extends Document {
  projectId: Types.ObjectId;
  url: string;
  mimeType: string;
  size: number;
  createdAt: Date;
  folder: string;

  createdBy: Types.ObjectId;
  width: number;
  height: number;
  name: string;

  type: PhotoType;
}

const PSchema = new Schema<Photo>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "projects",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    folder: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    type: {
      type: String,
      enum: ["PUBLIC", "PREVIEW"],
      default: "PUBLIC",
      index: true,
    },
    createdAt: {
      type: Date,
      default: () => new Date(),
      immutable: true,
    },
  },
  { versionKey: false }
);

export const PhotoSchema =
  mongoose.models.photos || model<Photo>("photos", PSchema);
