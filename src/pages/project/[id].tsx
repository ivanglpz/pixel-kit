import "@/db/schemas/users";
import { PixelKitPublicApp } from "@/editor";

const PageEditor = () => {
  return (
    <>
      <main className="p-6 flex flex-col h-full w-full overflow-hidden">
        <PixelKitPublicApp />
      </main>
    </>
  );
};

export default PageEditor;
