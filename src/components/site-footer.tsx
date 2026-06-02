import Link from "next/link";
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t bg-background">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <span className="grid size-7 place-items-center rounded-xl bg-primary text-primary-foreground">
                RS
              </span>
              <span>Repair Series</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Premium home services with transparent pricing, verified
              technicians, and real-time booking updates.
            </p>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-medium">Explore</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/services">
                  Services
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/categories">
                  Categories
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/about">
                  About
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-medium">Legal</div>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link className="hover:text-foreground" href="/privacy-policy">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link className="hover:text-foreground" href="/terms">
                  Terms
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3 text-sm">
            <div className="font-medium">Get the app</div>
            <p className="text-muted-foreground">
              Prefer mobile? Download the Repair Series app for faster booking
              and live updates.
            </p>
            <div className="flex flex-wrap gap-2">
              <a
                className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                href="#"
              >
                Google Play
              </a>
              <a
                className="inline-flex h-10 items-center rounded-xl border px-4 text-sm font-medium hover:bg-muted"
                href="#"
              >
                App Store
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div>© {new Date().getFullYear()} Repair Series. All rights reserved.</div>
          <div className="flex gap-4">
            <Link className="hover:text-foreground" href="/contact">
              Support
            </Link>
            <Link className="hover:text-foreground" href="/privacy-policy">
              Privacy
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}

