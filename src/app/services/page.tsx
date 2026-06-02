import { Container } from "@/components/container";

export const metadata = {
  title: "Services",
  description: "Browse all Repair Series services and book instantly.",
};

export default function ServicesPage() {
  return (
    <Container className="py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Services</h1>
        <p className="text-muted-foreground">
          This page will fetch and render the live `services` collection from
          Firestore (image, name, price, duration, description) exactly like the
          User App.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, idx) => (
          <div
            key={idx}
            className="h-40 animate-pulse rounded-2xl border bg-card"
          />
        ))}
      </div>
    </Container>
  );
}

