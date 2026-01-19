import mongoose, { Schema } from "mongoose";

// Define la interfaz para el usuario
export type IUser = {
  userId: string;
  email: string;
  password: string;
  fullName: string;
  photoUrl?: string;
  passwordUpdatedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

// Crea el esquema de Mongoose
const NewUserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    photoUrl: {
      type: String,
      required: false,
    },
    passwordUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Agrega campos `createdAt` y `updatedAt`
  },
);

// Crea el modelo de Mongoose
export const UserSchema =
  mongoose.models.users || mongoose.model<IUser>("users", NewUserSchema);
