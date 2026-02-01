import SeoComponent from "@/components/seo";
import { DB_CONNECT } from "@/db/mongodb";
import { Project } from "@/db/schemas/projects";
import type { IProject } from "@/db/schemas/types";
import "@/db/schemas/users";
import { PixelKitPublicApp } from "@/editor";
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
        <PixelKitPublicApp project={project} />
      </main>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context,
) => {
  const { id } = context.query;

  if (typeof id !== "string") {
    return { props: { project: null } };
  }

  await DB_CONNECT();

  const project = await Project.findOne({
    _id: id,
    isPublic: true,
  })
    .populate({
      path: "createdBy",
      select: "fullName photoUrl -_id",
    })
    .lean<IProject | null>();

  if (project === null) {
    return { props: { project: null } };
  }

  return {
    props: {
      project: JSON.parse(JSON.stringify(project)),
    },
  };
};

export default PageEditor;
