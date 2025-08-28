"use client";

import Container from "@/app/components/Container";
import { FaTimesCircle, FaHome, FaCreditCard } from "react-icons/fa";
import Link from "next/link";

const PaymentCancelPage = () => {
  return (
    <Container>
      <div className="max-w-2xl mx-auto py-16 px-4">
        <div className="text-center">
          <div className="mb-8">
            <FaTimesCircle className="text-red-500 text-8xl mx-auto mb-6" />
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Payment Cancelled
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Your payment was cancelled. No charges were made to your account.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3 flex items-center justify-center">
                <FaCreditCard className="mr-2" />
                What Happened?
              </h3>
              <p className="text-yellow-700 text-sm">
                The payment process was interrupted or cancelled. Your reservation
                is still pending and can be completed at any time.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Need Help?
              </h3>
              <p className="text-blue-700 text-sm mb-4">
                If you experienced any issues during payment or have questions,
                our support team is here to help.
              </p>
              <p className="text-blue-700 text-sm">
                <strong>Contact:</strong> support@cozy.com
              </p>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-rose-500 text-white font-semibold rounded-lg hover:bg-rose-600 transition-colors"
            >
              <FaHome className="mr-2" />
              Back to Home
            </Link>
            
            <p className="text-gray-500 text-sm">
              You can try the payment again from your reservation page.
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
};

export default PaymentCancelPage;


