/* eslint-disable @next/next/no-img-element */
import { NextPageWithLayout } from "@/pages/_app";
import { useRouter } from "next/router";

const UserSettings: NextPageWithLayout = () => {
  const router = useRouter();
  return (
    <section className="p-4 h-full overflow-y-scroll overflow-hidden">
      <p>This is the settings page.</p>
    </section>
  );
};
UserSettings.layout = "Settings";
export default UserSettings;
