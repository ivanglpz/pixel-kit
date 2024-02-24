import isBrave from "@/utils/browser/browser";
import { useEffect, useState } from "react";
import { toast } from "sonner";
const useBrowser = () => {
  const [counter, setcounter] = useState(0);
  useEffect(() => {
    setcounter(1);
  }, []);

  useEffect(() => {
    if (counter === 1) {
      if (isBrave()) {
        toast.warning("Message for brave users", {
          description:
            "Always remember to keep the fingerpriting for pixel kit activated.",
        });
      }
    }
  }, [counter]);
};

export default useBrowser;
