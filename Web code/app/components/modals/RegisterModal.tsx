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

const RegisterModal = () => {
  const registerModal = useRegisterModal();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // دالة إرسال البيانات
  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .post("/api/register", data)
      .then(() => {
        toast.success("Account created successfully!");
        registerModal.onClose();
      })
      .catch((error) => {
        console.error("Error creating account:", error);
        toast.error("Something went wrong!");
        // يمكنك إضافة معالجة أخطاء أكثر تفصيلاً هنا إذا لزم الأمر
      })
      .finally(() => {
        setIsLoading(false);
      });
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
      />
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
          onClick={() => {}}
        />
        <div className="text-neutral-500 text-center mt-4 font-light">
          <div>
            Already have an account?
            <span
              onClick={registerModal.onClose}
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
      onSubmit={handleSubmit(onSubmit)} // استخدم onSubmit بدلاً من onsubmit
      body={bodyContent}
      footer={footerContent}
    />
  );
};

export default RegisterModal;
