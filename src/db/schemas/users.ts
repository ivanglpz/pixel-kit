import mongoose, { Schema } from "mongoose";

// Define la interfaz para el usuario
type UserSchema = {
  _id: string;
  email: string;
  password: string;
  fullName: string;
  photoUrl?: string;
  passwordUpdatedAt: string;
  createdAt: string;
  updatedAt: string;
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
  mongoose.models.users || mongoose.model<UserSchema>("users", NewUserSchema);
