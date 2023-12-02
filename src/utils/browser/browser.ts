import { toast } from "sonner";

type TExtendBrowser = Navigator & {
  brave?: {
    isBrave?: {
      name?: string;
    };
  };
};

const isBrave = () => {
  const broswer: TExtendBrowser = window.navigator;
  if (broswer?.brave != undefined) {
    if (broswer?.brave?.isBrave?.name == "isBrave") {
      toast.warning("Change brave browser settings to allow fingerpriting");
    } else {
    }
  }
};
export default isBrave;
