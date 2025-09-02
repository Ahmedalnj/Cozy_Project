"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

interface HostModeContextType {
  isHostMode: boolean;
  currentMode: "guest" | "host";
  switchToHost: () => void;
  switchToGuest: () => void;
  toggleMode: () => void;
  isLoading: boolean;
}

const HostModeContext = createContext<HostModeContextType | undefined>(undefined);

interface HostModeProviderProps {
  children: ReactNode;
}

export const HostModeProvider: React.FC<HostModeProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [isHostMode, setIsHostMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // التحقق من حالة المستخدم عند تحميل الصفحة
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      checkUserHostStatus();
    } else if (status === "unauthenticated") {
      setIsHostMode(false);
    }
  }, [session, status]);

  const checkUserHostStatus = async () => {
    try {
      const response = await fetch("/api/user/current");
      if (response.ok) {
        const userData = await response.json();
        // إذا كان المستخدم مضيف معتمد، يمكنه التبديل
        if (userData.hostStatus === "APPROVED") {
          // استرجاع الوضع المحفوظ من localStorage أو استخدام الوضع الافتراضي
          const savedMode = localStorage.getItem("hostMode");
          setIsHostMode(savedMode === "host");
        } else {
          setIsHostMode(false);
        }
      }
    } catch (error) {
      console.error("خطأ في التحقق من حالة المستخدم:", error);
    }
  };

  const switchToHost = async () => {
    if (!session?.user) {
      toast.error("يجب تسجيل الدخول أولاً");
      return;
    }

    setIsLoading(true);
    try {
      // التحقق من أن المستخدم مضيف معتمد
      const response = await fetch("/api/user/current");
      if (response.ok) {
        const userData = await response.json();
        if (userData.hostStatus === "APPROVED") {
          setIsHostMode(true);
          localStorage.setItem("hostMode", "host");
          toast.success("تم التبديل إلى وضع المضيف");
        } else {
          toast.error("يجب أن تكون مضيف معتمد للتبديل إلى وضع المضيف");
        }
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء التبديل إلى وضع المضيف");
    } finally {
      setIsLoading(false);
    }
  };

  const switchToGuest = async () => {
    setIsLoading(true);
    try {
      setIsHostMode(false);
      localStorage.setItem("hostMode", "guest");
      toast.success("تم التبديل إلى وضع الضيف");
    } catch (error) {
      toast.error("حدث خطأ أثناء التبديل إلى وضع الضيف");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = async () => {
    if (isHostMode) {
      await switchToGuest();
    } else {
      await switchToHost();
    }
  };

  const currentMode = isHostMode ? "host" : "guest";

  const value: HostModeContextType = {
    isHostMode,
    currentMode,
    switchToHost,
    switchToGuest,
    toggleMode,
    isLoading,
  };

  return (
    <HostModeContext.Provider value={value}>
      {children}
    </HostModeContext.Provider>
  );
};

export const useHostMode = (): HostModeContextType => {
  const context = useContext(HostModeContext);
  if (context === undefined) {
    throw new Error("useHostMode must be used within a HostModeProvider");
  }
  return context;
};

