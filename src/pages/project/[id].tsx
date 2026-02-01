import SeoComponent from "@/components/seo";
import type { IProject } from "@/db/schemas/types";
import "@/db/schemas/users";
import { PixelKitPublicAppClient } from "@/editor/stage-public";

import type { GetServerSideProps, NextPage } from "next";

type PageProps = {
  project: IProject | null;
};

const PageEditor: NextPage<PageProps> = ({ project }) => {
  if (project === null) {
    return null;
  }

  return (
    <>
      <SeoComponent
        image={
          project?.previewUrl ??
          "https://res.cloudinary.com/whil/image/upload/v1712288225/app/pixel-kit/images/qvx8i84doj1fgfemx2th.png"
        }
        title={`Pixel Kit - ${project?.name}`}
        content="Pixel Kit, Image Editing Mode, Transform, Refine, Photos, Powerful Editing Tools, Elevate Images"
        description="Transform and refine your photos effortlessly with Pixel Kit's Image Editing Mode. Unlock a range of powerful editing tools and elevate your images to the next level. Try it now!"
        url="https://pixel-kit.vercel.app/"
      />
      <main className="p-6 flex flex-col h-full w-full overflow-hidden">
        <PixelKitPublicAppClient project={project}></PixelKitPublicAppClient>
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const { req, query } = context;
  const { id } = context.query;

  if (typeof id !== "string") {
    return { props: { project: null } };
  }
  const protocol = req.headers["x-forwarded-proto"]?.toString() ?? "http";

  const host = req.headers.host;

  const baseUrl = `${protocol}://${host}`;
  console.log(baseUrl, "baseUrl");

  const response = await fetch(`${baseUrl}/api/projects/byPublicId?id=${id}`);
  const json = await response?.json();
  const project = json?.data;

  if (project === null) {
    return { props: { project: null } };
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
      // project: null,
    },
  };
};

export default PageEditor;
