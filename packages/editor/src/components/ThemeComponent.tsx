import { useEffect, useState } from "react";

type EditorTheme = {
  systemTheme: "dark" | "light";
};

type ComponentProps = {
  children: (args: { theme: EditorTheme }) => JSX.Element;
};

export function ThemeComponent({ children }: ComponentProps): JSX.Element {
  const [systemTheme, setSystemTheme] =
    useState<EditorTheme["systemTheme"]>("light");

  useEffect(() => {
    const resolveTheme = () => {
      const documentTheme = document.documentElement.classList.contains("dark")
        ? "dark"
        : null;

      return (
        documentTheme ??
        (window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light")
      );
    };

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const updateTheme = () => setSystemTheme(resolveTheme());

    updateTheme();
    media.addEventListener("change", updateTheme);

    return () => {
      media.removeEventListener("change", updateTheme);
    };
  }, []);

  return children({ theme: { systemTheme } });
}
