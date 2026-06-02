"use client";

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getDb } from "@/lib/firebase/firestore";
import { 
  AlertCircle, 
  ArrowLeft, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ImageOff, 
  MapPin, 
  SearchX,
  Check
} from "lucide-react";

type ServiceVariation = {
  id: string;
  title: string;
  price: number;
  image?: string | null;
  status?: string;
};

type ProcessStep = {
  title: string;
  description: string;
  image?: string | null;
};

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
  slug?: string;
  keyPoints?: string[];
  processSteps?: ProcessStep[];
  hasVariations?: boolean;
  variations?: ServiceVariation[];
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

export function ServiceDetail({ serviceIdOrSlug }: { serviceIdOrSlug: string }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [service, setService] = useState<ServiceDoc | null>(null);
  const [selectedVariationId, setSelectedVariationId] = useState<string | null>(null);

  const db = useMemo(() => getDb(), []);
  const servicesCol = useMemo(() => (db ? collection(db, "services") : null), [db]);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (mounted) {
        setLoading(true);
        setError(null);
        setService(null);
      }

      try {
        if (!db) {
          throw new Error(
            "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values."
          );
        }
        // First try doc ID lookup.
        const byId = await getDoc(doc(db, "services", serviceIdOrSlug));
        let row: ServiceDoc | null = null;
        
        if (byId.exists()) {
          row = { id: byId.id, ...(byId.data() as Record<string, unknown>) };
        } else if (servicesCol) {
          // Then try a slug lookup.
          const q = query(servicesCol, where("slug", "==", serviceIdOrSlug));
          const snap = await getDocs(q);
          const first = snap.docs[0];
          if (first) {
            row = { id: first.id, ...(first.data() as Record<string, unknown>) };
          }
        }

        if (!mounted) return;
        
        if (row) {
          setService(row);
          // Auto-select the first variation if they exist
          if (row.variations && row.variations.length > 0) {
            setSelectedVariationId(row.variations[0].id);
          }
        } else {
          setService(null);
        }

      } catch (e) {
        if (!mounted) return;
        setError(e instanceof Error ? e.message : "Failed to load service");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [db, serviceIdOrSlug, servicesCol]);

  // Premium Error State
  if (error) {
    return (
      <div className="mx-auto mt-8 flex max-w-3xl items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-6 text-red-900 shadow-sm">
        <AlertCircle className="mt-0.5 size-6 shrink-0 text-red-500" />
        <div>
          <h3 className="text-base font-bold">Couldn’t load service</h3>
          <p className="mt-1 text-sm leading-relaxed text-red-700/90">{error}</p>
          <Link href="/services" className="mt-4 inline-flex items-center text-sm font-bold text-red-600 hover:underline">
            <ArrowLeft className="mr-1.5 size-4" /> Back to services
          </Link>
        </div>
      </div>
    );
  }

  // Premium Loading Skeletons
  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="flex flex-col overflow-hidden rounded-[20px] border border-gray-100 bg-white shadow-sm">
          <div className="aspect-[16/10] w-full animate-pulse bg-gray-200" />
          <div className="p-6">
            <div className="mb-4 h-8 w-1/2 animate-pulse rounded-md bg-gray-200" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-4/6 animate-pulse rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-[20px] border border-gray-100 bg-white shadow-sm" />
          <div className="h-64 animate-pulse rounded-[20px] border border-gray-100 bg-white shadow-sm" />
        </div>
      </div>
    );
  }

  // Premium Not Found State
  if (!service) {
    return (
      <div className="mx-auto mt-8 flex max-w-2xl flex-col items-center justify-center rounded-[20px] border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-gray-100">
          <SearchX className="size-7 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold text-[#0a0f1c]">Service not found</h3>
        <p className="mt-2 max-w-md text-sm text-[#64748b]">
          The service might be unavailable, or your Firestore security rules don’t allow reads for this page.
        </p>
        <Link 
          href="/services" 
          className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0a0f1c] px-6 text-sm font-medium text-white transition-colors hover:bg-[#162032]"
        >
          <ArrowLeft className="mr-2 size-4" /> Back to services
        </Link>
      </div>
    );
  }

  const name = getServiceName(service);
  const img = getServiceImage(service);
  
  // Calculate dynamic price based on selected variation (or fallback to base price)
  const basePrice = getServicePrice(service);
  const selectedVariation = service.variations?.find(v => v.id === selectedVariationId);
  const displayPrice = selectedVariation ? selectedVariation.price : basePrice;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Back Navigation */}
      <Link 
        href="/services" 
        className="mb-6 inline-flex items-center text-sm font-semibold text-[#64748b] transition-colors hover:text-[#f96316]"
      >
        <ArrowLeft className="mr-2 size-4" /> Back to all services
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
        
        {/* Left Column: Image and Details */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
            <div className="relative aspect-[16/10] w-full bg-gray-100">
              {img ? (
                <img 
                  alt={name} 
                  src={img} 
                  className="h-full w-full object-cover" 
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-[#94a3b8]">
                  <ImageOff className="mb-2 size-10 opacity-50" />
                  <span className="text-sm font-medium uppercase tracking-wider opacity-70">No image available</span>
                </div>
              )}
            </div>
            
            <div className="p-6 sm:p-8">
              <h1 className="text-3xl font-bold tracking-tight text-[#0a0f1c] sm:text-4xl">{name}</h1>
              <div className="mt-6">
                <h3 className="mb-2 text-lg font-bold text-[#0a0f1c]">Service Description</h3>
                <p className="text-[1.05rem] leading-relaxed text-[#64748b]">
                  {service.description ?? "Expert repair, installation, and maintenance by verified professionals. Book a slot today to get your appliance working perfectly."}
                </p>
              </div>

              {/* Key Points */}
              {service.keyPoints && service.keyPoints.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="mb-4 text-lg font-bold text-[#0a0f1c]">Key Highlights</h3>
                  <ul className="grid gap-3 sm:grid-cols-2">
                    {service.keyPoints.map((point, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-[0.95rem] text-[#64748b]">
                        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#25D366]" />
                        <span className="leading-snug">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Process Steps (Timeline) */}
              {service.processSteps && service.processSteps.length > 0 && (
                <div className="mt-8 border-t border-gray-100 pt-8">
                  <h3 className="mb-6 text-lg font-bold text-[#0a0f1c]">How it Works</h3>
                  <div className="ml-2 space-y-6 border-l-2 border-[#f96316]/20 pl-6">
                    {service.processSteps.map((step, idx) => (
                      <div key={idx} className="relative">
                        {/* Timeline dot */}
                        <span className="absolute -left-[31px] top-1 flex size-3.5 rounded-full bg-[#f96316] ring-4 ring-white" />
                        <h4 className="font-bold text-[#0a0f1c]">{step.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-[#64748b]">
                          {step.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing & Steps */}
        <aside className="space-y-6">
          
          {/* Pricing Card */}
          <div className="rounded-[20px] border border-[#f96316]/20 bg-orange-50/50 p-6 shadow-sm sm:p-8">
            <div className="text-sm font-bold uppercase tracking-wider text-[#f96316]">Service Pricing</div>
            <div className="mt-3 flex items-baseline gap-2 text-[#0a0f1c]">
              <span className="text-4xl font-extrabold">{typeof displayPrice === "number" ? `₹${displayPrice}` : "—"}</span>
              {typeof displayPrice === "number" && <span className="text-sm font-semibold text-[#64748b]">/ total</span>}
            </div>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-[#64748b]">
              <Clock className="size-4" />
              {service.duration ? `Duration: ${service.duration}` : "Duration varies based on repair"}
            </div>

            {/* Variations Selection */}
            {service.variations && service.variations.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-[#f96316]/10 pt-6">
                <div className="text-sm font-bold text-[#0a0f1c]">Select Option:</div>
                <div className="grid gap-2">
                  {service.variations.map((variation) => {
                    const isSelected = selectedVariationId === variation.id;
                    return (
                      <button
                        key={variation.id}
                        onClick={() => setSelectedVariationId(variation.id)}
                        className={`flex w-full items-center justify-between rounded-xl border p-3 text-left transition-all ${
                          isSelected 
                            ? "border-[#f96316] bg-white shadow-sm ring-1 ring-[#f96316]" 
                            : "border-gray-200 bg-white/50 hover:bg-white hover:border-[#f96316]/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${isSelected ? "border-[#f96316] bg-[#f96316]" : "border-gray-300"}`}>
                            {isSelected && <Check className="size-3.5 text-white" />}
                          </div>
                          <span className={`text-sm font-medium ${isSelected ? "text-[#0a0f1c]" : "text-[#64748b]"}`}>
                            {variation.title}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-[#0a0f1c]">₹{variation.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            
            <Link
              href="/book" // You can append ?serviceId=...&variationId=... here in the future
              className="mt-6 inline-flex h-14 w-full items-center justify-center rounded-full bg-[#f96316] px-5 text-base font-bold text-white shadow-[0_8px_20px_rgba(249,99,22,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#ea580c] hover:shadow-[0_10px_25px_rgba(249,99,22,0.35)]"
            >
              Book this service
            </Link>
            <p className="mt-4 text-center text-xs text-[#64748b]">
              No hidden fees. 30-day warranty on all repairs.
            </p>
          </div>

          {/* Steps Card */}
          <div className="rounded-[20px] border border-black/5 bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.02)] sm:p-8">
            <h3 className="text-lg font-bold text-[#0a0f1c]">What happens next?</h3>
            <ul className="mt-6 space-y-5">
              <li className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <Calendar className="size-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0a0f1c]">1. Choose a date</div>
                  <div className="text-sm text-[#64748b]">Pick a day that works for you.</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-[#f96316]">
                  <Clock className="size-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0a0f1c]">2. Pick a time slot</div>
                  <div className="text-sm text-[#64748b]">Select an available 90-minute window.</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0a0f1c]">3. Confirm address</div>
                  <div className="text-sm text-[#64748b]">Provide your exact Gurugram location.</div>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 className="size-4" />
                </div>
                <div>
                  <div className="font-bold text-[#0a0f1c]">4. Track your booking</div>
                  <div className="text-sm text-[#64748b]">Get live updates on technician arrival.</div>
                </div>
              </li>
            </ul>
          </div>
          
        </aside>
      </div>
    </div>
  );
}