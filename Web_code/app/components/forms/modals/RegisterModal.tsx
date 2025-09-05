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
    <div className="flex flex-col gap-2">
      <Heading
        title={t("registers.welcome")}
        subtitle={t("registers.subtitle")}
      />
      <div>
        <Input
          id="name"
          label={t("registers.name")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            required: t("validation.name_required"),
            minLength: {
              value: 2,
              message: t("validation.name_min_length"),
            },
            maxLength: {
              value: 50,
              message: t("validation.name_max_length"),
            },
            pattern: {
              value: /^[A-Za-z\u0600-\u06FF\s]+$/,
              message: t("validation.name_pattern"),
            },
          }}
        />
      </div>
      <div>
        <Input
          id="email"
          label={t("registers.email")}
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            required: t("validation.email_required"),
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: t("validation.email_pattern"),
            },
            maxLength: {
              value: 100,
              message: t("validation.email_max_length"),
            },
          }}
        />
      </div>
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
            required: t("validation.password_required"),
            minLength: {
              value: 8,
              message: t("validation.password_min_length"),
            },
            maxLength: {
              value: 128,
              message: t("validation.password_max_length"),
            },
            validate: handlePasswordValidation,
          }}
        />
        {passwordStrength !== null && (
          <div className="mt-1 p-1.5 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-700 mb-1">
              {t("registers.password_strength")}:{" "}
              <span className="font-medium">
                {t(`validation.password_strength_${passwordStrength}`)}
              </span>
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div 
                className={`h-1 rounded-full transition-all duration-300 ${
                  passwordStrength === 0 ? 'bg-red-500' :
                  passwordStrength === 1 ? 'bg-orange-500' :
                  passwordStrength === 2 ? 'bg-yellow-500' :
                  passwordStrength === 3 ? 'bg-blue-500' :
                  'bg-green-500'
                }`}
                style={{ width: `${(passwordStrength + 1) * 20}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
      <div>
        <Input
          id="confirmPassword"
          label={t("registers.confirm_password")}
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            required: t("validation.confirm_password_required"),
            validate: (value) =>
              value === getValues("password") || t("validation.password_mismatch"),
          }}
        />
      </div>
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-2 mt-2">
      <hr />
      <div className="flex flex-col gap-2">
        <Button
          outline
          label={t("registers.continue_google")}
          icon={FcGoogle}
          onClick={() => signIn("google")}
        />
        <div className="text-neutral-500 text-center mt-2 font-light text-xs">
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
      noOverflow={true}
    />
  );
};

export default RegisterModal;
