import { Container } from "@/components/container";

export const metadata = {
  title: "Categories",
  description: "Browse service categories and start your booking.",
};

export default function CategoriesPage() {
  return (
    <Container className="py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Categories</h1>
        <p className="text-muted-foreground">
          This page will fetch and render the live `categories` collection from
          Firestore exactly like the User App.
        </p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, idx) => (
          <div
            key={idx}
            className="h-32 animate-pulse rounded-2xl border bg-card"
          />
        ))}
      </div>
    </Container>
  );
}

