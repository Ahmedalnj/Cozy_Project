"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/app/libs/supabaseClient";

const RealtimeStatus = () => {
  const [status, setStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("connecting");
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    // Test connection
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from("User")
          .select("count")
          .limit(1);

        if (error) {
          console.error("Supabase connection error:", error);
          setStatus("disconnected");
        } else {
          setStatus("connected");
          setLastUpdate(new Date());
        }
      } catch (err) {
        console.error("Connection test failed:", err);
        setStatus("disconnected");
      }
    };

    testConnection();

    // Test real-time subscription
    const testSubscription = supabase
      .channel("test_connection")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "User" },
        () => {
          setLastUpdate(new Date());
        }
      )
      .subscribe((status) => {
        console.log("Subscription status:", status);
      });

    return () => {
      supabase.removeChannel(testSubscription);
    };
  }, []);

  const getStatusColor = () => {
    switch (status) {
      case "connected":
        return "bg-green-500";
      case "connecting":
        return "bg-yellow-500";
      case "disconnected":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "connected":
        return "Connected";
      case "connecting":
        return "Connecting...";
      case "disconnected":
        return "Disconnected";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-3 rounded-lg shadow-lg border">
      <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
        <span className="text-sm font-medium">Supabase: {getStatusText()}</span>
      </div>
      {lastUpdate && (
        <div className="text-xs text-gray-500 mt-1">
          Last update: {lastUpdate.toLocaleTimeString()}
        </div>
      )}
    </div>
  );
};

export default RealtimeStatus;
