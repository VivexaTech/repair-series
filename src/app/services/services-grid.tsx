"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDb } from "@/lib/firebase/firestore";
import { ArrowRight, AlertCircle, ImageOff } from "lucide-react";

type ServiceDoc = {
  id: string;
  name?: string;
  title?: string;
  image?: string;
  imageUrl?: string;
  price?: number;
  amount?: number;
  duration?: string | number;
  description?: string;
  categoryId?: string;
  category_id?: string;
  active?: boolean;
  isActive?: boolean;
  slug?: string;
};

function getServiceName(s: ServiceDoc) {
  return s.name ?? s.title ?? "Service";
}

function getServiceImage(s: ServiceDoc) {
  return s.imageUrl ?? s.image ?? null;
}

function getServicePrice(s: ServiceDoc) {
  const v = typeof s.price === "number" ? s.price : s.amount;
  return typeof v === "number" ? v : null;
}

export function ServicesGrid() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [services, setServices] = useState<ServiceDoc[]>([]);

  const servicesCol = useMemo(() => {
    const db = getDb();
    return db ? collection(db, "services") : null;
  }, []);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        if (!servicesCol) {
          throw new Error(
            "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values."
          );
        }
        const q = query(servicesCol, orderBy("name", "asc"));
        const snap = await getDocs(q);
        const rows: ServiceDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Record<string, unknown>),
        }));

        if (!mounted) return;
        setServices(rows);
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : "Failed to load services from Firestore"
        );
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [servicesCol]);

  // Premium Error State
  if (error) {
    return (
      <div className="mt-8 flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-900 shadow-sm">
        <AlertCircle className="mt-0.5 size-6 shrink-0 text-red-500" />
        <div>
          <h3 className="text-base font-bold">Couldn’t load services</h3>
          <p className="mt-1 text-sm leading-relaxed text-red-700/90">{error}</p>
          <p className="mt-3 text-xs font-medium text-red-600/70">
            Ensure Firebase web config exists in `.env.local` and Firestore rules allow reading `services`.
          </p>
        </div>
      </div>
    );
  }

  // Premium Loading Skeletons
  if (loading) {
    return (
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={idx}
            className="flex flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm"
          >
            <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />
            <div className="flex flex-1 flex-col p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-200" />
                <div className="h-6 w-16 animate-pulse rounded-full bg-gray-100" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-4/5 animate-pulse rounded bg-gray-100" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No Services Found State
  if (!loading && services.length === 0) {
    return (
      <div className="mt-8 flex flex-col items-center justify-center rounded-[20px] border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-gray-100">
          <ImageOff className="size-6 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold text-[#0a0f1c]">No Services Found</h3>
        <p className="mt-1 text-sm text-[#64748b]">Check back later for newly added services.</p>
      </div>
    );
  }

  // Beautiful Service Grid
  return (
    <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((s) => {
        const name = getServiceName(s);
        const img = getServiceImage(s);
        const price = getServicePrice(s);
        const href = s.slug ? `/services/${s.slug}` : `/services/${s.id}`;

        return (
          <Link
            key={s.id}
            href={href}
            className="group flex h-full flex-col overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-400 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)]"
          >
            {/* Image Container with Overlay */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100">
              {img ? (
                <>
                  <Image
                    alt={name}
                    src={img}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {/* Subtle dark gradient overlay for a premium feel */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-[#94a3b8]">
                  <ImageOff className="mb-2 size-8 opacity-50" />
                  <span className="text-xs font-medium uppercase tracking-wider opacity-70">No Image</span>
                </div>
              )}
            </div>

            {/* Content Container */}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="line-clamp-2 text-lg font-bold leading-tight text-[#0a0f1c]">
                  {name}
                </h3>
                {typeof price === "number" ? (
                  <div className="shrink-0 rounded-full bg-orange-50 px-3 py-1 text-sm font-bold text-[#f96316]">
                    ₹{price}
                  </div>
                ) : null}
              </div>

              <p className="mt-3 line-clamp-2 flex-1 text-[0.9rem] leading-relaxed text-[#64748b]">
                {s.description ?? "Expert repair, installation, and maintenance. Book a slot today."}
              </p>

              {/* Action Footer */}
              <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <span className="text-sm font-semibold text-[#0a0f1c] transition-colors group-hover:text-[#f96316]">
                  View Details
                </span>
                <div className="flex size-8 items-center justify-center rounded-full bg-gray-50 text-gray-400 transition-colors group-hover:bg-[#f96316] group-hover:text-white">
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}