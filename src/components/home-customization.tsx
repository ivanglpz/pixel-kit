import { Copy, Grid3X3, Layout, Palette } from "lucide-react";

const customizationFeatures = [
  {
    icon: Palette,
    title: "Style Everything",
    description:
      "Customize styles, colors, backgrounds, and sizes for every element. Create pixel-perfect designs with complete control.",
  },
  {
    icon: Grid3X3,
    title: "Lucide React Icons",
    description:
      "Access the integrated Lucide React icon library with hundreds of beautiful, consistent icons ready to use.",
  },
  {
    icon: Layout,
    title: "Flex Auto Layout",
    description:
      "Use CSS flex auto layout to organize your designs symmetrically and create responsive, well-structured interfaces.",
  },
  {
    icon: Copy,
    title: "Copy & Paste",
    description:
      "Copy and paste elements from other projects seamlessly. Speed up your workflow by reusing components.",
  },
];

export function Customization() {
  return (
    <section className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Content */}
          <div className="flex flex-col justify-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Complete Design Freedom
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Pixel Kit gives you full control over every aspect of your
              designs. From colors to layouts, customize everything to match
              your vision.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {customizationFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {feature.title}
                    </h4>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Image Placeholders */}
          <div className="flex flex-col gap-6">
            {/* RED PLACEHOLDER: Replace with customization panel screenshot */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl ">
              <img
                src="https://res.cloudinary.com/whil/image/upload/v1770013406/f6kwffkheod2heuqqraw.jpg"
                className="flex h-full w-full object-contain"
              />
            </div>
            {/* RED PLACEHOLDER: Replace with icon library screenshot */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl ">
              <img
                src="https://res.cloudinary.com/whil/image/upload/v1770013002/o5bafk6qrb1najjm6c8f.jpg"
                className="flex h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
