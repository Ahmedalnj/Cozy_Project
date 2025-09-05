"use client";

import { useRouter } from "next/navigation";
import Container from "../components/ui/Container";
import Heading from "../components/ui/Heading";
import { SafeUser, SaveReservation } from "../types";
import { useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ListingCard from "../components/listings/cards/ListingCard";
import { useTranslation } from "react-i18next";
import RejectionModal from "../components/modals/RejectionModal";
import ConfirmAcceptModal from "../components/modals/confirmations/ConfirmAcceptModal";

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
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [selectedReservationData, setSelectedReservationData] = useState<
    | {
        guestName: string;
        listingTitle: string;
        totalPrice: number;
        startDate: string;
        endDate: string;
      }
    | undefined
  >(undefined);

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
      // Find the reservation data
      const reservation = reservations.find((r) => r.id === id);
      if (reservation) {
        setSelectedReservationData({
          guestName: reservation.user?.name || "Guest",
          listingTitle: reservation.listing?.title || "Property",
          totalPrice: reservation.totalPrice,
          startDate: new Date(reservation.startDate).toLocaleDateString(),
          endDate: new Date(reservation.endDate).toLocaleDateString(),
        });
        setSelectedReservationId(id);
        setIsAcceptModalOpen(true);
      }
    },
    [reservations]
  );

  const handleAcceptConfirm = useCallback(() => {
    setAcceptingCashId(selectedReservationId);

    axios
      .post("/api/reservations/accept-cash", {
        reservationId: selectedReservationId,
      })
      .then(() => {
        toast.success(t("cash_payment_accepted"));
        setIsAcceptModalOpen(false);
        setSelectedReservationId("");
        setSelectedReservationData(undefined);
        router.refresh();
      })
      .catch((error) => {
        toast.error(error?.response?.data?.error);
      })
      .finally(() => {
        setAcceptingCashId("");
      });
  }, [router, t, selectedReservationId]);

  const onRejectReservation = useCallback((id: string) => {
    setSelectedReservationId(id);
    setIsRejectionModalOpen(true);
  }, []);

  const handleRejectionConfirm = useCallback(
    (rejectionReason: string) => {
      setRejectingId(selectedReservationId);

      axios
        .post("/api/reservations/reject-cash", {
          reservationId: selectedReservationId,
          rejectionReason: rejectionReason,
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
      <Heading title={t("reservations.title")} subtitle={t("reservations.subtitle")} />

      <div
        className="
      mt-10
      grid
      grid-cols-2
      sm:grid-cols-2
      md:grid-cols-3
      lg:grid-cols-4
      xl:grid-cols-5
      2xl:grid-cols-6
      gap-3
      sm:gap-4
      md:gap-6
      lg:gap-8"
      >
        {reservations.map((reservation) => {
          // Determine payment type and status
          const isCashPayment = reservation.payment?.paymentMethod === "cash";
          const isPaid = reservation.payment?.status === "PAID";

          // For cash payments that are not yet paid, show review button
          if (isCashPayment && !isPaid) {
            return (
              <ListingCard
                key={reservation.id}
                data={reservation.listing}
                reservation={reservation}
                actionId={reservation.id}
                onAction={onAcceptCash}
                disabled={acceptingCashId === reservation.id}
                actionLabel={
                  acceptingCashId === reservation.id
                    ? t("reviewing")
                    : t("review")
                }
                currentUser={currentUser}
                secondaryAction={onRejectReservation}
                secondaryActionId={reservation.id}
                secondaryActionLabel={
                  rejectingId === reservation.id
                    ? t("rejecting_reservation")
                    : t("reject_reservation")
                }
                showGuestDetails={true}
                isHostView={true}
                showPendingStatus={true}
                pendingMessage={t("reservation_pending_review")}
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

      {/* Confirm Accept Modal */}
      <ConfirmAcceptModal
        isOpen={isAcceptModalOpen}
        onClose={() => {
          setIsAcceptModalOpen(false);
          setSelectedReservationId("");
          setSelectedReservationData(undefined);
        }}
        onConfirm={handleAcceptConfirm}
        reservationData={selectedReservationData}
        isLoading={acceptingCashId === selectedReservationId}
      />
    </Container>
  );
};

export default ReservationsClient;
