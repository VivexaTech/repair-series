import { Container } from "@/components/container";

export const metadata = {
  title: "About",
  description: "Learn about Repair Series and how we ensure premium service.",
};

export default function AboutPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">About</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Repair Series helps customers book trusted home services with transparent
        pricing and real-time tracking—mirroring the User App experience on the
        web.
      </p>
    </Container>
  );
}

