import mongoose, { Document, Schema, Types } from "mongoose";

export type Role = "owner" | "admin" | "member";

export interface IOrganizationMember {
  user: Types.ObjectId;
  role: Role;
}

export interface IOrganization extends Document {
  name: string;
  members: IOrganizationMember[];
  projects: Types.ObjectId[];
}

const OrganizationMemberSchema = new Schema<IOrganizationMember>({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  role: { type: String, enum: ["owner", "admin", "member"], required: true },
});

const OrganizationSchema: Schema<IOrganization> = new Schema({
  name: { type: String, required: true, unique: true },
  members: { type: [OrganizationMemberSchema], default: [] },
  projects: [{ type: Schema.Types.ObjectId, ref: "projects" }],
});

export type InvitationRole = "admin" | "member";
export type InvitationStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "cancelled";

export interface IOrganizationInvitation extends Document {
  organization: Types.ObjectId;
  email: string; // correo del invitado
  role: InvitationRole;
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

export const Organization =
  mongoose.models.organizations ||
  mongoose.model<IOrganization>("organizations", OrganizationSchema);
