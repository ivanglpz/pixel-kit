import dynamic from "next/dynamic";
export const PixelKitPublicAppClient = dynamic(
  () => import("./index").then((m) => m.PixelKitPublic),
  {
    ssr: false,
  },
);
