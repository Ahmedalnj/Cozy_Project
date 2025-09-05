import EmptyState from "../components/ui/EmptyState";
import ClientOnly from "../components/ui/ClientOnly";
import getCurrentUser from "../actions/getCurrentUser";
import getReservations from "../actions/getReservations";
import ReservationsClient from "./ReservationsClient";
import { SaveReservation } from "../types"; // ✅ Import the type

const ReservationsPage = async () => {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return (
      <ClientOnly>
        <EmptyState title="unauthorized" subtitle="please_login" />
      </ClientOnly>
    );
  }

  // ✅ Explicitly type the reservations
  const reservations: SaveReservation[] = await getReservations({
    authorId: currentUser.id,
  });

  if (reservations.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="no_reservations_found"
          subtitle="no_reservations_subtitle"
        />
      </ClientOnly>
    );
  }

  return (
    <ClientOnly>
      <ReservationsClient
        reservations={reservations}
        currentUser={currentUser}
      />
    </ClientOnly>
  );
};

export default ReservationsPage;
