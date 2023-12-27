"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useCreateUserWithEmailAndPassword, useSignInWithEmailAndPassword, useUpdateProfile } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/logic/fb";
import { signInWithEmailAndPassword } from "@firebase/auth";

type RegisterData = {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const handleErrors = (errors: any) => {
  if (errors.username) return errors.username.message;
  if (errors.email) return errors.email.message;
  if (errors.password) return errors.password.message;
  if (errors.confirmPassword) return errors.confirmPassword.message;
};

export default function RegisterForm({ className }: { className?: string }) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterData>({
    mode: "onSubmit"
  });

  const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);
  const [updateProfile, updating, profileError] = useUpdateProfile(auth);
  const [signInWithEmailAndPassword, currentUser, signInLoading, signInLoadingerror] = useSignInWithEmailAndPassword(auth);

  const onSubmit: SubmitHandler<RegisterData> = useCallback(
    (data) => {
      if (loading) return;
      createUserWithEmailAndPassword(data.email, data.password)
        .then(() => signInWithEmailAndPassword(data.email, data.password)
          .then(() => updateProfile({displayName: data.username})));
    },
    [createUserWithEmailAndPassword, loading, signInWithEmailAndPassword, updateProfile]
  );

  const router = useRouter();

  if (user) {
    router.replace("/login");
  }

  return (
    <form noValidate className={className} onSubmit={handleSubmit(onSubmit)}>
      <input
        className={"input input-bordered mb-3 self-stretch" + (errors.username ? " input-error" : "")}
        placeholder="Username"
        type="text"
        required
        {...register("username", {
          required: "Username is required",
        })}
      />
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
      <input
        className={"input input-bordered mb-3 self-stretch" + (errors.confirmPassword ? " input-error" : "")}
        placeholder="Confirm password"
        type="password"
        required
        {...register("confirmPassword", {
          required: "Confirm your password",
          validate: (val: string) => {
            if (val === watch("password")) {
              return true;
            }
            return "Passwords do not match";
          },
        })}
      />
      <div className="self-stretch flex flex-col justify-between items-start mt-2">
        <button type="submit" className="btn btn-primary self-stretch">
          Create account
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
