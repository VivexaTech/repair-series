import Link from "next/link";
import { Container } from "@/components/container";

export const metadata = {
  title: "Book a service",
  description: "Start your booking flow (matches the Repair Series User App).",
};

export default function BookPage() {
  return (
    <Container className="py-12">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Book a service</h1>
        <p className="max-w-3xl text-muted-foreground">
          Next we’ll implement the exact 7-step booking flow used in the User
          App: category → service → variation → date → slot → address → confirm.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border bg-card p-6">
        <div className="text-sm font-medium">Booking flow (coming up)</div>
        <ol className="mt-4 grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <li>1. Select category</li>
          <li>2. Select service</li>
          <li>3. Select variation (if available)</li>
          <li>4. Choose date</li>
          <li>5. Choose slot</li>
          <li>6. Address</li>
          <li>7. Confirm booking</li>
        </ol>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/categories"
            className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium hover:bg-muted"
          >
            Browse categories
          </Link>
          <Link
            href="/services"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
          >
            Browse services
          </Link>
        </div>
      </div>
    </Container>
  );
}

