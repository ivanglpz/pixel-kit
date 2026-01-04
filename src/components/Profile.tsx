import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/editor/components/dialog";

import { PROJECTS_ATOM } from "@/editor/states/projects";
import { userAtom } from "@/jotai/user";
import { css } from "@stylespixelkit/css";
import { useAtom, useSetAtom } from "jotai";
import Cookies from "js-cookie";
import { LogOut, Settings, Twitter } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { SettingsSection } from "./Settings";

export const Profile = () => {
  const router = useRouter();
  const [user] = useAtom(userAtom);
  const CLEAR_PROJECTS = useSetAtom(PROJECTS_ATOM);
  const [dialogSettings, setDialogSettings] = useState(false);

  const handleLogout = () => {
    CLEAR_PROJECTS([]);
    Cookies.remove("accessToken");
    router.replace("/login");
  };

  return (
    <>
      <Dialog.Provider
        visible={dialogSettings}
        onClose={() => {
          setDialogSettings(false);
        }}
      >
        <Dialog.Area>
          <section className=" flex flex-col w-[52dvw] h-[70dvh] bg-neutral-100 dark:bg-neutral-800 p-4 rounded-lg border-1 overflow-hidden">
            <Dialog.Header>
              <p
                className={css({
                  fontWeight: "bold",
                })}
              >
                Settings
              </p>
              <Dialog.Close
                onClose={() => {
                  setDialogSettings(false);
                }}
              />
            </Dialog.Header>
            <SettingsSection />
          </section>
        </Dialog.Area>
      </Dialog.Provider>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="flex items-center justify-center cursor-pointer">
            <img
              src={user?.data?.user?.photoUrl || "./default_bg.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-56" align="end">
          <DropdownMenuLabel className="flex items-center gap-2">
            <img
              src={user?.data?.user?.photoUrl || "./default_bg.png"}
              alt="Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex flex-col">
              <p className=" font-bold">
                {user.data?.user?.fullName || "User"}
              </p>
              <p className="opacity-75">{user.data?.user?.email}</p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onSelect={(event) => {
              // router.push("/app/settings");
              setDialogSettings(true);
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
