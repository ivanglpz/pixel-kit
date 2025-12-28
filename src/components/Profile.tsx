import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { PROJECTS_ATOM } from "@/editor/states/projects";
import { userAtom } from "@/jotai/user";
import { useAtom, useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { LogOut, Settings, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Profile = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const CLEAR_PROJECTS = useSetAtom(PROJECTS_ATOM);

  const handleLogout = () => {
    CLEAR_PROJECTS([]);
    Cookies.remove("accessToken");
    router.replace("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center justify-center">
            <img
              src={user?.data?.user?.photoUrl || ""}
              alt="Avatar"
              className="w-8 h-8 rounded-full"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="flex gap-2">
            <div className="flex flex-col">
              <p className=" font-bold">
                {user.data?.user?.fullName || "User"}
              </p>
              <p>{user.data?.user?.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(event) => {
              router.push("/app/settings");
            }}
            className="flex items-center gap-2"
          >
            <Settings />
            Settings
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <Link
              href="https://twitter.com/ivanglpz"
              target="_blank"
              className="flex items-center w-full gap-2"
            >
              <Twitter />
              Follow Ivanglpz
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleLogout} className="flex gap-2">
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
