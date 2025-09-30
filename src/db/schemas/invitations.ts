import mongoose, { Document, Schema, Types } from "mongoose";
import { Role } from "./organizations";

export type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface IOrganizationInvitation extends Document {
  organization: Types.ObjectId;
  email: string; // correo del invitado
  role: Role;
  invitedBy: Types.ObjectId; // quien envió la invitación
  status: InvitationStatus;
  createdAt: Date;
  expiresAt: Date;
}

const OrganizationInvitationSchema = new Schema<IOrganizationInvitation>({
  organization: {
    type: Schema.Types.ObjectId,
    ref: "organizations",
    required: true,
  },
  email: { type: String, required: true },
  role: { type: String, enum: ["admin", "member"], required: true },
  invitedBy: { type: Schema.Types.ObjectId, ref: "users", required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected", "cancelled"],
    default: "pending",
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true },
});

export const OrganizationInvitation =
  mongoose.models.organizationinvitations ||
  mongoose.model<IOrganizationInvitation>(
    "organizationinvitations",
    OrganizationInvitationSchema
  );
