import { notFound } from "next/navigation";
import { Container } from "@/components/container";
import { ClientEnvLogger } from "@/app/dev/env/client-env-logger";

export const metadata = {
  title: "Env Debug",
  robots: { index: false, follow: false },
};

export default function EnvDebugPage() {
  if (process.env.NODE_ENV === "production") notFound();

  // Server-side visibility
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_API_KEY =", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_PROJECT_ID =", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
  console.log("[Repair Series][server] NEXT_PUBLIC_FIREBASE_APP_ID =", !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID);

  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Env Debug (dev only)</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        This page logs Firebase env vars on both the server console and the browser console.
      </p>
      <ClientEnvLogger />
    </Container>
  );
}

