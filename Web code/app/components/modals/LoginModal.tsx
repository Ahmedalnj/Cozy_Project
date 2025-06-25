"use client";
import { signIn } from "next-auth/react";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Modal from "./modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import { useRouter } from "next/navigation";

const LoginModal = () => {
  const router = useRouter();
  const registerModal = useRegisterModal();
  const loginModal = useLoginModal();

  const [isLoading, setIsLoading] = useState(false);

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

  // دالة إرسال البيانات
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    signIn("credentials", {
      ...data,
      redirect: false,
    }).then((callback) => {
      setIsLoading(false);
      if (callback?.error) {
        toast.error(callback.error);
      }
      if (callback?.ok && !callback?.error) {
        toast.success("Logged in successfully");

        router.refresh();

        loginModal.onClose();
        // إعادة التوجيه إلى الصفحة الرئيسية بعد تسجيل الدخول
      }
      if (callback?.error) {
        toast.error("Invalid credentials");
      }
    });
  };
  // محتوى جسم المودال
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome Back" subtitle="Login to your account" />

      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  // محتوى التذييل (footer) للمودال
  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />
      <div className="flex flex-col gap-4">
        <Button
          outline
          label="Continue with Google"
          icon={FcGoogle}
          onClick={() => signIn("google")}
        />
        <Button
          outline
          label="Continue with Facebook"
          icon={AiFillFacebook}
          onClick={() => signIn("facebook")}
        />
        <div className="text-neutral-500 text-center mt-4 font-light">
          <div>
            Do not have an account?
            <span
              onClick={() => {
                registerModal.onOpen();
                loginModal.onClose();
              }}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Sign Up
            </span>
          </div>
          <div>
            By continuing, you agree to Cozy
            <span
              onClick={registerModal.onOpen}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Terms of Service
            </span>
            and
            <span
              onClick={() => {}}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  // إرجاع المودال مع محتوياته
  return (
    <Modal
      disabled={isLoading}
      isOpen={loginModal.isOpen}
      title="Login"
      actionLabel="Submit"
      onClose={loginModal.onClose}
      onSubmit={handleSubmit(onSubmit)} // استخدم onSubmit بدلاً من onsubmit
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default LoginModal;
