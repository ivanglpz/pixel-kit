const DEFAULT_PIXELKIT_API_BASE_URL = "https://pixel-kit.vercel.app";

export const getApiBaseUrl = () => {
  return (
    process.env.PIXELKIT_API_BASE_URL ?? DEFAULT_PIXELKIT_API_BASE_URL
  ).replace(/\/$/, "");
};
