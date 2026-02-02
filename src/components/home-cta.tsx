import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/router";

const benefits = [
  "Professional-grade design tools",
  "Completely free to use",
  "No account required to start",
  "Export to any format",
];

export function CTA() {
  const router = useRouter();
  return (
    <section className="border-t border-border py-20 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-card px-6 py-16 sm:px-12 sm:py-24">
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Start Designing Today
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands of designers who trust Pixel Kit for their UI
              design needs. Professional, powerful, and completely free.
            </p>

            {/* Benefits List */}
            <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {benefits.map((benefit) => (
                <li
                  key={benefit}
                  className="flex items-center gap-2 text-muted-foreground"
                >
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">{benefit}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 bg-blue-500"
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

          {/* Background decoration */}
          <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-1/2 left-1/2 h-[800px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5" />
          </div>
        </div>
      </div>
    </section>
  );
}
