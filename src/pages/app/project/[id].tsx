import { AuthProjects } from "@/components/AuthProjects";
import PixelEditor from "@/editor";
import { NextPageWithLayout } from "@/pages/_app";

export const ProjectById: NextPageWithLayout = () => {
  return (
    <AuthProjects>
      <PixelEditor />
    </AuthProjects>
  );
};
ProjectById.layout = "Editor";
export default ProjectById;
