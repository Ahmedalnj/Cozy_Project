"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PaymentTable from "@/app/admin/components/PaymentTable";

interface Payment {
  id: string;
  reservationId: string | null;
  userId: string;
  listingId: string;
  stripeSession: string;
  transactionId: string | null;
  paymentMethod: string | null;
  status: "PENDING" | "SUCCESS" | "FAILED" | "PAID";
  amount: number;
  currency: string;
  expiresAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
  };
  listing: {
    id: string;
    title: string;
    locationValue: string;
  };
  reservation: {
    id: string;
    startDate: string;
    endDate: string;
    totalPrice: number;
  } | null;
}

const PaymentsPage = () => {
  const router = useRouter();

  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Access control (role)
  useEffect(() => {
    fetch("/api/admin/currentUser")
      .then((res) => {
        if (!res.ok) throw new Error("Not authorized");
        return res.json();
      })

      .catch(() => router.push("/")); // redirect if not admin
  }, [router]);

  // Fetch payments data
  const fetchPayments = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      setError(null);

      const res = await fetch("/api/admin/payments");
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/");
          return;
        }
        throw new Error(`HTTP ${res.status}`);
      }
      const data: Payment[] = await res.json();
      setPayments(data);
    } catch (e) {
      console.error(e);
      setError("Failed to load payments data. Please try again.");
    } finally {
      if (!isRefresh) setLoading(false);
    }
  }, [router]);

  // Initial load
  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPayments(true);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-[#00B4D8] border-solid" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️ {error}</div>
          <button
            onClick={() => fetchPayments()}
            className="px-4 py-2 bg-[#00B4D8] text-white rounded-lg hover:bg-[#0099CC] transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            إدارة المدفوعات
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            عرض وإدارة جميع معاملات الدفع في النظام
          </p>
        </div>

        {/* Payment Table */}
        <PaymentTable payments={payments} onRefresh={onRefresh} limit={5} />

        {/* Toast for refreshing */}
        {refreshing && (
          <div className="fixed bottom-4 right-4 left-4 sm:left-auto bg-[#00B4D8] text-white px-4 py-3 rounded-lg shadow-lg z-50">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              <span className="text-sm">جاري تحديث بيانات المدفوعات...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentsPage;
