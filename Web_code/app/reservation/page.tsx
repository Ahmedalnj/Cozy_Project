"use client";

/**
 * صفحة الحجز مع دعم الدفع عبر Stripe
 * تتكامل مع API Stripe لإنشاء جلسات دفع آمنة
 * تدعم الدفع عبر بطاقات Visa و Mastercard
 */

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Container from "@/app/components/Container";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";
import Image from "next/image";
import {
  FaCreditCard,
  FaCalendarCheck,
  FaHome,
  FaExclamationTriangle,
  FaShieldAlt,
  FaClock,
  FaMapMarkerAlt,
  FaStar,
  FaWifi,
  FaParking,
  FaSnowflake,
  FaUtensils,
  FaMoneyBillWave,
} from "react-icons/fa";
import usePolicy from "../hooks/usePolicy";
import useTermsModal from "../hooks/useTerms";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

interface ReservationData {
  reservationId?: string;
  totalPrice: number;
  startDate: string;
  endDate: string;
  days: number;
  listingId: string;
  listingTitle: string;
  pricePerNight: number;
  location: string;
  imageSrc: string | string[];
  currentUser?: {
    id: string;
    email: string;
    name: string;
  };
}

// قائمة بالحقول المطلوبة والتحقق من صحتها
const requiredFields = [
  {
    key: "totalPrice",
    type: "number",
    min: 1,
    message: "السعر الإجمالي مطلوب",
  },
  { key: "startDate", type: "string", message: "تاريخ البدء مطلوب" },
  { key: "endDate", type: "string", message: "تاريخ الانتهاء مطلوب" },
  { key: "days", type: "number", min: 1, message: "عدد الأيام مطلوب" },
  { key: "listingId", type: "string", message: "معرف العقار مطلوب" },
  { key: "listingTitle", type: "string", message: "عنوان العقار مطلوب" },
  {
    key: "pricePerNight",
    type: "number",
    min: 1,
    message: "السعر الليلي مطلوب",
  },
  { key: "location", type: "string", message: "الموقع مطلوب" },
  { key: "imageSrc", type: "string", message: "صورة العقار مطلوبة" },
];

const userRequiredFields = [
  { key: "id", type: "string", message: "معرف المستخدم مطلوب" },
  { key: "email", type: "string", message: "بريد المستخدم مطلوب" },
  { key: "name", type: "string", message: "اسم المستخدم مطلوب" },
];

const ReservationPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [reservationData, setReservationData] =
    useState<ReservationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidData, setIsValidData] = useState(true);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash">("card");
  const PolicyModal = usePolicy();
  const TermsModal = useTermsModal();
  const { t } = useTranslation("common");

  // دالة للتحقق من صحة البيانات
  const validateReservationData = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any
  ): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    // التحقق من وجود البيانات الأساسية
    if (!data) {
      return { isValid: false, errors: ["بيانات الحجز غير موجودة"] };
    }

    // التحقق من الحقول المطلوبة
    requiredFields.forEach((field) => {
      const value = data[field.key];

      if (value === undefined || value === null || value === "") {
        errors.push(field.message);
        return;
      }

      if (field.type === "number") {
        const numValue = Number(value);
        if (
          isNaN(numValue) ||
          (field.min !== undefined && numValue < field.min)
        ) {
          errors.push(field.message);
        }
      }

      if (
        field.type === "string" &&
        typeof value === "string" &&
        value.trim() === ""
      ) {
        errors.push(field.message);
      }
    });

    // التحقق من بيانات المستخدم
    if (!data.currentUser) {
      errors.push("بيانات المستخدم مطلوبة");
    } else {
      userRequiredFields.forEach((field) => {
        const value = data.currentUser[field.key];
        if (!value || (typeof value === "string" && value.trim() === "")) {
          errors.push(field.message);
        }
      });
    }

    // التحقق من صحة التواريخ
    if (data.startDate && data.endDate) {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        errors.push("تواريخ غير صالحة");
      } else if (startDate >= endDate) {
        errors.push("تاريخ البدء يجب أن يكون قبل تاريخ الانتهاء");
      }
    }

    return { isValid: errors.length === 0, errors };
  };

  useEffect(() => {
    const dataParam = searchParams?.get("data");
    if (dataParam) {
      try {
        const decodedData = JSON.parse(decodeURIComponent(dataParam));
        const validation = validateReservationData(decodedData);

        if (validation.isValid) {
          setReservationData(decodedData);
          setIsValidData(true);
          setValidationErrors([]);
        } else {
          setIsValidData(false);
          setValidationErrors(validation.errors);
          toast.error(t("invalid_booking_data"));
        }
      } catch {
        toast.error(t("invalid_booking_data"));
        router.push("/");
      }
    } else {
      router.push("/");
    }
  }, [searchParams, router, t]);

  const handleConfirmReservation = async () => {
    if (!reservationData) return;

    const validation = validateReservationData(reservationData);
    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      toast.error(t("please_check_booking"));
      return;
    }

    setIsLoading(true);
    try {
      const user = reservationData.currentUser;
      if (!user) return toast.error(t("user_data_missing"));

      // ✅ التحقق الإضافي من صحة البيانات قبل الإرسال
      if (reservationData.totalPrice <= 0) {
        toast.error(t("invalid_total_price"));
        return;
      }

      const startDate = new Date(reservationData.startDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // تصفير الساعة والدقائق والثواني
      startDate.setHours(0, 0, 0, 0); // تصفير الساعة للدقة في المقارنة

      if (startDate < today) {
        toast.error(t("cannot_book_past_dates"));
        return;
      }

      if (paymentMethod === "card") {
        // ✅ إنشاء جلسة Stripe وربطها بالحجز
        toast.success(t("creating_payment"));

        // Log the data being sent for debugging
        const paymentData = {
          reservationId: reservationData.reservationId,
          amount: reservationData.totalPrice,
          currency: "usd",
          listingId: reservationData.listingId,
          userId: user.id,
          startDate: reservationData.startDate,
          endDate: reservationData.endDate,
          description: `حجز ${reservationData.listingTitle}`,
          customerEmail: user.email,
        };

        console.log("Sending payment data:", paymentData);

        const paymentResponse = await axios.post(
          "/api/stripe/create-session",
          paymentData
        );

        if (paymentResponse.data.success && paymentResponse.data.checkoutUrl) {
          toast.success(t("payment_created_success"));
          // تأخير قصير لإظهار رسالة النجاح
          setTimeout(() => {
            window.location.href = paymentResponse.data.checkoutUrl;
          }, 1000);
        } else {
          toast.error(t("payment_creation_failed"));
        }
      } else {
        // ✅ معالجة الدفع عند الوصول (كاش)
        toast.success(t("creating_cash_reservation"));

        const cashReservationData = {
          reservationId: reservationData.reservationId,
          listingId: reservationData.listingId,
          userId: user.id,
          startDate: reservationData.startDate,
          endDate: reservationData.endDate,
          totalPrice: reservationData.totalPrice,
          paymentMethod: "cash",
          status: "pending",
          description: `حجز ${reservationData.listingTitle} - دفع عند الوصول`,
        };

        console.log("Creating cash reservation:", cashReservationData);

        const cashResponse = await axios.post(
          "/api/reservations/cash",
          cashReservationData
        );

        if (cashResponse.data.success) {
          toast.success(t("cash_reservation_created"));
          // تأخير قصير لإظهار رسالة النجاح
          setTimeout(() => {
            router.push(`/payment/success?reservation_id=${cashResponse.data.reservationId}&payment_type=cash`);
          }, 1000);
        } else {
          toast.error(t("cash_reservation_failed"));
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Payment error:", error);

      // ✅ تحسين معالجة الأخطاء
      let errorMessage =
        paymentMethod === "card"
          ? t("payment_error")
          : t("cash_reservation_error");

      if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error?.response?.status === 400) {
        errorMessage =
          paymentMethod === "card"
            ? t("invalid_payment_data")
            : t("invalid_cash_data");
      } else if (error?.response?.status === 500) {
        errorMessage = t("server_error");
      } else if (error?.code === "NETWORK_ERROR") {
        errorMessage = t("network_error");
      } else if (error?.code === "ECONNABORTED") {
        errorMessage = t("connection_timeout");
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const getMainImage = () => {
    if (!reservationData?.imageSrc) return "";
    if (Array.isArray(reservationData.imageSrc))
      return reservationData.imageSrc[0];
    return reservationData.imageSrc;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // الشهور تبدأ من 0
    const year = date.getFullYear();

    const currentLang = i18n.language;

    // اسم اليوم بالأسبوع
    const weekday =
      currentLang === "ar"
        ? date.toLocaleDateString("ar-LY", { weekday: "long" }) // الخميس
        : date.toLocaleDateString("en-US", { weekday: "long" }); // Thursday

    return `${weekday} ${day}/${month}/${year}`;
  };

  // إذا كانت البيانات غير صالحة، عرض رسالة الخطأ
  if (!isValidData) {
    return (
      <Container>
        <div className="max-w-2xl mx-auto py-12 px-4">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-800 mb-4">
              {t("booking_data_incomplete")}
            </h2>
            <p className="text-red-600 mb-4">{t("booking_data_error")}</p>
            <div className="bg-red-100 p-4 rounded-lg text-left mb-4">
              <h3 className="font-semibold text-red-800 mb-2">{t("errors")}</h3>
              <ul className="list-disc list-inside space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="text-red-600">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => router.push("/")}
              className="bg-rose-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-rose-600 transition-colors"
            >
              {t("back_to_home")}
            </button>
          </div>
        </div>
      </Container>
    );
  }

  if (!reservationData)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Container>
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{t("loading_booking_data")}</p>
          </div>
        </Container>
      </div>
    );

  return (
    <Container>
      <div className="max-w-7xl mx-auto py-8 px-4">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {t("complete_booking")}
          </h1>
          <p className="text-xl text-gray-600">{t("booking_subtitle")}</p>
        </div>

        {/* عرض تحذير إذا كان هناك أخطاء طفيفة */}
        {validationErrors.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 max-w-4xl mx-auto">
            <div className="flex items-center">
              <FaExclamationTriangle className="text-yellow-500 mr-3 text-lg" />
              <span className="text-yellow-800 font-medium">
                {t("minor_data_issues")}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Image */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden h-80 relative">
              <Image
                src={getMainImage()}
                alt={reservationData.listingTitle}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4 bg-rose-500 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                <FaStar className="mr-1" />
                {t("premium_property")}
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-lg text-sm">
                <FaMapMarkerAlt className="inline mr-1" />
                {reservationData.location}
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FaHome className="mr-3 text-rose-500" />
                {t("property_details")}
              </h2>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {reservationData.listingTitle}
                </h3>
                <p className="text-gray-600 flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-rose-500" />
                  {reservationData.location}
                </p>
              </div>

              {/* Amenities */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center text-gray-600">
                  <FaWifi className="mr-2 text-green-500" />
                  <span className="text-sm">{t("wifi")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaParking className="mr-2 text-blue-500" />
                  <span className="text-sm">{t("parking")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaSnowflake className="mr-2 text-cyan-500" />
                  <span className="text-sm">{t("ac")}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <FaUtensils className="mr-2 text-orange-500" />
                  <span className="text-sm">{t("kitchen")}</span>
                </div>
              </div>
            </div>

            {/* Reservation Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FaCalendarCheck className="mr-3 text-rose-500" />
                {t("reservation_details")}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                  <h3 className="flex items-center mb-3 text-blue-800 font-semibold">
                    <FaCalendarCheck className="mr-2 text-blue-500" />
                    {t("arrival_date")}
                  </h3>
                  <p className="text-blue-700 font-medium">
                    {formatDate(reservationData.startDate)}
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                  <h3 className="flex items-center mb-3 text-green-800 font-semibold">
                    <FaCalendarCheck className="mr-2 text-green-500" />
                    {t("departure_date")}
                  </h3>
                  <p className="text-green-700 font-medium">
                    {formatDate(reservationData.endDate)}
                  </p>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                <h3 className="flex items-center mb-3 text-purple-800 font-semibold">
                  <FaClock className="mr-2 text-purple-500" />
                  {t("stay_duration")}
                </h3>
                <p className="text-2xl font-bold text-purple-700">
                  {reservationData.days} {t("nights")}
                  {reservationData.days !== 1
                    ? i18n.language === "ar"
                      ? ""
                      : "s"
                    : ""}
                </p>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <FaCreditCard className="mr-3 text-rose-500" />
                {t("payment_method")}
              </h2>

              <div className="space-y-4">
                {/* Credit Card Option */}
                <div
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === "card"
                      ? "border-green-400 bg-gradient-to-r from-green-50 to-green-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setPaymentMethod("card")}
                >
                  <input
                    type="radio"
                    className="h-5 w-5 text-green-500"
                    checked={paymentMethod === "card"}
                    onChange={() => setPaymentMethod("card")}
                  />
                  <label className="ml-4 text-lg font-medium flex items-center cursor-pointer">
                    <FaCreditCard
                      className={`mr-3 ${
                        paymentMethod === "card"
                          ? "text-green-500"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        paymentMethod === "card"
                          ? "text-green-800"
                          : "text-gray-700"
                      }
                    >
                      {t("visa_mastercard")}
                    </span>
                  </label>
                </div>

                {/* Cash Payment Option */}
                <div
                  className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    paymentMethod === "cash"
                      ? "border-blue-400 bg-gradient-to-r from-blue-50 to-blue-100"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                  onClick={() => setPaymentMethod("cash")}
                >
                  <input
                    type="radio"
                    className="h-5 w-5 text-blue-500"
                    checked={paymentMethod === "cash"}
                    onChange={() => setPaymentMethod("cash")}
                  />
                  <label className="ml-4 text-lg font-medium flex items-center cursor-pointer">
                    <FaMoneyBillWave
                      className={`mr-3 ${
                        paymentMethod === "cash"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }`}
                    />
                    <span
                      className={
                        paymentMethod === "cash"
                          ? "text-blue-800"
                          : "text-gray-700"
                      }
                    >
                      {t("cash_on_arrival")}
                    </span>
                  </label>
                </div>

                {/* Payment Method Info */}
                {paymentMethod === "card" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-700 text-sm">
                      <FaShieldAlt className="inline mr-2" />
                      {t("secure_online_payment")}
                    </p>
                  </div>
                )}

                {paymentMethod === "cash" && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-700 text-sm">
                      <FaClock className="inline mr-2" />
                      {t("pay_when_you_arrive")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
                {t("price_summary")}
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">
                    ${reservationData.pricePerNight} × {reservationData.days}{" "}
                    {t("per_night")}
                  </span>
                  <span className="font-semibold text-gray-800">
                    ${reservationData.pricePerNight * reservationData.days}
                  </span>
                </div>

                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600">{t("service_fees")}</span>
                  <span className="font-semibold text-green-600">$0</span>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span className="text-gray-800">{t("total_amount")}</span>
                    <span className="text-rose-600">
                      ${reservationData.totalPrice}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {t("including_taxes")}
                  </p>
                </div>
              </div>

              <button
                onClick={handleConfirmReservation}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center hover:from-rose-600 hover:to-rose-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    {t("processing")}
                  </>
                ) : (
                  <>
                    {paymentMethod === "card" ? (
                      <FaCreditCard className="mr-2" />
                    ) : (
                      <FaMoneyBillWave className="mr-2" />
                    )}
                    {paymentMethod === "card"
                      ? t("confirm_booking")
                      : t("confirm_cash_booking")}
                  </>
                )}
              </button>

              <div className="mt-6 text-center text-xs text-gray-500">
                <p className="mb-2">
                  {t("agreement_text")}{" "}
                  <a
                    href="#"
                    className="text-rose-500 hover:text-rose-600 font-medium"
                    onClick={TermsModal.onOpen}
                  >
                    {t("terms_and_conditions")}
                  </a>{" "}
                  {t("and")}{" "}
                  <a
                    href="#"
                    className="text-rose-500 hover:text-rose-600 font-medium"
                    onClick={PolicyModal.onOpen}
                  >
                    {t("privacy_policy")}
                  </a>
                </p>
                <div className="flex items-center justify-center text-green-600">
                  <FaShieldAlt className="mr-1" />
                  <span className="text-xs">{t("secure_payment_note")}</span>
                </div>

                {/* Payment Method Specific Notes */}
                {paymentMethod === "cash" && (
                  <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-blue-700 text-xs">
                      <FaMoneyBillWave className="inline mr-1" />
                      {t("cash_payment_note")}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default ReservationPage;
