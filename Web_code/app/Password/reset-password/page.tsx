"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!searchParams) {
      setError("Invalid search parameters");
      return;
    }

    const token = searchParams.get("token");
    if (!token) {
      setError("Missing token parameter");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/resetpassword/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      router.push("/login"); // Redirect after success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Reset Password</h1>

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-2 border rounded mb-2"
        placeholder="New password"
      />

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full p-2 rounded ${
          isLoading ? "bg-gray-400" : "bg-blue-500 text-white"
        }`}
      >
        {isLoading ? "Processing..." : "Update Password"}
      </button>
    </div>
  );
}
