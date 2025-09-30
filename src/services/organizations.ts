import { IOrganization } from "@/db/schemas/types";
import { api } from "./axios";

export const fetchListOrgs = async (): Promise<
  Omit<IOrganization, "members">[]
> => {
  return api.get("/organizations/byList").then((e) => e.data?.data);
};
