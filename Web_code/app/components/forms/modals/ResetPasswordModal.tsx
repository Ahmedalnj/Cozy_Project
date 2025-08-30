"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "@/app/components/modals/base/modal";
import Heading from "@/app/components/ui/Heading";
import Input from "@/app/components/ui/Input";
import toast from "react-hot-toast";
import useResetPasswordModal from "@/app/hooks/useResetPasswordModal";
import { useRouter } from "next/navigation";
import useLoginModal from "@/app/hooks/useLoginModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// Improved password validation schema
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const schema = z
  .object({
    email: z.string().email("Invalid email"),
    password: passwordSchema,
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
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { email: storedEmail } = resetPasswordModal;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: storedEmail || "",
      password: "",
      confirmPassword: "",
    },
  });

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

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

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      toast.success("Password updated successfully");
      reset();
      handleClose();
      router.push("/");
      setTimeout(() => {
        loginModal.onOpen();
        toast.success("You can now login with your new password");
      }, 500);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    } finally {
      setIsLoading(false);
    }
  };
  const handleClose = useCallback(() => {
    if (isLoading) {
      toast("Please wait until the process completes");
      return;
    }
    resetPasswordModal.onClose();
  }, [isLoading, resetPasswordModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Set a new password"
        subtitle="Enter new password for your email"
      />
      <div className="text-left text-gray-600 mb-4">
        Email: <span className="font-bold">{storedEmail}</span>
      </div>

      <div className="relative">
        <Input
          id="password"
          label="New Password"
          type={showPassword ? "text" : "password"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-6 text-gray-500 hover:text-gray-700"
          onClick={togglePasswordVisibility}
          disabled={isLoading}
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      <div className="relative">
        <Input
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
        />
        <button
          type="button"
          className="absolute right-3 top-6 text-gray-500 hover:text-gray-700"
          onClick={toggleConfirmPasswordVisibility}
          disabled={isLoading}
        >
          {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={resetPasswordModal.isOpen}
      title="Reset Password"
      actionLabel="Update Password" // نص عادي فقط
      isLoading={isLoading} // تمرير حالة التحميل
      onClose={resetPasswordModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
    />
  );
};

export default ResetPasswordModal;
