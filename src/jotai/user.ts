import { meUser } from "@/services/users";
import { atomWithQuery } from "jotai-tanstack-query";

export const userAtom = atomWithQuery((get) => ({
  queryKey: ["profile"],
  queryFn: meUser,
}));
