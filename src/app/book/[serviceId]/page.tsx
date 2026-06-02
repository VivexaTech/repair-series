import { Container } from "@/components/container";
import { BookingFlow } from "@/app/book/[serviceId]/booking-flow";

export default async function BookServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return (
    <Container className="py-12">
      <BookingFlow serviceIdOrSlug={serviceId} />
    </Container>
  );
}

