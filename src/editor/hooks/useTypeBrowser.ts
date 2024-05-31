import { useState, useEffect } from "react";

type BrowserType =
  | "CHROME"
  | "FIREFOX"
  | "SAFARI"
  | "EDGE"
  | "OPERA"
  | "INTERNET EXPLORER"
  | "UNKNOWN";

const getBrowserType = (): BrowserType => {
  const { userAgent } = navigator;
  if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
    return "CHROME";
  } else if (userAgent.includes("Firefox")) {
    return "FIREFOX";
  } else if (
    userAgent.includes("Safari") &&
    !userAgent.includes("Chrome") &&
    !userAgent.includes("Edg")
  ) {
    return "SAFARI";
  } else if (userAgent.includes("Edg")) {
    return "EDGE";
  } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
    return "OPERA";
  } else if (userAgent.includes("MSIE") || userAgent.includes("Trident")) {
    return "INTERNET EXPLORER";
  } else {
    return "UNKNOWN";
  }
};

export const useBrowserType = (): BrowserType => {
  const [browserType, setBrowserType] = useState<BrowserType>("UNKNOWN");

  useEffect(() => {
    setBrowserType(getBrowserType());
  }, []);

  return browserType;
};
