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
import { useTranslation } from "react-i18next";

const ForgotPasswordModal = () => {
  const forgotPasswordModal = useForgotPasswordModal();
  const loginModal = useLoginModal();
  const resetPasswordModal = useResetPasswordModal();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const { t } = useTranslation("common");

  const emailSchema = z.object({
    email: z.string().email(t("invalid_email")),
  });

  const codeSchema = z.object({
    code: z.string().length(6, t("code_must_be_6")),
  });

  type EmailFormData = z.infer<typeof emailSchema>;
  type CodeFormData = z.infer<typeof codeSchema>;

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
    reset: resetEmailForm,
  } = useForm<EmailFormData>({
    resolver: zodResolver(emailSchema),
  });

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
      toast.success(t("we_sent_verification"));
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("check_your_email")
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

      toast.success(t("code_verified"));
      forgotPasswordModal.onClose();
      resetPasswordModal.onOpen(email);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("invalid_verification_code")
      );
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

      toast.success(t("new_verification_code_sent"));
      resetCodeForm({ code: "" });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : t("failed_resend_code")
      );
    } finally {
      setIsLoading(false);
    }
  };

  const actionLabel = useMemo(() => {
    if (isLoading) {
      return step === "code" ? t("loading") : t("sending_code");
    }
    if (step === "email") {
      return t("send_code");
    }
    if (step === "code") {
      return t("verify");
    }
  }, [step, isLoading, t]);

  const emailBodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={t("forgot_your_password")}
        subtitle={t("enter_email_to_receive_code")}
      />
      <Input
        id="email"
        label={t("email")}
        disabled={isLoading}
        register={registerEmail}
        errors={emailErrors}
        required
      />
    </div>
  );

  const codeBodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={t("enter_verification_code")}
        subtitle={t("sent_code_to", { email })}
      />
      <Input
        id="code"
        label={t("verification_code")}
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
            {t("did_not_get_code")}{" "}
            <span
              onClick={handleResendCode}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("resend_code")}
            </span>
          </p>
        ) : (
          <p>
            {t("remember_password")}{" "}
            <span
              onClick={handleBackToLogin}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("sign_in")}
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
      title={step === "email" ? t("reset_password") : t("verify_code")}
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
      secondaryActionLabel={step === "code" ? t("change_email") : undefined}
    />
  );
};

export default ForgotPasswordModal;
