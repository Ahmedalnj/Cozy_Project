"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeUser, SaveReservation } from "../types";
import { useCallback, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";
import { useTranslation } from "react-i18next";

interface TripsClientProps {
  reservations: SaveReservation[];
  currentUser?: SafeUser | null;
}

const TripsClient: React.FC<TripsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const { t } = useTranslation("common");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .delete(`/api/reservations/${id}`)
        .then(() => {
          toast.success(t("reservation_cancelled"));
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setDeletingId("");
        });
    },
    [router, t]
  );
  return (
    <Container>
      <Heading title={t("trips")} subtitle={t("trips_subtitle")}></Heading>
      <div
        className="
      mt-10
      grid
      grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-6
      gap-8"
      >
        {reservations.map((reservation) => {
          // Determine payment type and status
          const isCashPayment = reservation.payment?.paymentMethod === "cash";
          const isPaid = reservation.payment?.status === "SUCCESS";
          
          // For cash payments, show pending status until host accepts
          if (isCashPayment && !isPaid) {
            return (
              <ListingCard
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId === reservation.id}
                actionLabel={t("cancel_reservation")}
                currentUser={currentUser}
                showCashPendingStatus={true}
              />
            );
          }
          
          // For paid reservations (any payment method), show paid status
          if (isPaid) {
            return (
              <ListingCard
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId === reservation.id}
                actionLabel={t("cancel_reservation")}
                currentUser={currentUser}
                showPaidStatus={true}
              />
            );
          }
          
          // Default case
          return (
            <ListingCard
              key={reservation.id}
              data={reservation.listing}
              reservation={reservation}
              actionId={reservation.id}
              onAction={onCancel}
              disabled={deletingId === reservation.id}
              actionLabel={t("cancel_reservation")}
              currentUser={currentUser}
            />
          );
        })}
      </div>
    </Container>
  );
};

export default TripsClient;
