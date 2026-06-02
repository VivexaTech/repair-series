import Link from "next/link";
import { Container } from "@/components/container";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      <section className="relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[920px] -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-200 via-sky-200 to-emerald-200 blur-3xl opacity-70 dark:from-indigo-900 dark:via-sky-900 dark:to-emerald-900" />
        </div>
        <Container className="py-16 sm:py-20">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Fast bookings • Verified technicians • Transparent pricing
              </div>
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
                Premium home services, booked in minutes.
              </h1>
              <p className="max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                Browse categories, choose a service, pick a time slot, and track
                every update—from assignment to completion—just like the Repair
                Series User App.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/book"
                  className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
                >
                  Book a service
                </Link>
                <Link
                  href="/services"
                  className="inline-flex h-11 items-center justify-center rounded-xl border px-5 text-sm font-medium hover:bg-muted"
                >
                  Explore services
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="space-y-4">
                <div className="text-sm font-medium">Search services</div>
                <div className="flex gap-2">
                  <input
                    placeholder="AC repair, plumbing, electrician..."
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <Link
                    href="/services"
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground"
                  >
                    Search
                  </Link>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "AC Service",
                    "Plumbing",
                    "Electrician",
                    "Appliance Repair",
                  ].map((label) => (
                    <div
                      key={label}
                      className="rounded-xl border bg-background px-4 py-3 text-sm"
                    >
                      <div className="font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">
                        View pricing & slots
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  Service and category data will be loaded from Firestore (no
                  mock data) once Firebase is connected.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-t bg-muted/30">
        <Container className="py-14">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Verified technicians",
                desc: "Trained professionals with clear status updates.",
              },
              {
                title: "Smart slot availability",
                desc: "Only valid slots show—unavailable slots stay hidden.",
              },
              {
                title: "Easy add-on approvals",
                desc: "Approve or reject additional services instantly.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border bg-card p-6 shadow-sm"
              >
                <div className="text-base font-semibold">{item.title}</div>
                <div className="mt-2 text-sm leading-6 text-muted-foreground">
                  {item.desc}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}
