import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TABS_ID } from "@/editor/states/tabs";
import { meUser } from "@/services/users";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { LogOut, Settings, Twitter, User2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";

export const Profile = () => {
  const router = useRouter();
  const QueryProfile = useQuery({
    queryKey: ["profile"],
    queryFn: meUser,
  });

  const handleLogout = () => {
    router.replace("/login");
    Cookies.remove("accessToken");
    localStorage.removeItem(TABS_ID);
    // Aquí puedes agregar la lógica para cerrar sesión
    console.log("Cerrar sesión");
  };
  console.log(QueryProfile.data);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center space-x-2">
          <img
            src="https://res.cloudinary.com/whil/image/upload/v1759465443/app/pixelkit/profile/i5aos6iqnm6eifuryrls.jpg"
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-sm font-medium">
            {QueryProfile.data?.user?.fullName}
          </span>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel className="opacity-50 flex flex-row gap-2">
          <User2 size={18} />
          {QueryProfile.data?.user?.email}
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
