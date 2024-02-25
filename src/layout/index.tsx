import { FC, ReactNode } from "react";
import LayoutEditor from "./editor";

const Layouts = {
  editor: LayoutEditor,
  default: ({ children }: { children: ReactNode }) => <>{children}</>,
};

export type PropsLayout = {
  children?: ReactNode;
  Layout?: keyof typeof Layouts;
  SEO?: {
    title?: string;
    image?: string;
    keywords?: string[];
    description?: string;
  };
};

const LayoutFC: FC<PropsLayout> = (props) => {
  const { Layout, children } = props;
  const GetLayout = Layouts[Layout || "default"];
  return <GetLayout {...props}>{children}</GetLayout>;
};

export default LayoutFC;
