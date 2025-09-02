"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

import Button from "@/app/components/ui/Button";
import { SafeUser } from "@/app/types";
import useRentModal from "@/app/hooks/useRentModal";
import { useTranslation } from "react-i18next";

const HostDashboard: React.FC = () => {
  const { t } = useTranslation("common");
  const { data: session } = useSession();
  const router = useRouter();
  const rentModal = useRentModal();
  const [currentUser, setCurrentUser] = useState<SafeUser | null>(null);
  const [statistics, setStatistics] = useState({
    propertiesCount: 0,
    reservationsCount: 0,
    pendingReservations: 0,
    completedReservations: 0,
    averageRating: 0,
    revenue: 0
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session?.user) {
      getCurrentUserData();
    } else {
      router.push("/");
    }
  }, [session, router]);

  const getCurrentUserData = async () => {
    try {
      const response = await fetch("/api/user/current");
      if (response.ok) {
        const userData = await response.json();
        setCurrentUser(userData);
        
        // التحقق من أن المستخدم مضيف معتمد
        if (userData.hostStatus !== "APPROVED") {
          router.push("/");
        } else {
          // جلب الإحصائيات
          await getHostStatistics();
        }
      } else {
        router.push("/");
      }
    } catch (error) {
      console.error("خطأ في التحقق من حالة المضيف:", error);
      router.push("/");
    }
  };

  const getHostStatistics = async () => {
    try {
      const response = await fetch("/api/host/statistics");
      if (response.ok) {
        const data = await response.json();
        setStatistics(data.statistics);
        setRecentActivities(data.recentActivities);
      }
    } catch (error) {
      console.error("خطأ في جلب الإحصائيات:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser || currentUser.hostStatus !== "APPROVED") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            لوحة تحكم المضيف
          </h1>
          <p className="text-gray-600">
            مرحباً بك في لوحة تحكم المضيف. يمكنك إدارة عقاراتك وحجوزاتك هنا.
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
                إدارة العقارات
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              أضف عقارات جديدة، عدّل العقارات الموجودة، واحذف العقارات.
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
                إدارة الحجوزات
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              راجع الحجوزات الجديدة، وافق أو ارفض الطلبات، وأدر الحجوزات الحالية.
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
                إضافة عقار جديد
              </h3>
            </div>
            <p className="text-gray-600 mb-4">
              أضف عقار جديد إلى منصة Cozy وابدأ في استقبال الحجوزات.
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
          <h2 className="text-2xl font-bold text-gray-900 mb-6">إحصائياتي</h2>
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
                <div className="text-3xl font-bold text-blue-600 mb-2">{statistics.propertiesCount}</div>
                <div className="text-sm text-gray-600">العقارات</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{statistics.reservationsCount}</div>
                <div className="text-sm text-gray-600">إجمالي الحجوزات</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">{statistics.pendingReservations}</div>
                <div className="text-sm text-gray-600">الحجوزات المستقبلية</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{statistics.completedReservations}</div>
                <div className="text-sm text-gray-600">الحجوزات المنتهية</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{statistics.averageRating}</div>
                <div className="text-sm text-gray-600">التقييم</div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">${statistics.revenue}</div>
                <div className="text-sm text-gray-600">الإيرادات</div>
              </div>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              النشاطات الأخيرة
            </h3>
          </div>
          <div className="p-6">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-4 space-x-reverse animate-pulse">
                    <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-20"></div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="space-y-4">
                {recentActivities.map((activity: any) => (
                  <div key={activity.id} className="flex items-center space-x-4 space-x-reverse">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === "CONFIRMED" ? "bg-green-500" :
                      activity.status === "PENDING" ? "bg-yellow-500" :
                      "bg-blue-500"
                    }`}></div>
                    <span className="text-sm text-gray-600 flex-1">
                      {activity.message}
                    </span>
                    <span className="text-xs text-gray-400">
                      {new Date(activity.time).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-8">
                لا توجد نشاطات حديثة
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  );
};

export default HostDashboard;

