import isBrave from "@/editor/utils/browser";
import { useEffect } from "react";
import { toast } from "sonner";
const useBrowser = () => {
  useEffect(() => {
    if (isBrave()) {
      toast.warning("Message for brave users", {
        description:
          "Always remember to keep the fingerpriting for pixel kit activated.",
      });
    }
  }, []);
};

export default useBrowser;
