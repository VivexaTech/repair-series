import { Container } from "@/components/container";

export const metadata = {
  title: "Sign in",
  description: "Sign in to Repair Series to manage bookings and profile.",
};

export default function AuthPage() {
  return (
    <Container className="py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        Next we’ll implement the full customer authentication flow using Firebase
        Authentication, including phone OTP (same as the User App), plus login
        and signup screens.
      </p>

      <div className="mt-8 rounded-2xl border bg-card p-6">
        <div className="text-sm font-medium">Phone OTP login (planned)</div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="h-11 rounded-xl bg-muted/60" />
          <div className="h-11 rounded-xl bg-muted/60" />
          <div className="h-11 rounded-xl bg-muted/60 sm:col-span-2" />
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Requires Firebase web config in `.env.local` and reCAPTCHA verification.
        </div>
      </div>
    </Container>
  );
}

