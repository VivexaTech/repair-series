"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, doc, getDocs, limit, onSnapshot, query } from "firebase/firestore";
import { Container } from "@/components/container";
import { getDb } from "@/lib/firebase/firestore";

type OfferDoc = {
  id: string;
  image?: string;
  imageUrl?: string;
  title?: string;
  description?: string;
  desc?: string;
  link?: string;
  status?: string;
};

export function PromoBannerSection() {
  const [offers, setOffers] = useState<OfferDoc[]>([]);
  const [loading, setLoading] = useState(true);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);

  useEffect(() => {
    const db = getDb();
    if (!db) {
      setLoading(false);
      return;
    }

    const unsubGeneral = onSnapshot(doc(db, "settings", "general"), (snap) => {
      const data = snap.exists() ? snap.data() : {};
      const url = String(data.homeBannerUrl ?? data.websiteBannerUrl ?? "").trim();
      if (url) setBannerUrl(url);
    });

    void getDocs(query(collection(db, "offers"), limit(5))).then((snap) => {
      const rows = snap.docs
        .map((d) => ({ id: d.id, ...d.data() }) as OfferDoc)
        .filter((o) => String(o.status ?? "Active").toLowerCase() !== "inactive");
      setOffers(rows);
      setLoading(false);
    });

    return () => unsubGeneral();
  }, []);

  const primary = offers[0];
  const image =
    bannerUrl ||
    primary?.image ||
    primary?.imageUrl ||
    null;
  const title = primary?.title || "Premium Home Services";
  const desc =
    primary?.description ||
    primary?.desc ||
    "Same-day appliance repair & cleaning across Gurugram, Hyderabad & Aligarh.";

  if (loading && !image) {
    return (
      <section className="py-12">
        <Container>
          <div className="h-[220px] animate-pulse rounded-[24px] bg-gray-200 sm:h-[280px]" />
        </Container>
      </section>
    );
  }

  return (
    <section className="py-12">
      <Container>
        <div className="relative overflow-hidden rounded-[24px] border border-black/5 bg-[#0a0f1c] shadow-[0_20px_50px_rgba(0,0,0,0.12)]">
          {image ? (
            <img
              src={image}
              alt={title}
              className="absolute inset-0 h-full w-full object-cover opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f1c] via-[#162032] to-[#f96316]/30" />
          )}
          <div className="relative z-10 flex min-h-[220px] flex-col justify-center px-6 py-10 sm:min-h-[280px] sm:px-12">
            <span className="text-sm font-bold uppercase tracking-wide text-[#f96316]">
              Limited Time Offer
            </span>
            <h2 className="mt-2 max-w-xl text-3xl font-bold text-white sm:text-4xl">
              {title}
            </h2>
            <p className="mt-3 max-w-lg text-base text-white/80">{desc}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#f96316] px-8 text-sm font-bold text-white shadow-lg transition hover:bg-[#ea580c]"
              >
                Book Now
              </Link>
              <Link
                href="/services"
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 bg-white/10 px-8 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
              >
                Explore Services
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
