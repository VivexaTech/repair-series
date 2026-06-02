import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { FirestoreDevInspector } from "@/app/dev/firestore/inspector";

export const metadata = {
  title: "Firestore Inspector",
  robots: { index: false, follow: false },
};

export default function FirestoreDevPage() {
  if (process.env.NODE_ENV === "production") notFound();

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">
        Firestore Inspector (dev only)
      </h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        This helps us confirm your existing collection field names so the web
        experience matches the User App exactly.
      </p>
      <FirestoreDevInspector />
    </Container>
  );
}

