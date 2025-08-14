"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const schema = z.object({
  email: z.string().email("Invalid email"),
});

export default function ForgotPassword() {
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data: unknown) => {
    const res = await fetch("/api/resetpassword/", {
      method: "POST",
      body: JSON.stringify(data),
    });
    if (res.ok) setSuccess(true);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("email")} placeholder="Email" />
      <button type="submit">Send Reset Link</button>
      {success && <p>Check your email!</p>}
    </form>
  );
}
