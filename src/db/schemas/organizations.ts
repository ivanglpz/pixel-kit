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

export const Organization =
  mongoose.models.organizations ||
  mongoose.model<IOrganization>("organizations", OrganizationSchema);
