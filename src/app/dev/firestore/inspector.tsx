"use client";

import {
  collection,
  getDocs,
  limit,
  query,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { getDb } from "@/lib/firebase/firestore";

function keysOfDoc(doc: QueryDocumentSnapshot) {
  const data = doc.data() as Record<string, unknown>;
  return Object.keys(data).sort();
}

async function sampleKeys(collectionName: string) {
  const db = getDb();
  if (!db) {
    throw new Error(
      "Firebase is not configured. Create `.env.local` with NEXT_PUBLIC_FIREBASE_* values.",
    );
  }
  const snap = await getDocs(
    query(collection(db, collectionName), limit(3)),
  );
  return snap.docs.map((d) => ({
    id: d.id,
    keys: keysOfDoc(d),
  }));
}

export function FirestoreDevInspector() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    let mounted = true;

    const run = async () => {
      if (mounted) {
        setLoading(true);
        setError(null);
      }

      try {
        const data = {
          categories: await sampleKeys("categories"),
          services: await sampleKeys("services"),
        };
        if (mounted) setResult(data);
      } catch (e) {
        if (!mounted) return;
        setError(
          e instanceof Error
            ? e.message
            : "Failed to query Firestore collections",
        );
      } finally {
        if (mounted) setLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="mt-8 rounded-2xl border bg-card p-6">
      <div className="text-sm font-medium">Collection samples</div>
      <div className="mt-2 text-xs text-muted-foreground">
        Showing doc IDs and field keys (first 3 docs).
      </div>

      {loading ? (
        <div className="mt-4 h-40 animate-pulse rounded-xl bg-muted/60" />
      ) : error ? (
        <div className="mt-4 text-sm text-destructive">{error}</div>
      ) : (
        <pre className="mt-4 max-h-[460px] overflow-auto rounded-xl bg-muted/40 p-4 text-xs">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

