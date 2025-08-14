"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "./modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import useResetPasswordModal from "@/app/hooks/useResetPasswordModal";
import { useRouter } from "next/navigation";

const schema = z
  .object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

const ResetPasswordModal = () => {
  const router = useRouter();
  const resetPasswordModal = useResetPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const { email: storedEmail } = useResetPasswordModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: storedEmail || "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/resetpassword/updatepassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: storedEmail,
          newPassword: data.password,
        }),
      });

      if (!response.ok) throw new Error(await response.text());
      console.log("Form submitted", data);
      toast.success("Password updated successfully");
      router.push("/login");
      resetPasswordModal.onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };
  console.log("Form errors", errors);
  useEffect(() => {
    console.log("Stored email:", storedEmail);
  }, [storedEmail]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Set a new password"
        subtitle="Enter new password for your email"
      />
      <div className="text-center text-gray-600 mb-4">
        For: <span className="font-semibold">{storedEmail}</span>
      </div>

      <Input
        id="password"
        label="New Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={resetPasswordModal.isOpen}
      title="Reset Password"
      actionLabel="Update Password"
      onClose={resetPasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default ResetPasswordModal;
