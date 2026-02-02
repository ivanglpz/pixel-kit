import {
  Download,
  MousePointer2,
  Save,
  Share2,
  Upload,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: MousePointer2,
    title: "Drag & Drop",
    description:
      "Drag and drop elements with ease. Nest elements inside others for complex layouts.",
  },
  {
    icon: Upload,
    title: "Image Upload",
    description:
      "Upload your images and seamlessly integrate them into your designs.",
  },
  {
    icon: Download,
    title: "Export Projects",
    description:
      "Export your projects as high-quality image files ready for production.",
  },
  {
    icon: Share2,
    title: "Share Publicly",
    description:
      "Share your projects publicly on the internet with a single click.",
  },
  {
    icon: Save,
    title: "Auto-Save",
    description:
      "Never lose your work. Your designs are automatically saved as you create.",
  },
  {
    icon: Zap,
    title: "Free to Use",
    description:
      "Access all professional features completely free. No hidden fees or limitations.",
  },
];

const keyboardCommands = [
  {
    key: "Ctrl + C",
    label: "Copy",
    description: "Copy selected elements to clipboard.",
  },
  {
    key: "Ctrl + V",
    label: "Paste",
    description: "Paste copied elements from clipboard.",
  },
  {
    key: "Ctrl + Z",
    label: "Undo",
    description: "Undo the last action.",
  },
  {
    key: "Ctrl + Y",
    label: "Redo",
    description: "Redo the last undone action.",
  },
  {
    key: "Delete",
    label: "Delete",
    description: "Delete selected elements.",
  },
  {
    key: "Shift + Click",
    label: "Select Multiple",
    description: "Select multiple elements by holding Shift and clicking.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-32" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Powerful Tools at Your Fingertips
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Everything you need to create professional UI designs with ease.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="mt-16">
          <h3 className="mb-8 text-center text-xl font-semibold text-foreground">
            Everything You Need
          </h3>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <capability.icon className="h-6 w-6 text-primary" />
                </div>
                <h4 className="mb-2 text-lg font-semibold text-foreground">
                  {capability.title}
                </h4>
                <p className="text-muted-foreground">
                  {capability.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* <div className="mt-16">
          <div className="relative mx-auto aspect-video max-w-4xl overflow-hidden rounded-xl border border-border bg-[#dc2626]">
            <iframe
              src="https://pixel-kit.vercel.app/project/69801acdf95f3f67fc4fee59"
              className="flex h-full w-full"
            />
          </div>
        </div> */}
      </div>
    </section>
  );
}
