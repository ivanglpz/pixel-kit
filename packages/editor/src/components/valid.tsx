import { ReactNode } from "react";

type Props = {
  isValid: boolean;
  children: ReactNode;
};

export const Valid = ({ children, isValid }: Props) => {
  if (!isValid) return null;
  return <>{children}</>;
};
