import { useTheme, UseThemeProps } from "next-themes";

type ComponentProps = {
  children: (args: { theme: UseThemeProps }) => JSX.Element;
};

export function ThemeComponent({ children }: ComponentProps): JSX.Element {
  const theme = useTheme();

  return children({ theme });
}
