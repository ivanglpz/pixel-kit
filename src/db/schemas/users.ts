import mongoose, { Schema } from "mongoose";

// Define la interfaz para el usuario
type IUser = {
  email: string;
  password: string;
  fullName: string; // Campo para el nombre completo
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
    passwordUpdatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true, // Agrega campos `createdAt` y `updatedAt`
  }
);

// Crea el modelo de Mongoose
export const UserSchema =
  mongoose.models.users || mongoose.model<IUser>("users", NewUserSchema);
