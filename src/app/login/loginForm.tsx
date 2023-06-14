"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/logic/fb";

type LoginData = {
  email: string;
  password: string;
};

const handleErrors = (errors: any) => {
  if (errors.email) return errors.email.message;
  if (errors.password) return errors.password.message;
};

export default function LoginForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginData>({
    mode: "onSubmit"
  });

  const [signInWithEmailAndPassword, user, loading, error] = useSignInWithEmailAndPassword(auth);

  const onSubmit: SubmitHandler<LoginData> = useCallback(
    (data) => {
      if (loading) return;
      signInWithEmailAndPassword(data.email, data.password);
    },
    [signInWithEmailAndPassword, loading]
  );

  const router = useRouter();

  if (user) {
    router.replace("/home");
  }

  return (
    <form noValidate className={className} onSubmit={handleSubmit(onSubmit)}>
      <input
        className={"input input-bordered mb-3 self-stretch" + (errors.email ? " input-error" : "")}
        placeholder="Email"
        type="email"
        required
        {...register("email", {
          required: "Email is required",
          pattern: {
            value:
              /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            message: "Invalid email address",
          },
        })}
      />
      <input
        className={"input input-bordered mb-3 self-stretch" + (errors.password ? " input-error" : "")}
        placeholder="Password"
        type="password"
        required
        {...register("password", {
          required: "Password is required",
        })}
      />
      <div className="self-stretch flex flex-col justify-between items-start mt-2">
        <button type="submit" className="btn btn-primary self-stretch">
          Log in
        </button>
        <span className="text-center text-sm text-error mt-3 min-h-6">
          {errors && handleErrors(errors)}
        </span>
        <span className="text-center text-sm text-error mt-3 min-h-6">
          {error && error.message}
        </span>
      </div>
    </form>
  );
}
