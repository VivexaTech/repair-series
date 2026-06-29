import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  type Firestore,
} from "firebase/firestore";
import {
  assignNearestTechnicianAndLockBusySlot,
  isSlotStillAvailable,
} from "@/lib/booking/allocation";
import { buildFullAddress, addressFormToBookingAddress } from "@/lib/booking/address";
import { generateBookingCode } from "@/lib/booking/booking-code";
import { resolveBookingSlot, isSlotPast, isPastDateKey } from "@/lib/booking/slots";
import { slotLabelFromIndex } from "@/lib/booking/technician-slots";
import { getServiceCategoryId } from "@/lib/booking/slot-availability";
import type { BookingDraft, ServiceDoc } from "@/lib/booking/types";
import {
  incrementCustomerBookings,
  saveLastUsedAddress,
} from "@/lib/firebase/customer";
import {
  getServiceName,
  getActiveVariations,
  getServicePrice,
  getVisitingCharge,
} from "@/lib/services/helpers";

function scheduledAtFromLocalSlot(dateKey: string, startHour: number): Date {
  const parts = String(dateKey).trim().split("-").map(Number);
  if (parts.length !== 3 || parts.some((n) => !Number.isFinite(n))) {
    return new Date(NaN);
  }
  const [y, m, d] = parts;
  return new Date(y, m - 1, d, startHour, 0, 0, 0);
}

const BOOKING_STATUS = { NEW: "New", ASSIGNED: "Assigned" } as const;

async function resolveCategoryName(
  db: Firestore,
  categoryId: string,
  fallback?: string,
): Promise<string> {
  const trimmed = String(fallback ?? "").trim();
  if (trimmed) return trimmed;
  const cid = String(categoryId ?? "").trim();
  if (!cid) return "Category";
  try {
    const snap = await getDoc(doc(db, "categories", cid));
    if (snap.exists()) {
      const name = String((snap.data() as { name?: string }).name ?? "").trim();
      if (name) return name;
    }
  } catch {
    /* optional */
  }
  return "Category";
}

export async function createCustomerBooking(
  db: Firestore,
  params: {
    customerId: string;
    customerName: string;
    customerPhone: string;
    customerEmail?: string;
    service: ServiceDoc;
    draft: BookingDraft;
    notes?: string;
  },
): Promise<{ bookingId: string; status: string; technicianId: string | null }> {
  const { customerId, customerName, customerPhone, customerEmail, service, draft } =
    params;
  const slot = resolveBookingSlot(draft.slotId, draft.slotIndex);
  if (!slot) throw new Error("Invalid time slot selected.");

  if (isPastDateKey(draft.dateKey)) {
    throw new Error("Cannot book a past date.");
  }
  if (isSlotPast(draft.dateKey, slot)) {
    throw new Error("This time slot has already passed. Please choose a future slot.");
  }

  const bookingAddress = addressFormToBookingAddress(draft.address);
  const userLat = Number(bookingAddress.lat);
  const userLng = Number(bookingAddress.lng);
  if (!Number.isFinite(userLat) || !Number.isFinite(userLng)) {
    throw new Error(
      "Location coordinates are required. Use current location or confirm your address.",
    );
  }

  const stillFree = await isSlotStillAvailable(db, {
    service,
    userLat,
    userLng,
    dateStr: draft.dateKey,
    slotIndex: slot.slotIndex,
  });
  if (!stillFree) {
    throw new Error(
      "This slot is no longer available. Please select another slot.",
    );
  }

  const scheduledAtDate = scheduledAtFromLocalSlot(draft.dateKey, slot.startHour);
  if (Number.isNaN(scheduledAtDate.getTime())) {
    throw new Error("Invalid booking date.");
  }

  const variationId = draft.variationId?.trim() ?? "";
  let selectedVariations: Array<{
    variationId: string;
    title: string;
    price: number;
    quantity: number;
  }> = [];
  let servicePrice = 0;

  const activeVariations = getActiveVariations(service);
  if (service.hasVariations || activeVariations.length > 0) {
    if (!variationId) throw new Error("Select a service option.");
    const match = activeVariations.find((v) => String(v.id) === variationId);
    if (!match) throw new Error("Invalid service option.");
    servicePrice = match.price;
    selectedVariations = [
      {
        variationId: match.id,
        title: match.title,
        price: match.price,
        quantity: 1,
      },
    ];
  } else {
    servicePrice = getServicePrice(service) ?? 0;
  }

  const visitingCharge = getVisitingCharge(service);
  if (!Number.isFinite(servicePrice) || servicePrice < 0) {
    throw new Error("Invalid service price.");
  }

  const customerTotal = servicePrice + visitingCharge;

  const fullAddress = buildFullAddress(draft.address);
  const durationMinutes = 60;
  const categoryId = getServiceCategoryId(service);
  const categoryName = await resolveCategoryName(
    db,
    categoryId,
    (service as { categoryName?: string }).categoryName,
  );
  const slotLabel =
    String(draft.scheduledSlotLabel ?? "").trim() || slotLabelFromIndex(slot.slotIndex);
  const bookingCode = generateBookingCode(8);

  const payload: Record<string, unknown> = {
    customerId,
    customerName: String(customerName).trim(),
    customerPhone: String(customerPhone).trim(),
    phone: String(customerPhone).trim(),
    ...(customerEmail?.trim() ? { customerEmail: customerEmail.trim() } : {}),
    serviceId: service.id,
    serviceName: getServiceName(service),
    categoryId,
    categoryName,
    serviceCategoryId: categoryId,
    serviceVariationId: variationId || "",
    serviceVariationTitle: selectedVariations[0]?.title ?? "",
    address: {
      ...bookingAddress,
      fullAddress,
    },
    scheduledAt: Timestamp.fromDate(scheduledAtDate),
    scheduledSlotDate: draft.dateKey,
    scheduledSlotLabel: slotLabel,
    scheduledSlotIndex: slot.slotIndex,
    scheduleDateKey: draft.dateKey,
    scheduleSlotIndex: slot.slotIndex,
    date: draft.dateKey,
    time: slotLabel,
    slot: slotLabel,
    bookingDate: draft.dateKey,
    durationMinutes,
    amount: servicePrice,
    visitingCharge,
    totalAmount: customerTotal,
    finalBookingAmount: customerTotal,
    notes: params.notes?.trim() ?? "",
    addOnServices: [],
    status: BOOKING_STATUS.NEW,
    bookingCode,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...(selectedVariations.length ? { selectedVariations } : {}),
  };

  const ref = await addDoc(collection(db, "bookings"), payload);
  const bookingId = ref.id;

  try {
    await assignNearestTechnicianAndLockBusySlot(db, {
      bookingId,
      categoryId,
      service,
      userLat,
      userLng,
      dateStr: draft.dateKey,
      slotLabel,
      slotIndex: slot.slotIndex,
    });
  } catch (e) {
    try {
      await deleteDoc(doc(db, "bookings", bookingId));
    } catch {
      /* best effort */
    }
    const err = e as Error & { code?: string };
    if (err.code === "NO_TECH_IN_RADIUS") {
      throw new Error(
        "No service partner is available within range for this address. Try another location or contact support.",
      );
    }
    if (err.code === "ALL_TECHS_BUSY" || err.code === "PAST_SLOT") {
      throw new Error(
        "This slot is no longer available. Please select another slot.",
      );
    }
    throw new Error(
      err.message ||
        "Could not assign a technician for this slot. Please try another time.",
    );
  }

  await incrementCustomerBookings(db, customerId);
  await saveLastUsedAddress(db, customerId, {
    ...bookingAddress,
    fullAddress,
  });

  const assignedSnap = await getDoc(doc(db, "bookings", bookingId));
  const assigned = assignedSnap.data() as Record<string, unknown> | undefined;
  const technicianId = assigned?.technicianId
    ? String(assigned.technicianId)
    : null;
  const status = String(assigned?.status ?? BOOKING_STATUS.ASSIGNED);

  return { bookingId, status, technicianId };
}
