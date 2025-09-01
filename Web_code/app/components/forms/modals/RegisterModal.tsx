"use client";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "@/app/components/modals/base/modal";
import Heading from "@/app/components/ui/Heading";
import Input from "@/app/components/ui/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/ui/Button";
import { signIn } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";
import { useTranslation } from "react-i18next";
import usePolicy from "@/app/hooks/usePolicy";
import useTermsModal from "@/app/hooks/useTerms";

const RegisterModal = () => {
  const { t } = useTranslation("common");
  const registerModal = useRegisterModal();
  const router = useRouter();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number | null>(null);
  const PolicyModal = usePolicy();
  const TermsModal = useTermsModal();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success(t("registers.success"));
        router.refresh();
        registerModal.onClose();
        loginModal.onOpen();
      })
      .catch((error) => {
        if (
          error.response &&
          error.response.data.error === "Email already exists"
        ) {
          toast.error(t("registers.email_exists"));
        } else {
          toast.error(t("registers.error"));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handlePasswordValidation = (password: string): boolean | string => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score);
    return result.score >= 3 || t("registers.password_weak");
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title={t("registers.welcome")}
        subtitle={t("registers.subtitle")}
      />
      <Input
        id="name"
        label={t("registers.name")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^[A-Za-z\s]+$/,
            message: t("registers.name_invalid"),
          },
        }}
      />
      <Input
        id="email"
        label={t("registers.email")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: t("registers.email_invalid"),
          },
        }}
      />
      <div>
        <Input
          id="password"
          label={t("registers.password")}
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            validate: handlePasswordValidation,
            minLength: {
              value: 8,
              message: t("registers.password_min"),
            },
          }}
        />
        {passwordStrength !== null && (
          <div>
            <p>
              {t("registers.password_strength")}:{" "}
              {["Weak", "Fair", "Good", "Strong"][passwordStrength]}
            </p>
            <progress value={passwordStrength} max={4}></progress>
          </div>
        )}
      </div>
      <Input
        id="confirmPassword"
        label={t("registers.confirm_password")}
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          validate: (value) =>
            value === getValues("password") || t("registers.password_mismatch"),
        }}
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="flex flex-col gap-4">
        <Button
          outline
          label={t("registers.continue_google")}
          icon={FcGoogle}
          onClick={() => signIn("google")}
        />
        <div className="text-neutral-500 text-center mt-4 font-light">
          <div>
            {t("registers.already_have_account")}
            <span
              onClick={() => {
                loginModal.onOpen();
                registerModal.onClose();
              }}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("registers.login")}
            </span>
          </div>
          <div>
            {t("registers.agree_text")}
            <span
              onClick={TermsModal.onOpen}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("registers.terms")}
            </span>
            {t("registers.and")}
            <span
              onClick={PolicyModal.onOpen}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("registers.privacy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerModal.isOpen}
      title={t("registers.title")}
      actionLabel={t("registers.action")}
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
