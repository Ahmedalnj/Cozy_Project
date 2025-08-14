"use client";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Modal from "./modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import useForgotPasswordModal from "@/app/hooks/useForgotPasswordModal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useResetPasswordModal from "@/app/hooks/useResetPasswordModal";

// 1. تعريف Schemas باستخدام Zod
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const codeSchema = z.object({
  code: z.string().length(6, "Code must be 6 digits"),
});

// 2. استخراج الأنواع
type EmailFormData = z.infer<typeof emailSchema>;
type CodeFormData = z.infer<typeof codeSchema>;

const ForgotPasswordModal = () => {
  const forgotPasswordModal = useForgotPasswordModal();
  const loginModal = useLoginModal();
  const resetPasswordModal = useResetPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");

  // نموذج البريد الإلكتروني
  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

  // نموذج كود التحقق
  const {
    register: registerCode,
    handleSubmit: handleCodeSubmit,
    formState: { errors: codeErrors },
    reset: resetCodeForm,
  } = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  const onSubmitEmail = async (data: EmailFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resetpassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error(await res.text());

      setEmail(data.email);
      resetEmailForm();
      resetCodeForm({ code: "" });
      setStep("code");
      toast.success("Verification code sent to your email");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitCode = async (data: CodeFormData) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resetpassword/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: data.code }),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Code verified successfully");
      forgotPasswordModal.onClose();
      resetPasswordModal.onOpen(email); // تخزين البريد

      // يمكنك توجيه المستخدم لصفحة إعادة تعيين كلمة المرور هنا
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    forgotPasswordModal.onClose();
    loginModal.onOpen();
  };

  const handleResendCode = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/resetpassword/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("New verification code sent");
      resetCodeForm({ code: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend code"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (isLoading) {
      return step === "code" ? "Loading..." : "Sending Code...";
    }
    if (step === "email") {
      return "Send Code";
    }
    if (step === "code") {
      return "Verify";
    }
  }, [step, isLoading]);

  // محتوى مرحلة إدخال البريد الإلكتروني
  const emailBodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Forgot your password?"
        subtitle="Enter your email to receive a verification code"
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={registerEmail}
        errors={emailErrors}
        required
      />
    </div>
  );

  // محتوى مرحلة إدخال كود التحقق
  const codeBodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Enter Verification Code"
        subtitle={`We sent a 6-digit code to ${email}`}
      />
      <Input
        id="code"
        label="Verification Code"
        disabled={isLoading}
        register={registerCode}
        errors={codeErrors}
        required
        defaultValue=""
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="text-neutral-500 text-center mt-4 font-light">
        {step === "code" ? (
          <p>
            You don not get code?{" "}
            <span
              onClick={handleResendCode}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Resend Code
            </span>
          </p>
        ) : (
          <p>
            Remember your password?{" "}
            <span
              onClick={handleBackToLogin}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Sign in
            </span>
          </p>
        )}
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={forgotPasswordModal.isOpen}
      title={step === "email" ? "Reset Password" : "Verify Code"}
      actionLabel={actionLabel || ""}
      onClose={forgotPasswordModal.onClose}
      onSubmit={
        step === "email"
          ? handleEmailSubmit(onSubmitEmail)
          : handleCodeSubmit(onSubmitCode)
      }
      body={step === "email" ? emailBodyContent : codeBodyContent}
      footer={footerContent}
      secondaryAction={step === "code" ? () => setStep("email") : undefined}
      secondaryActionLabel={step === "code" ? "Change Email" : undefined}
    />
  );
};

export default ForgotPasswordModal;
