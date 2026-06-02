import Link from "next/link";
import { Container } from "@/components/container";
import { cn } from "@/lib/cn";
import { Wrench } from "lucide-react";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#coverage", label: "Coverage" },
  { href: "/#faq", label: "FAQ" },
  { href: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/85 backdrop-blur-md transition-all">
      <Container className="flex h-[72px] items-center justify-between gap-6">
        
        {/* Brand Logo */}
        <Link
          href="/"
          className={cn(
            "inline-flex items-center gap-2.5 text-xl font-bold tracking-tight text-foreground transition-transform hover:scale-[1.02]"
          )}
        >
          <Wrench className="size-6 text-primary" />
          <span>Repair Series</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
              {/* Premium Underline Hover Effect */}
              <span className="absolute -bottom-1.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/auth"
            className="hidden h-11 items-center justify-center rounded-full border bg-transparent px-5 text-sm font-medium transition-colors hover:bg-muted md:inline-flex"
          >
            Sign in
          </Link>
          <Link
            href="/book"
            className="inline-flex h-11 items-center justify-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground shadow-[0_8px_20px_rgba(249,99,22,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-[0_10px_25px_rgba(249,99,22,0.35)]"
          >
            Book now
          </Link>
        </div>
        
      </Container>
    </header>
  );
}