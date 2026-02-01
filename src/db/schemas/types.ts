import { MODE } from "@/editor/states/mode";

export type Role = "admin" | "member" | "owner";

export type RoleProject = "developer" | "designer" | "viewer" | "commenter";

export type IMembers<role> = {
  user: Omit<
    IUser,
    "password" | "passwordUpdatedAt" | "createdAt" | "updatedAt"
  >;
  role: role;
};

export type IUser = {
  userId: string;
  email: string;
  password: string;
  fullName: string;
  photoUrl: string | null;
};

export type IOrganization = {
  _id: string;
  name: string;
  members: IMembers<Role>[];
};

export type IProject = {
  _id: string;
  name: string;
  isPublic: boolean;
  organization: IOrganization;
  previewUrl: string;
  createdBy: Omit<
    IUser,
    "password" | "passwordUpdatedAt" | "createdAt" | "updatedAt"
  >;
  data: string;
  version: number;
  mode: MODE;
  createdAt: string;
  updatedAt: string;
};
export type IPhoto = {
  _id: string;
  projectId: string;
  url: string;
  mimeType: string;
  size: number;
  createdAt: string;
  folder: string;
  createdBy: string;
  name: string;
  width: number;
  height: number;
};
