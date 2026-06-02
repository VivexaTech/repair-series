import { Container } from "@/components/container";
import { MyBookings } from "@/app/dashboard/bookings/my-bookings";

export const metadata = {
  title: "My Bookings",
  description: "Track your Repair Series bookings in real time.",
};

export default function BookingsDashboardPage() {
  return (
    <Container className="py-12">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">My bookings</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Upcoming • Processing • Completed • Cancelled (real-time updates).
          </p>
        </div>
      </div>
      <MyBookings />
    </Container>
  );
}

