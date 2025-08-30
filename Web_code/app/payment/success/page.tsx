"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Link from "next/link";
import Container from "@/app/components/ui/Container";
import Loader from "@/app/components/ui/Loader";
import {
  FaCheckCircle,
  FaReceipt,
  FaHome,
  FaDownload,
  FaUser,
  FaCalendarAlt,
  FaIdCard,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import jsPDF from "jspdf";
import { PuffLoader } from "react-spinners";

interface ReservationData {
  id: string;
  user: {
    name: string;
    email: string;
  };
  listing: {
    title: string;
    locationValue: string;
    price: number;
  };
  startDate: string;
  endDate: string;
  totalPrice: number;
  createdAt: string;
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    transactionId: string;
    paymentMethod: string;
  }>;
}

const ReservationSuccess = () => {
  const { t } = useTranslation("common");
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reservationData, setReservationData] =
    useState<ReservationData | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(true);
  const pdfRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sessionId = searchParams?.get("session_id");
    const reservationId = searchParams?.get("reservation_id");
    const paymentType = searchParams?.get("payment_type");

    // Handle cash payment
    if (paymentType === "cash" && reservationId) {
      setFetchingDetails(true);
      fetchReservationDetails(reservationId);
      setLoading(false);
      return;
    }

    // Handle Stripe payment
    if (!sessionId) {
      toast.error(t("payment_verification_failed"));
      router.push("/");
      return;
    }

    const processingKey = `processing_${sessionId}`;
    const confirmedKey = `confirmed_${sessionId}`;

    if (sessionStorage.getItem(processingKey) === "true") {
      setSessionId(sessionId);
      setLoading(false);
      return;
    }

    if (sessionStorage.getItem(confirmedKey) === "true") {
      setSessionId(sessionId);
      setLoading(false);
      return;
    }

    setSessionId(sessionId);

    const confirmReservation = async () => {
      sessionStorage.setItem(processingKey, "true");

      try {
        const res = await axios.post<{
          success: boolean;
          error?: string;
          reservationId?: string;
        }>("/api/reservations/confirm", { sessionId: sessionId });

        if (res.data.success) {
          sessionStorage.setItem(confirmedKey, "true");
          toast.success(t("reservation_completed_successfully"));

          // Fetch reservation details if reservationId is provided
          if (res.data.reservationId) {
            await fetchReservationDetails(res.data.reservationId);
          }
        } else {
          const errorMessage = res.data.error || t("reservation_failed");
          toast.error(errorMessage);
          setError(errorMessage);
          console.error("Reservation confirmation failed:", res.data);
        }
      } catch (err: unknown) {
        console.error("Reservation confirm error:", err);
        let errorMessage = t("reservation_creation_error");

        if (axios.isAxiosError(err)) {
          if (err.response?.data?.error) {
            errorMessage = err.response.data.error;
          } else if (err.response?.status === 404) {
            errorMessage = t("payment_session_not_found");
          } else if (err.response?.status === 400) {
            errorMessage = t("invalid_booking_data");
          } else if (err.code === "NETWORK_ERROR") {
            errorMessage = t("network_error");
          }
        } else if (err instanceof Error) {
          errorMessage = err.message;
        }

        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        sessionStorage.removeItem(processingKey);
        setLoading(false);
      }
    };

    confirmReservation();
  }, [searchParams, router, t]);

  const fetchReservationDetails = async (reservationId: string) => {
    setFetchingDetails(true);
    try {
      const res = await axios.get(`/api/reservations/${reservationId}`);
      if (res.data.success) {
        setReservationData(res.data.reservation);
      }
    } catch (err) {
      console.error("Error fetching reservation details:", err);
    } finally {
      setFetchingDetails(false);
    }
  };

  const downloadPDF = async () => {
    if (!pdfRef.current || !reservationData) return;

    setDownloading(true);
    try {
      const pdf = new jsPDF();

      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(220, 38, 127); // rose-500
      const isCashPayment = searchParams?.get("payment_type") === "cash";
      const headerText = isCashPayment
        ? "Cozy - Cash Reservation Invoice"
        : "Cozy - Reservation Invoice";
      pdf.text(headerText, 105, 20, { align: "center" });

      // Add reservation details
      pdf.setFontSize(12);
      pdf.setTextColor(0, 0, 0);

      let yPosition = 40;

      // User details
      pdf.setFontSize(14);
      pdf.text("Customer Information:", 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(`Name: ${reservationData.user.name}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Email: ${reservationData.user.email}`, 20, yPosition);
      yPosition += 15;

      // Reservation details
      pdf.setFontSize(14);
      pdf.text("Reservation Details:", 20, yPosition);
      yPosition += 10;
      pdf.setFontSize(12);
      pdf.text(`Reservation ID: ${reservationData.id}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Property: ${reservationData.listing.title}`, 20, yPosition);
      yPosition += 8;
      pdf.text(
        `Location: ${reservationData.listing.locationValue}`,
        20,
        yPosition
      );
      yPosition += 8;
      pdf.text(
        `Check-in: ${new Date(reservationData.startDate).toLocaleDateString()}`,
        20,
        yPosition
      );
      yPosition += 8;
      pdf.text(
        `Check-out: ${new Date(reservationData.endDate).toLocaleDateString()}`,
        20,
        yPosition
      );
      yPosition += 8;
      pdf.text(`Total Price: $${reservationData.totalPrice}`, 20, yPosition);
      yPosition += 8;
      pdf.text(`Status: Confirmed`, 20, yPosition);
      yPosition += 8;
      pdf.text(
        `Payment Method: ${isCashPayment ? "Cash on Arrival" : "Credit Card"}`,
        20,
        yPosition
      );
      yPosition += 15;

      // Payment details
      if (reservationData.payments.length > 0) {
        const payment = reservationData.payments[0];
        pdf.setFontSize(14);
        pdf.text("Payment Information:", 20, yPosition);
        yPosition += 10;
        pdf.setFontSize(12);
        if (isCashPayment) {
          pdf.text(`Payment Method: Cash on Arrival`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Amount: $${payment.amount}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Status: ${payment.status}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Note: Please pay in cash when you arrive`, 20, yPosition);
        } else {
          pdf.text(`Transaction ID: ${payment.transactionId}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Payment Method: ${payment.paymentMethod}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Amount: $${payment.amount}`, 20, yPosition);
          yPosition += 8;
          pdf.text(`Status: ${payment.status}`, 20, yPosition);
        }
      }

      // Add footer
      pdf.setFontSize(10);
      pdf.setTextColor(100, 100, 100);
      pdf.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 280);

      // Save the PDF
      pdf.save(`reservation-For-${reservationData.user.name}.pdf`);
      toast.success(t("pdf_downloaded_successfully"));
    } catch (err) {
      console.error("Error generating PDF:", err);
      toast.error(t("pdf_generation_failed"));
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="mb-4">
            <Loader />
          </div>
          <p className="text-lg font-medium text-gray-600">
            {t("confirming_booking")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Container>
      <div className="max-w-4xl mx-auto py-16 px-6">
        <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
          {/* رأس الفاتورة */}
          <div className="bg-rose-500 text-white text-center py-6">
            <FaCheckCircle className="mx-auto text-5xl mb-3" />
            <h1 className="text-2xl font-bold">
              {error ? t("payment_warning") : t("payment_success")}
            </h1>
            <p className="text-sm opacity-90">
              {error
                ? t("payment_error_note")
                : searchParams?.get("payment_type") === "cash"
                ? t("cash_payment_success_note")
                : t("payment_success_note")}
            </p>
          </div>

          {/* تفاصيل الفاتورة */}
          <div className="p-8" ref={pdfRef}>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <FaReceipt className="text-rose-500 text-2xl mr-2" />
                <h2 className="text-xl font-semibold">
                  {t("invoice_details")}
                </h2>
              </div>
              {reservationData && (
                <button
                  onClick={downloadPDF}
                  disabled={downloading}
                  className="inline-flex items-center px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
                >
                  <FaDownload className="mr-2" />
                  {downloading ? t("downloading") : t("download_pdf")}
                </button>
              )}
            </div>

            {/* تفاصيل الحجز */}
            {fetchingDetails ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="mb-6">
                    <PuffLoader size={80} color="#f43f5e" />
                  </div>
                  <p className="text-lg font-medium text-gray-600">
                    {t("loading_reservation_details")}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {t("please_wait")}
                  </p>
                </div>
              </div>
            ) : reservationData ? (
              <div className="space-y-6">
                {/* معلومات العميل */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaUser className="text-rose-500 text-lg mr-2" />
                    <h3 className="text-lg font-semibold">
                      {t("customer_information")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("name")}:
                      </span>
                      <span className="ml-2">{reservationData.user.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("email")}:
                      </span>
                      <span className="ml-2">{reservationData.user.email}</span>
                    </div>
                  </div>
                </div>

                {/* تفاصيل الحجز */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaIdCard className="text-rose-500 text-lg mr-2" />
                    <h3 className="text-lg font-semibold">
                      {t("reservation_details")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("reservation_id")}:
                      </span>
                      <span className="ml-2 font-mono text-sm">
                        {reservationData.id}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("property")}:
                      </span>
                      <span className="ml-2">
                        {reservationData.listing.title}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("location")}:
                      </span>
                      <span className="ml-2">
                        {reservationData.listing.locationValue}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("total_price")}:
                      </span>
                      <span className="ml-2 font-semibold text-green-600">
                        ${reservationData.totalPrice}
                      </span>
                    </div>
                  </div>
                </div>

                {/* تواريخ الحجز */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center mb-3">
                    <FaCalendarAlt className="text-rose-500 text-lg mr-2" />
                    <h3 className="text-lg font-semibold">
                      {t("booking_dates")}
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("check_in")}:
                      </span>
                      <span className="ml-2">
                        {new Date(
                          reservationData.startDate
                        ).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">
                        {t("check_out")}:
                      </span>
                      <span className="ml-2">
                        {new Date(reservationData.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* حالة الحجز */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FaCheckCircle className="text-green-500 text-lg mr-2" />
                      <span className="font-medium text-gray-600">
                        {t("status")}:
                      </span>
                    </div>
                    <span className="font-semibold text-green-600">
                      {t("confirmed")}
                    </span>
                  </div>
                </div>

                {/* تفاصيل الدفع */}
                {reservationData.payments.length > 0 && (
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3">
                      {t("payment_information")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="font-medium text-gray-600">
                          {t("transaction_id")}:
                        </span>
                        <span className="ml-2 font-mono text-sm">
                          {reservationData.payments[0].transactionId}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          {t("payment_method")}:
                        </span>
                        <span className="ml-2">
                          {reservationData.payments[0].paymentMethod}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          {t("amount")}:
                        </span>
                        <span className="ml-2 font-semibold">
                          ${reservationData.payments[0].amount}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">
                          {t("payment_status")}:
                        </span>
                        <span className="ml-2 text-green-600">
                          {reservationData.payments[0].status}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : null}

            {/* تنبيه البريد */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
              <p className="text-blue-700 font-medium">
                📧 {t("invoice_sent_to_email")}
              </p>
            </div>

            {/* زر العودة */}
            <div className="mt-10 text-center">
              <Link
                href="/trips"
                className="inline-flex items-center px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors"
              >
                <FaHome className="mr-2" />
                {t("back_to_home")}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationSuccess;
