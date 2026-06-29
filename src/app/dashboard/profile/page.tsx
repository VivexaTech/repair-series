"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const { user, customer } = useAuth();

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-[#0a0f1c]">My Profile</h1>
      <p className="mt-2 text-sm text-[#64748b]">
        Your account details — shared with the Repair Series mobile app.
      </p>

      <div className="mt-8 rounded-[24px] border border-black/5 bg-white/90 p-6 shadow-sm backdrop-blur-sm sm:p-8">
        <dl className="grid gap-5 sm:grid-cols-2">
          <ProfileField label="Full name" value={customer?.name || user?.displayName || "—"} />
          <ProfileField label="Email" value={customer?.email || user?.email || "—"} />
          <ProfileField label="Mobile" value={customer?.phone || "—"} />
          <ProfileField
            label="Total bookings"
            value={String(customer?.totalBookings ?? 0)}
          />
          <ProfileField
            label="Account status"
            value={customer?.blocked ? "Blocked" : "Active"}
          />
        </dl>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/delete-account"
            className="inline-flex items-center text-sm font-semibold text-red-600 hover:underline"
          >
            Delete my account
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProfileField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-bold uppercase tracking-wide text-[#64748b]">
        {label}
      </dt>
      <dd className="mt-1 text-base font-medium text-[#0a0f1c]">{value}</dd>
    </div>
  );
}
