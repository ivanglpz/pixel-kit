import { toast } from "sonner";

type CopyToClipboardParams = {
  text: string;
};

export const copyToClipboard = ({ text }: CopyToClipboardParams): void => {
  if (!navigator.clipboard) {
    toast.error("Clipboard API not available");
    return;
  }

  navigator.clipboard
    .writeText(text)
    .then(() => {
      toast.success("URL copied to clipboard");
    })
    .catch(() => {
      toast.error("Failed to copy URL");
    });
};
