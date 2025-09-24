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
  name: string;
  members: IMembers<Role>[];
  // projects: [];
  // owner: IUser;
};

export type IProject = {
  name: string;
  organization: IOrganization;
  createdBy: IUser;
  data: string;
  members: IMembers<RoleProject>[];
};
