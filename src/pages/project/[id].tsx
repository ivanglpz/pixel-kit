import "@/db/schemas/users";
import { PixelKitPublicApp } from "@pixelkit/editor";
import { useRouter } from "next/router";

const PageEditor = () => {
  const router = useRouter();
  const projectId = router.isReady ? (router.query.id as string) : undefined;

  return (
    <>
      {/* <SeoComponent
        image={
          project?.previewUrl ??
          "https://res.cloudinary.com/whil/image/upload/v1712288225/app/pixel-kit/images/qvx8i84doj1fgfemx2th.png"
        }
        title={`Pixel Kit - ${project?.name}`}
        content="Pixel Kit, Image Editing Mode, Transform, Refine, Photos, Powerful Editing Tools, Elevate Images"
        description="Transform and refine your photos effortlessly with Pixel Kit's Image Editing Mode. Unlock a range of powerful editing tools and elevate your images to the next level. Try it now!"
        url="https://pixel-kit.vercel.app/"
      /> */}
      <main className="p-6 flex flex-col h-full w-full overflow-hidden">
        <PixelKitPublicApp projectId={projectId} />
      </main>
    </>
  );
};

export default PageEditor;
