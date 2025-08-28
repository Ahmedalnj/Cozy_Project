"use client";

import { useRouter } from "next/navigation";
import Container from "../components/Container";
import Heading from "../components/Heading";
import { SafeUser, SaveReservation } from "../types";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/ListingCard";
import { useTranslation } from "react-i18next";
import RejectionModal from "../components/modals/RejectionModal";

interface ReservationsClientProps {
  reservations: SaveReservation[];
  currentUser?: SafeUser | null;
}
const ReservationsClient: React.FC<ReservationsClientProps> = ({
  reservations,
  currentUser,
}) => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState("");
  const { t } = useTranslation("common");

  const [acceptingCashId, setAcceptingCashId] = useState("");
  const [rejectingId, setRejectingId] = useState("");
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState("");

  const onCancel = useCallback(
    (id: string) => {
      setDeletingId(id);

      axios
        .post("/api/reservations/cancel-guest", { reservationId: id })
        .then(() => {
          toast.success(t("guest_reservation_cancelled"));
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

  const onAcceptCash = useCallback(
    (id: string) => {
      setAcceptingCashId(id);

      axios
        .post("/api/reservations/accept-cash", { reservationId: id })
        .then(() => {
          toast.success(t("cash_payment_accepted"));
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setAcceptingCashId("");
        });
    },
    [router]
  );

  const onRejectReservation = useCallback(
    (id: string) => {
      setSelectedReservationId(id);
      setIsRejectionModalOpen(true);
    },
    []
  );

  const handleRejectionConfirm = useCallback(
    (rejectionReason: string) => {
      setRejectingId(selectedReservationId);

      axios
        .post("/api/reservations/reject-cash", { 
          reservationId: selectedReservationId,
          rejectionReason: rejectionReason 
        })
        .then(() => {
          toast.success(t("reservation_rejected_and_deleted"));
          setIsRejectionModalOpen(false);
          setSelectedReservationId("");
          router.refresh();
        })
        .catch((error) => {
          toast.error(error?.response?.data?.error);
        })
        .finally(() => {
          setRejectingId("");
        });
    },
    [router, t, selectedReservationId]
  );

  return (
    <Container>
      <Heading title="Reservations" subtitle="Booking on your properties" />

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
          
          // For cash payments that are not yet paid, show accept cash button
          if (isCashPayment && !isPaid) {
            return (
              <ListingCard
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onAcceptCash}
                disabled={acceptingCashId === reservation.id}
                actionLabel={acceptingCashId === reservation.id ? t("accepting_cash") : t("accept_cash_on_arrival")}
                currentUser={currentUser}
                secondaryAction={onRejectReservation}
                secondaryActionId={reservation.id}
                secondaryActionLabel={rejectingId === reservation.id ? t("rejecting_reservation") : t("reject_reservation")}
                showGuestDetails={true}
                isHostView={true}
              />
            );
          }
          
          // For paid reservations, show paid status
          if (isPaid) {
            return (
              <ListingCard
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onCancel}
                disabled={deletingId === reservation.id}
                actionLabel={t("cancel_guest_reservation")}
                currentUser={currentUser}
                showPaidStatus={true}
                showGuestDetails={true}
                isHostView={true}
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
              actionLabel={t("cancel_guest_reservation")}
              currentUser={currentUser}
              isHostView={true}
            />
          );
        })}
      </div>

      {/* Rejection Modal */}
      <RejectionModal
        isOpen={isRejectionModalOpen}
        onClose={() => {
          setIsRejectionModalOpen(false);
          setSelectedReservationId("");
        }}
        onConfirm={handleRejectionConfirm}
        isLoading={rejectingId === selectedReservationId}
      />
    </Container>
  );
};

export default ReservationsClient;
