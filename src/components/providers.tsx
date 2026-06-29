"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/context/cart-context";
import { CatalogProvider } from "@/context/catalog-context";
import { LocationProvider } from "@/context/location-context";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <LocationProvider>
      <CatalogProvider>
        <CartProvider>{children}</CartProvider>
      </CatalogProvider>
    </LocationProvider>
  );
}
