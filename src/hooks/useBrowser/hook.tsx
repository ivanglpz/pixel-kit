import { mountAtom } from "@/components/atoms/AtomModal";
import isBrave from "@/utils/browser/browser";
import { useAtomValue } from "jotai";
import { useEffect } from "react";
import { toast } from "sonner";
const useBrowser = () => {
  const browser = useAtomValue(mountAtom);
  useEffect(() => {
    if (isBrave()) {
      if (browser) {
        toast.warning("Brave browser settings", {
          description: "Change the settings to allow fingerpriting",
        });
      } else {
        toast.message("Brave browser settings", {
          description: "Change the settings to allow fingerpriting",
        });
      }
    }
  }, [browser]);
};

export default useBrowser;
