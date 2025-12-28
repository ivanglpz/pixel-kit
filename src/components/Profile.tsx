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
import { LogOut, Settings, Twitter, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Profile = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const CLEAR_PROJECTS = useSetAtom(PROJECTS_ATOM);
  const handleLogout = async () => {
    CLEAR_PROJECTS([]);
    router.replace("/login");
    Cookies.remove("accessToken");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center justify-center">
          <img
            src="https://res.cloudinary.com/whil/image/upload/v1759465443/app/pixelkit/profile/i5aos6iqnm6eifuryrls.jpg"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          {/* <span className="text-sm font-bold line-clamp-1">
            {QueryProfile.data?.user?.fullName}
          </span> */}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel className="opacity-50 flex flex-row gap-2">
          <User2 size={18} />
          {user.data?.user?.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled>
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
        <DropdownMenuItem onClick={handleLogout}>
          <LogOut />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
