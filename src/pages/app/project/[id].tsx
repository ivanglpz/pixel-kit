import { AuthProjects } from "@/components/AuthProjects";
import PixelEditor from "@pixelkit/editor";
import { NextPageWithLayout } from "@/pages/_app";
import { useRouter } from "next/router";

export const ProjectById: NextPageWithLayout = () => {
  const router = useRouter();
  const projectId = router.isReady ? (router.query.id as string) : undefined;

  return (
    <AuthProjects>
      <PixelEditor projectId={projectId} />
    </AuthProjects>
  );
};
ProjectById.layout = "Editor";
export default ProjectById;
