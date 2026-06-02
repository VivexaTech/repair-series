import Link from "next/link";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/categories", label: "Categories" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2 font-semibold tracking-tight",
            "text-foreground",
          )}
        >
          <span className="grid size-7 place-items-center rounded-xl bg-primary text-primary-foreground">
            RS
          </span>
          <span>Repair Series</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/auth"
            className="inline-flex h-10 items-center justify-center rounded-xl border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign in
          </Link>
          <Link
            href="/book"
            className="inline-flex h-10 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition-opacity hover:opacity-95"
          >
            Book now
          </Link>
        </div>
      </Container>
    </header>
  );
}

