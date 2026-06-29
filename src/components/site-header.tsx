"use client";

import Link from "next/link";
import { useState } from "react";
import { Container } from "@/components/container";
import { HeaderAuth } from "@/components/header-auth";
import { HeaderCartButton } from "@/components/header/header-cart";
import { HeaderLocationDropdown } from "@/components/header/header-location";
import { HeaderSearch } from "@/components/header/header-search";
import { Search } from "lucide-react";

export function SiteHeader() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-white transition-all">
      <Container className="flex h-[72px] items-center justify-between gap-4 lg:gap-6">
        <div className="flex items-center gap-4 lg:gap-8">
          <Link
            href="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-85"
          >
            <div className="flex size-10 items-center justify-center rounded-lg bg-black text-white">
              <img src="/web-app-manifest-192x192.png" alt="Repair Series" className="size-10" />
            </div>
            <div className="flex flex-col text-[15px] font-bold leading-[1.1] text-black">
              <span>Repair</span>
              <span>Series</span>
            </div>
          </Link>
        </div>

        <div className="hidden flex-1 items-center gap-4 lg:flex lg:px-6">
          <HeaderLocationDropdown />
          <HeaderSearch />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            aria-label="Search"
            onClick={() => setMobileSearchOpen((v) => !v)}
            className="flex size-10 items-center justify-center rounded-full border border-gray-200 lg:hidden"
          >
            <Search className="size-5" />
          </button>
          <HeaderCartButton />
          <HeaderAuth />
        </div>
      </Container>

      {mobileSearchOpen ? (
        <div className="border-t border-gray-100 px-4 py-3 lg:hidden animate-in slide-in-from-top-2 duration-200">
          <HeaderSearch />
        </div>
      ) : null}
    </header>
  );
}
