import mongoose, { Document, Schema, Types } from "mongoose";

export type NotificationType =
  | "organization_invite"
  | "project_update"
  | "general";

export interface IUserNotification extends Document {
  user: Types.ObjectId; // destinatario
  type: NotificationType;
  message: string; // mensaje descriptivo
  referenceId?: Types.ObjectId; // referencia a invitación, proyecto u otro recurso
  read: boolean; // si el usuario ya leyó la notificación
  createdAt: Date;
}

const UserNotificationSchema = new Schema<IUserNotification>({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  type: {
    type: String,
    enum: ["organization_invite", "project_update", "general"],
    required: true,
  },
  message: { type: String, required: true },
  referenceId: { type: Schema.Types.ObjectId },
  read: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

export const UserNotification =
  mongoose.models.usernotifications ||
  mongoose.model<IUserNotification>(
    "usernotifications",
    UserNotificationSchema
  );
