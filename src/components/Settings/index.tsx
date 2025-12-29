import { css } from "@stylespixelkit/css";
import { User } from "lucide-react";
import { AccountSettings } from "./Tabs/account";

export const SettingsSection = () => {
  return (
    <section
      className={css({
        gap: "xlg",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      })}
    >
      <div className="grid grid-cols-[220px_1fr] h-full overflow-hidden">
        <aside className="h-full w-full border-r flex flex-col items-start p-2">
          <p className="text-xs opacity-75">User settings</p>
          <button
            onClick={() => {}}
            className="w-full cursor-pointer flex items-center gap-2 justify-start py-2"
          >
            <User size={18} />
            <p className="text-sm">Account</p>
          </button>
        </aside>
        <AccountSettings />
      </div>
    </section>
  );
};
