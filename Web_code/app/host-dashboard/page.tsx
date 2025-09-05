"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Button from "@/app/components/ui/Button";
import useRentModal from "@/app/hooks/useRentModal";
import { useTranslation } from "react-i18next";

interface Statistics {
  propertiesCount: number;
  reservationsCount: number;
  totalRevenue: number;
}

const HostDashboard = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const rentModal = useRentModal();
  const { t } = useTranslation("common");
  const [isLoading, setIsLoading] = useState(true);
  const [statistics, setStatistics] = useState<Statistics>({
    propertiesCount: 0,
    reservationsCount: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    if (!session?.user) {
      router.push("/");
      return;
    }

    const checkHostStatus = async () => {
      try {
        // التحقق من أن المستخدم مضيف معتمد
        const response = await fetch("/api/user/current");
        if (!response.ok) throw new Error("فشل في جلب بيانات المستخدم");
        
        const userData = await response.json();
        if (userData.hostStatus !== "APPROVED") {
          router.push("/");
          return;
        }
      } catch (error) {
        console.error("خطأ في التحقق من حالة المضيف:", error);
        router.push("/");
        return;
      }
    };

    const fetchStatistics = async () => {
      try {
        // جلب الإحصائيات
        const response = await fetch("/api/host/statistics");
        if (!response.ok) throw new Error("فشل في جلب الإحصائيات");
        
        const data = await response.json();
        setStatistics({
          propertiesCount: data.statistics.propertiesCount || 0,
          reservationsCount: data.statistics.reservationsCount || 0,
          totalRevenue: data.statistics.revenue || 0,
        });
      } catch (error) {
        console.error("خطأ في جلب الإحصائيات:", error);
        // في حالة الخطأ، استخدم قيم افتراضية
        setStatistics({
          propertiesCount: 0,
          reservationsCount: 0,
          totalRevenue: 0,
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkHostStatus();
    fetchStatistics();
  }, [session, router]);

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("host_dashboard.title")}
          </h1>
          <p className="text-gray-600">
            {t("host_dashboard.subtitle")}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <span className="text-2xl">🏠</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                {t("host_dashboard.manage_properties_title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("host_dashboard.manage_properties_description")}
            </p>
            <Button
              label={t("manage_properties")}
              onClick={() => router.push("/properties")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <span className="text-2xl">📅</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                {t("host_dashboard.manage_reservations_title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("host_dashboard.manage_reservations_description")}
            </p>
            <Button
              label={t("manage_reservations")}
              onClick={() => router.push("/reservations")}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
            />
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <span className="text-2xl">➕</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mr-3">
                {t("host_dashboard.add_property_title")}
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              {t("host_dashboard.add_property_description")}
            </p>
            <Button
              label={t("add_new_property")}
              onClick={() => rentModal.onOpen()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white"
            />
          </div>
        </div>

        {/* Statistics */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("host_dashboard.statistics_title")}</h2>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center animate-pulse">
                  <div className="h-10 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.propertiesCount || 0}</div>
                <div className="text-sm text-gray-600">{t("host_dashboard.properties_count")}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{statistics.reservationsCount || 0}</div>
                <div className="text-sm text-gray-600">{t("host_dashboard.total_reservations")}</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {(statistics.totalRevenue || 0).toLocaleString()} {t("LYD")}
                </div>
                <div className="text-sm text-gray-600">{t("host_dashboard.total_revenue")}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostDashboard;

