"use client";

import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getDb } from "@/lib/firebase/firestore";

type BookingDoc = {
  id: string;
  serviceName?: string;
  serviceId?: string;
  bookingDate?: string;
  slot?: string;
  address?: string;
  status?: string;
  createdAt?: unknown;
};

const TABS = [
  { key: "upcoming", label: "Upcoming", statuses: ["pending", "upcoming"] },
  { key: "processing", label: "Processing", statuses: ["processing", "assigned"] },
  { key: "completed", label: "Completed", statuses: ["completed"] },
  { key: "cancelled", label: "Cancelled", statuses: ["cancelled", "canceled"] },
] as const;

export function MyBookings() {
  const { user, loading: authLoading } = useAuth();
  const db = useMemo(() => getDb(), []);

  const [active, setActive] = useState<(typeof TABS)[number]["key"]>("upcoming");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [all, setAll] = useState<BookingDoc[]>([]);

  useEffect(() => {
    if (authLoading) return;
    if (!db) {
      Promise.resolve().then(() => {
        setError(
          "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values.",
        );
        setLoading(false);
      });
      return;
    }
    if (!user) {
      Promise.resolve().then(() => {
        setAll([]);
        setLoading(false);
      });
      return;
    }

    Promise.resolve().then(() => {
      setLoading(true);
      setError(null);
    });

    const q = query(
      collection(db, "bookings"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const rows: BookingDoc[] = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Record<string, unknown>),
        }));
        setAll(rows);
        setLoading(false);
      },
      (e) => {
        setError(e.message);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [authLoading, db, user]);

  const filtered = useMemo(() => {
    const tab = TABS.find((t) => t.key === active) ?? TABS[0];
    return all.filter((b) => {
      const st = (b.status ?? "").toString().toLowerCase();
      return tab.statuses.includes(st as never);
    });
  }, [active, all]);

  if (error) {
    return (
      <div className="mt-6 rounded-2xl border bg-card p-6">
        <div className="text-sm font-medium">Couldn’t load bookings</div>
        <div className="mt-2 text-sm text-muted-foreground">{error}</div>
      </div>
    );
  }

  if (!authLoading && !user) {
    return (
      <div className="mt-6 rounded-2xl border bg-card p-6">
        <div className="text-sm font-medium">Sign in required</div>
        <div className="mt-2 text-sm text-muted-foreground">
          Please sign in to view your bookings.
        </div>
        <div className="mt-4">
          <Link href="/auth">
            <Button size="lg">Sign in</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!authLoading && user && loading && all.length === 0) {
    // keep skeletons
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setActive(t.key)}
            className={[
              "h-10 rounded-xl border px-4 text-sm font-medium transition",
              active === t.key ? "bg-primary text-primary-foreground" : "hover:bg-muted",
            ].join(" ")}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-36 animate-pulse rounded-2xl border bg-card"
            />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border bg-card p-6">
          <div className="text-sm font-medium">No bookings</div>
          <div className="mt-2 text-sm text-muted-foreground">
            Nothing in this section yet.
          </div>
          <div className="mt-4">
            <Link href="/categories">
              <Button variant="outline" size="lg">
                Browse categories
              </Button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {filtered.map((b) => (
            <div key={b.id} className="rounded-2xl border bg-card p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-base font-semibold">
                    {b.serviceName ?? "Service"}
                  </div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Booking ID: {b.id}
                  </div>
                </div>
                <div className="rounded-xl bg-muted px-2.5 py-1 text-xs font-medium">
                  {(b.status ?? "pending").toString()}
                </div>
              </div>

              <div className="mt-4 grid gap-1 text-sm text-muted-foreground">
                <div>
                  <span className="font-medium text-foreground">Date:</span>{" "}
                  {b.bookingDate ?? "—"}
                </div>
                <div>
                  <span className="font-medium text-foreground">Slot:</span>{" "}
                  {b.slot ?? "—"}
                </div>
                <div className="line-clamp-2">
                  <span className="font-medium text-foreground">Address:</span>{" "}
                  {b.address ?? "—"}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

