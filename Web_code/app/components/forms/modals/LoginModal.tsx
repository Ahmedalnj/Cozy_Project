"use client";
import { signIn } from "next-auth/react";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "@/app/components/modals/base/modal";
import Heading from "@/app/components/ui/Heading";
import Input from "@/app/components/ui/Input";
import toast from "react-hot-toast";
import Button from "@/app/components/ui/Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useRouter } from "next/navigation";
import useTermsModal from "@/app/hooks/useTerms";
import usePolicy from "@/app/hooks/usePolicy";
import useForgotPasswordModal from "@/app/hooks/useForgotPasswordModal";
import { useTranslation } from "react-i18next";

const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();
  const TermsModal = useTermsModal();
  const PolicyModal = usePolicy();
  const forgotPasswordModal = useForgotPasswordModal();

  const [isLoading, setIsLoading] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const { t } = useTranslation("common");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);

      if (callback?.error) {
        // استبدلت الرسالة بنص مترجم ودّي بدل رسالة NextAuth الخام
        toast.error(t("invalid_credentials"));
        setShowResetPassword(true);
      }

      if (callback?.ok) {
        toast.success(t("login_success"));
        router.refresh();
        loginModal.onClose();
      }
    });
  };

  const bodyContent = (
    <div className="flex flex-col gap-3">
      <Heading title={t("welcome_back")} subtitle={t("login_to_account")} />
      <Input
        id="email"
        label={t("email")}
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/,
            message: t("invalid_email"),
          },
        }}
      />
      <Input
        id="password"
        label={t("password")}
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-3 mt-2">
      <hr />
      <div className="flex flex-col gap-3">
        <Button
          outline
          label={t("continue_with_google")}
          icon={FcGoogle}
          onClick={() => signIn("google")}
        />
        <Button
          outline
          label={t("continue_with_facebook")}
          icon={AiFillFacebook}
          onClick={() => signIn("facebook")}
        />

        <div className="text-neutral-500 text-center mt-3 font-light">
          {showResetPassword && (
            <div className="text-black pb-2">
              {t("forgot_password")}{" "}
              <span
                onClick={() => {
                  loginModal.onClose();
                  forgotPasswordModal.onOpen();
                }}
                className="text-red-600 cursor-pointer hover:underline"
              >
                {t("reset_here")}
              </span>
            </div>
          )}

          <div>
            {t("no_account")}{" "}
            <span
              onClick={() => {
                loginModal.onClose();
                registerModal.onOpen();
              }}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("create_account")}
            </span>
          </div>

          <div>
            {t("by_continuing")}{" "}
            <span
              onClick={TermsModal.onOpen}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("terms")}
            </span>{" "}
            {t("and")}{" "}
            <span
              onClick={PolicyModal.onOpen}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              {t("policy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title={t("login")}
      actionLabel={t("continue")}
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
