"use client";
import axios from "axios";
import { AiFillFacebook } from "react-icons/ai";
import { FcGoogle } from "react-icons/fc";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import Modal from "./modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import toast from "react-hot-toast";
import Button from "../Button";
import { signIn } from "next-auth/react";
import useLoginModal from "@/app/hooks/useLoginModal";
import { useRouter } from "next/navigation";
import zxcvbn from "zxcvbn";

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const router = useRouter();
  const LoginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<number | null>(null);

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

  // دالة إرسال البيانات
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created successfully!");
        router.refresh();
        registerModal.onClose();
      })
      .catch((error) => {
        console.error("Error creating account:", error);

        // تحقق من إذا كان الخطأ هو "Email already exists"
        if (
          error.response &&
          error.response.data.error === "Email already exists"
        ) {
          toast.error(
            "This email is already registered. Please use a different one."
          );
        } else {
          toast.error("An error occurred while creating your account.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePasswordValidation = (password: string): boolean | string => {
    const result = zxcvbn(password);
    setPasswordStrength(result.score); // تخزين درجة القوة (من 0 إلى 4)
    return result.score >= 3 || "Password is too weak"; // إرجاع true إذا كانت كلمة المرور قوية أو رسالة خطأ
  };
  // محتوى جسم المودال
  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to Cozy" subtitle="Create an account!" />
      <Input
        id="name"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^[A-Za-z\s]+$/, // فقط حروف ومسافات
            message: "Name must not contain symbols or numbers",
          },
        }}
      />
      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          pattern: {
            value: /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, // نمط إيميل صحيح
            message: "Please enter a valid email address",
          },
        }}
      />

      <div>
        <Input
          id="password"
          label="Password"
          type="password"
          disabled={isLoading}
          register={register}
          errors={errors}
          required
          validation={{
            validate: handlePasswordValidation,
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters",
            },
          }}
        />
        {passwordStrength !== null && (
          <div>
            <p>
              Password Strength:{" "}
              {["Weak", "Fair", "Good", "Strong"][passwordStrength]}
            </p>
            <progress value={passwordStrength} max={4}></progress>
          </div>
        )}
      </div>
      <Input
        id="confirmPassword"
        label="Confirm Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
        validation={{
          validate: (value) =>
            value === getValues("password") || "Passwords do not match",
        }}
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
            Already have an account?
            <span
              onClick={() => {
                LoginModal.onOpen();
                registerModal.onClose();
              }}
              className="text-neutral-800 cursor-pointer hover:underline"
            >
              Log in
            </span>
          </div>
          <div>
            By continuing, you agree to Cozy
            <span
              onClick={() => {}}
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
      isOpen={registerModal.isOpen}
      title="Create account"
      actionLabel="Continue"
      onClose={registerModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
