"use client";

import { useEffect } from "react";

export function ClientEnvLogger() {
  useEffect(() => {
    // Browser-side visibility
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_API_KEY =", !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY);
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN =", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN);
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_PROJECT_ID =", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID);
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET =", process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET);
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID =", process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID);
    console.log("[Repair Series][browser] NEXT_PUBLIC_FIREBASE_APP_ID =", !!process.env.NEXT_PUBLIC_FIREBASE_APP_ID);
  }, []);

  return (
    <div className="mt-8 rounded-2xl border bg-card p-6">
      <div className="text-sm font-medium">Check your consoles</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Open the terminal running `npm run dev` (server logs) and the browser console (client logs).
      </div>
    </div>
  );
}

