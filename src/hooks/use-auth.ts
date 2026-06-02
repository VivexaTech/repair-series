"use client";

import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { getAuthClient } from "@/lib/firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuthClient();
    if (!auth) return;

    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  // If Firebase Auth isn't configured, we consider it "not loading" and signed out.
  if (loading && !getAuthClient()) {
    return { user: null, loading: false };
  }

  return { user, loading };
}

