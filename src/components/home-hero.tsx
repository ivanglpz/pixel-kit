import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/router";

export const Hero = () => {
  const router = useRouter();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-4 py-1.5">
            <span className="text-sm  text-blue-500">Free to use</span>
            <span className="text-sm text-muted-foreground">
              • No credit card required
            </span>
          </div>

          {/* Headline */}
          <h1 className="mx-auto max-w-4xl text-balance text-4xl font-bold tracking-tight text-foreground sm:text-6xl lg:text-7xl">
            The Professional
            <span className="text-blue-500"> UI Design </span>
            Editor
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg text-muted-foreground sm:text-xl">
            Create stunning interfaces with keyboard commands, drag and drop
            elements, and export your designs instantly. Pixel Kit makes UI
            design intuitive and powerful.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className=" text-primary-foreground hover:bg-primary/90 px-8 bg-blue-500"
              onClick={() => router.push("/signup")}
            >
              Sign Up Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border text-foreground hover:bg-secondary px-8 bg-transparent"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
          </div>
        </div>

        {/* Hero Image Placeholder */}
        <div className="mt-16 sm:mt-20">
          {/* RED PLACEHOLDER: Replace with hero screenshot of Pixel Kit editor interface */}
          <div className="relative mx-auto aspect-video max-w-5xl overflow-hidden rounded-xl">
            <img
              src="https://res.cloudinary.com/whil/image/upload/v1770012890/yknglprfs8vcrbvjcqol.jpg"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
