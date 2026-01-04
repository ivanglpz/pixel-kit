import mongoose, { Document, model, Schema, Types } from "mongoose";

export type PhotoType = "PUBLIC" | "PREVIEW";
export type CloudinaryResourceType = "image" | "video" | "raw" | "auto";

interface Photo extends Document {
  projectId: Types.ObjectId;

  name: string;
  url: string;
  secureUrl: string;

  mimeType: string;
  format: string;
  size: number;

  width: number;
  height: number;

  folder: string;

  createdBy: Types.ObjectId;
  createdAt: Date;

  type: PhotoType;

  // Cloudinary
  cloudinaryPublicId: string;
  cloudinaryAssetId?: string;
  cloudinaryResourceType: CloudinaryResourceType;
  cloudinaryVersion: number;
  cloudinarySignature: string;
  cloudinaryOriginalFilename: string;
  cloudinaryAccessMode?: string;
  cloudinaryEtag?: string;

  tags?: string[];
  colors?: [string, number][];
  metadata?: Record<string, unknown>;
  context?: Record<string, unknown>;
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

    secureUrl: {
      type: String,
      required: true,
    },

    mimeType: {
      type: String,
      required: true,
    },

    format: {
      type: String,
      required: true,
    },

    folder: {
      type: String,
      required: true,
      index: true,
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
      index: true,
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

    // ---------- Cloudinary ----------

    cloudinaryPublicId: {
      type: String,
      required: true,
      index: true,
    },

    cloudinaryAssetId: {
      type: String,
    },

    cloudinaryResourceType: {
      type: String,
      enum: ["image", "video", "raw", "auto"],
      required: true,
      index: true,
    },

    cloudinaryVersion: {
      type: Number,
      required: true,
    },

    cloudinarySignature: {
      type: String,
      required: true,
    },

    cloudinaryOriginalFilename: {
      type: String,
      required: true,
    },

    cloudinaryAccessMode: {
      type: String,
    },

    cloudinaryEtag: {
      type: String,
    },

    tags: {
      type: [String],
      default: [],
    },

    colors: {
      type: [[Schema.Types.Mixed]],
    },

    metadata: {
      type: Schema.Types.Mixed,
    },

    context: {
      type: Schema.Types.Mixed,
    },
  },
  { versionKey: false }
);

export const PhotoSchema =
  mongoose.models.photos || model<Photo>("photos", PSchema);
