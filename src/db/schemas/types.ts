import { MODE } from "@/editor/states/mode";

export type Role = "admin" | "member";

export type RoleProject = "developer" | "designer" | "viewer" | "commenter";

export type IUser = {
  email: string;
  fullName: string;
  photoUrl: string;
};

export type IMembers<role> = {
  user: IUser;
  role: role;
};

export type IOrganization = {
  _id: string;
  name: string;
  members: IMembers<Role>[];
};

export type IProject = {
  _id: string;
  name: string;
  organization: IOrganization;
  previewUrl: string;
  createdBy: IUser;
  data: string;
  version: number;
  mode: MODE;
  createdAt: string;
  updatedAt: string;
};
