"use client";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { getDb } from "@/lib/firebase/firestore";

type ServiceDoc = {
  id: string;
  name?: string;
  title?: string;
  image?: string;
  imageUrl?: string;
  price?: number;
  amount?: number;
  description?: string;
  categoryId?: string;
  category_id?: string;
  slug?: string;
};

type BookingDraft = {
  bookingDate: string; // yyyy-mm-dd
  slot: string;
  customerName: string;
  phone: string;
  address: string;
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

async function loadService(serviceIdOrSlug: string) {
  const db = getDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values.",
    );
  }

  const byId = await getDoc(doc(db, "services", serviceIdOrSlug));
  if (byId.exists()) {
    return {
      id: byId.id,
      ...(byId.data() as Record<string, unknown>),
    } as ServiceDoc;
  }

  const servicesCol = collection(db, "services");
  const q = query(servicesCol, where("slug", "==", serviceIdOrSlug));
  const snap = await getDocs(q);
  const first = snap.docs[0];
  if (!first) return null;
  return {
    id: first.id,
    ...(first.data() as Record<string, unknown>),
  } as ServiceDoc;
}

const STEPS = [
  "Service details",
  "Select date",
  "Select time slot",
  "Address",
  "Review booking",
  "Confirm booking",
] as const;

export function BookingFlow({ serviceIdOrSlug }: { serviceIdOrSlug: string }) {
  const { user, loading: authLoading } = useAuth();
  const db = useMemo(() => getDb(), []);

  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState<ServiceDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [draft, setDraft] = useState<BookingDraft>({
    bookingDate: "",
    slot: "",
    customerName: "",
    phone: "",
    address: "",
  });

  // Lazy load service (button-triggered on first render to keep component simple and avoid useEffect setState lint).
  if (loading && !error && !service) {
    (async () => {
      try {
        const s = await loadService(serviceIdOrSlug);
        setService(s);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load service");
      } finally {
        setLoading(false);
      }
    })();
  }

  const canGoNext =
    (step === 0 && !!service) ||
    (step === 1 && !!draft.bookingDate) ||
    (step === 2 && !!draft.slot) ||
    (step === 3 && !!draft.address && !!draft.customerName && !!draft.phone) ||
    step === 4 ||
    step === 5;

  const onConfirm = async () => {
    if (!db) {
      setError(
        "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values.",
      );
      return;
    }
    if (!service) return;
    if (authLoading) return;
    if (!user) {
      setError("Please sign in to confirm booking.");
      return;
    }

    const categoryId = service.categoryId ?? service.category_id ?? "";
    if (!categoryId) {
      setError("Service is missing category reference in Firestore.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const payload = {
        userId: user.uid,
        serviceId: service.id,
        serviceName: getServiceName(service),
        categoryId,
        customerName: draft.customerName,
        phone: draft.phone,
        address: draft.address,
        bookingDate: draft.bookingDate,
        slot: draft.slot,
        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "bookings"), payload);
      window.location.href = "/dashboard/bookings";
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">Booking</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </div>
          <Link className="text-sm font-medium underline" href="/services">
            Back to services
          </Link>
        </div>

        {error ? (
          <div className="mt-6 rounded-2xl border bg-card p-6">
            <div className="text-sm font-medium">Booking error</div>
            <div className="mt-2 text-sm text-muted-foreground">{error}</div>
            {!user ? (
              <div className="mt-4">
                <Link href="/auth">
                  <Button variant="outline" size="lg">
                    Sign in
                  </Button>
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="mt-6 rounded-2xl border bg-card p-6">
          {loading ? (
            <div className="h-52 animate-pulse rounded-xl bg-muted/60" />
          ) : !service ? (
            <div>
              <div className="text-sm font-medium">Service not found</div>
              <div className="mt-2 text-sm text-muted-foreground">
                This service may be unavailable.
              </div>
            </div>
          ) : (
            <>
              {step === 0 ? (
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
                    {getServiceImage(service) ? (
                      <Image
                        alt={getServiceName(service)}
                        src={getServiceImage(service)!}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-xl font-semibold">
                      {getServiceName(service)}
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {service.description ?? "Service details will appear here."}
                    </div>
                    <div className="mt-4 text-sm">
                      <span className="text-muted-foreground">Starting at </span>
                      <span className="font-semibold">
                        {typeof getServicePrice(service) === "number"
                          ? `₹${getServicePrice(service)}`
                          : "—"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 1 ? (
                <div className="space-y-2">
                  <div className="text-sm font-medium">Select date</div>
                  <input
                    type="date"
                    value={draft.bookingDate}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, bookingDate: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              ) : null}

              {step === 2 ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Select time slot</div>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {[
                      // NOTE: slot source will be swapped to your existing slot logic next.
                      "09:00 - 11:00",
                      "11:00 - 13:00",
                      "13:00 - 15:00",
                      "15:00 - 17:00",
                      "17:00 - 19:00",
                      "19:00 - 21:00",
                    ].map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setDraft((d) => ({ ...d, slot }))}
                        className={[
                          "h-11 rounded-xl border px-3 text-sm font-medium transition",
                          draft.slot === slot
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted",
                        ].join(" ")}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Slot availability logic will be wired to your existing
                    Firestore-based booking/slot rules next.
                  </div>
                </div>
              ) : null}

              {step === 3 ? (
                <div className="grid gap-3">
                  <div className="text-sm font-medium">Address</div>
                  <input
                    placeholder="Customer name"
                    value={draft.customerName}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, customerName: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <input
                    placeholder="Phone"
                    value={draft.phone}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, phone: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <textarea
                    placeholder="Full address"
                    value={draft.address}
                    onChange={(e) =>
                      setDraft((d) => ({ ...d, address: e.target.value }))
                    }
                    className="min-h-[120px] w-full rounded-xl border bg-background p-4 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
              ) : null}

              {step === 4 ? (
                <div className="space-y-3 text-sm">
                  <div className="text-sm font-medium">Review booking</div>
                  <div className="rounded-xl bg-muted/40 p-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service</span>
                      <span className="font-medium">{getServiceName(service)}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium">{draft.bookingDate || "—"}</span>
                    </div>
                    <div className="mt-2 flex justify-between">
                      <span className="text-muted-foreground">Slot</span>
                      <span className="font-medium">{draft.slot || "—"}</span>
                    </div>
                    <div className="mt-2">
                      <div className="text-muted-foreground">Address</div>
                      <div className="mt-1 font-medium">{draft.address || "—"}</div>
                    </div>
                  </div>
                </div>
              ) : null}

              {step === 5 ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium">Confirm booking</div>
                  <p className="text-sm text-muted-foreground">
                    We’ll create a booking in Firestore with status{" "}
                    <span className="font-medium">pending</span>.
                  </p>
                  <Button
                    size="lg"
                    disabled={submitting || authLoading}
                    onClick={onConfirm}
                  >
                    {submitting ? "Confirming..." : "Confirm booking"}
                  </Button>
                </div>
              ) : null}
            </>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="lg"
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0 || submitting}
          >
            Back
          </Button>
          <Button
            size="lg"
            onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}
            disabled={!canGoNext || step === STEPS.length - 1 || submitting}
          >
            Next
          </Button>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-2xl border bg-card p-6">
          <div className="text-sm font-medium">Account</div>
          <div className="mt-2 text-sm text-muted-foreground">
            {authLoading
              ? "Checking sign-in status..."
              : user
                ? `Signed in: ${user.uid}`
                : "Not signed in (required to confirm booking)."}
          </div>
          {!authLoading && !user ? (
            <div className="mt-4">
              <Link href="/auth">
                <Button variant="outline" size="lg" className="w-full">
                  Sign in
                </Button>
              </Link>
            </div>
          ) : null}
        </div>

        <div className="rounded-2xl border bg-card p-6">
          <div className="text-sm font-medium">After booking</div>
          <p className="mt-2 text-sm text-muted-foreground">
            You’ll be redirected to{" "}
            <span className="font-medium">/dashboard/bookings</span>.
          </p>
        </div>
      </aside>
    </div>
  );
}

