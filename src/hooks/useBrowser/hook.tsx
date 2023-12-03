import isBrave from "@/utils/browser/browser";
import { useEffect } from "react";
import { toast } from "sonner";

const useBrowser = () => {
  useEffect(() => {
    if (isBrave()) {
      toast.warning("Brave browser settings", {
        description: "Change the settings to allow fingerpriting",
      });
    }
  }, []);
};

export default useBrowser;
