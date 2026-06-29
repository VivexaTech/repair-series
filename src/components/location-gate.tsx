"use client";

import { Loader2, MapPin, Navigation } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { reverseGeocode } from "@/lib/geocode";
import { dispatchLocationChanged } from "@/lib/location/events";
import {
  isLocationOnboardingDone,
  loadStoredUserLocation,
  markLocationOnboardingDone,
  saveStoredUserLocation,
} from "@/lib/location/user-location";

type Phase = "detecting" | "denied" | "hidden";

export function LocationGate() {
  const [phase, setPhase] = useState<Phase>("hidden");
  const [progress, setProgress] = useState(0);

  const detect = useCallback(async () => {
    if (!navigator.geolocation) {
      setPhase("denied");
      return;
    }
    setPhase("detecting");
    setProgress(15);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        setProgress(65);
        const { latitude, longitude } = pos.coords;
        try {
          const parsed = await reverseGeocode(latitude, longitude);
          saveStoredUserLocation({
            lat: latitude,
            lng: longitude,
            label: parsed.fullAddress || parsed.city || "Current location",
            address: parsed.fullAddress || "",
            city: parsed.city,
            state: parsed.state,
            pincode: parsed.pincode,
            street: parsed.street,
            area: parsed.area,
            cachedAt: Date.now(),
          });
          dispatchLocationChanged();
        } catch {
          saveStoredUserLocation({
            lat: latitude,
            lng: longitude,
            label: "Current location",
            cachedAt: Date.now(),
          });
          dispatchLocationChanged();
        }
        setProgress(100);
        markLocationOnboardingDone();
        setTimeout(() => setPhase("hidden"), 400);
      },
      () => {
        setPhase("denied");
      },
      { enableHighAccuracy: true, timeout: 20000 },
    );
  }, []);

  useEffect(() => {
    if (loadStoredUserLocation() || isLocationOnboardingDone()) return;
    void detect();
  }, [detect]);

  useEffect(() => {
    if (phase !== "detecting") return;
    const t = setInterval(() => {
      setProgress((p) => (p >= 90 ? p : p + 8));
    }, 350);
    return () => clearInterval(t);
  }, [phase]);

  if (phase === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md animate-in fade-in zoom-in-95 rounded-[28px] border border-white/20 bg-white p-8 shadow-2xl">
        {phase === "detecting" ? (
          <>
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-orange-50">
              <MapPin className="size-10 animate-pulse text-[#f96316]" />
            </div>
            <h2 className="text-center text-xl font-bold text-[#0a0f1c]">
              Detecting Your Location…
            </h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-[#64748b]">
              Please wait while we find your current location to show nearby services.
            </p>
            <div className="mt-6 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#f96316] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-sm text-[#64748b]">
              <Loader2 className="size-4 animate-spin text-[#f96316]" />
              Locating…
            </div>
          </>
        ) : (
          <>
            <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full bg-red-50">
              <Navigation className="size-10 text-red-500" />
            </div>
            <h2 className="text-center text-xl font-bold text-[#0a0f1c]">Location needed</h2>
            <p className="mt-3 text-center text-sm leading-relaxed text-[#64748b]">
              Location access is required to show nearby services and available technicians.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => void detect()}
                className="h-12 rounded-full bg-[#f96316] text-sm font-bold text-white"
              >
                Allow Location
              </button>
              <Link
                href="/book"
                onClick={() => markLocationOnboardingDone()}
                className="flex h-12 items-center justify-center rounded-full border border-gray-200 text-sm font-semibold text-[#0a0f1c]"
              >
                Enter Address Manually
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
