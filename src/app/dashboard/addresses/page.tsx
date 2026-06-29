"use client";

import { MapPin } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { formatAddressForDisplay } from "@/lib/booking/address";

type SavedAddress = {
  fullAddress?: string;
  line1?: string;
  city?: string;
  pincode?: string;
};

export default function AddressesPage() {
  const { customer } = useAuth();

  const savedList: SavedAddress[] = Array.isArray(customer?.addresses)
    ? (customer.addresses as SavedAddress[])
    : [];

  const primary =
    customer?.lastUsedAddress && typeof customer.lastUsedAddress === "object"
      ? (customer.lastUsedAddress as SavedAddress)
      : null;

  const defaultAddress = customer?.address
    ? String(customer.address)
    : primary
      ? formatAddressForDisplay(primary)
      : "";

  const allAddresses = [
    ...(defaultAddress
      ? [{ fullAddress: defaultAddress, label: "Default address" }]
      : []),
    ...savedList.map((a, i) => ({
      fullAddress: formatAddressForDisplay(a),
      label: `Saved address ${i + 1}`,
    })),
  ].filter((a) => a.fullAddress && a.fullAddress !== "—");

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-bold tracking-tight text-[#0a0f1c]">
        Saved Addresses
      </h1>
      <p className="mt-2 text-sm text-[#64748b]">
        Addresses from your Repair Series account.
      </p>

      {allAddresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center rounded-[24px] border border-dashed border-gray-200 bg-gray-50 py-16 text-center">
          <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-orange-50">
            <MapPin className="size-6 text-[#f96316]" />
          </div>
          <p className="font-medium text-[#0a0f1c]">No saved addresses yet</p>
          <p className="mt-1 max-w-sm text-sm text-[#64748b]">
            Your addresses will appear here after you complete a booking.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {allAddresses.map((item, idx) => (
            <div
              key={idx}
              className="rounded-[20px] border border-black/5 bg-white p-5 shadow-sm transition-all hover:shadow-md"
            >
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-[#f96316]">
                {item.label}
              </div>
              <p className="text-sm leading-relaxed text-[#0a0f1c]">
                {item.fullAddress}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
