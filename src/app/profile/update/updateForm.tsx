"use client";

import { useCallback } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useSignInWithEmailAndPassword, useUpdateEmail, useUpdatePassword, useUpdateProfile } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/logic/fb";

type UpdateData = {
  email: string;
  username: string;
  password: string;
  oldPassword: string;
};

const handleErrors = (errors: any) => {
  if (errors.email) return errors.email.message;
  if (errors.password) return errors.password.message;
};

export default function UpdateForm({ fieldToUpdate, className }: { fieldToUpdate: string, className?: string }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateData>({
    mode: "onSubmit"
  });

  const [signInWithEmailAndPassword, signedInUser, loading, signInError] = useSignInWithEmailAndPassword(auth);
  const [updateEmail, updatingEmail, emailError] = useUpdateEmail(auth);
  const [updateProfile, updatingProfile, profileError] = useUpdateProfile(auth);
  const [updatePassword, updatingPassword, passwordError] = useUpdatePassword(auth);

  const user = auth.currentUser;
  
  const router = useRouter();
  
  const onSubmit: SubmitHandler<UpdateData> = useCallback(
    async (data) => {
      if (!user || user.email == null) return;
      console.log(user);
      const authenticated = await signInWithEmailAndPassword(user.email, data.oldPassword);
      if (!authenticated) return;
      let updated = false;
      if (fieldToUpdate == "email") {
        if (updatingEmail) return;
        updated = await updateEmail(data.email);
      }
      if (fieldToUpdate == "username") {
        if (updatingProfile) return;
        updated = await updateProfile({displayName: data.username});
      }
      if (fieldToUpdate == "password") {
        if (updatingPassword) return;
        updated = await updatePassword(data.password);
      }
      if (updated) router.replace("/profile");
    },
    [fieldToUpdate, router, signInWithEmailAndPassword, updateEmail, updatePassword, updateProfile, updatingEmail, updatingPassword, updatingProfile, user]
  );


  return (
    <form noValidate className={className} onSubmit={handleSubmit(onSubmit)}>
      {fieldToUpdate == "email" && <input
        className={"input input-bordered mb-3 self-stretch" + (errors.email ? " input-error" : "")}
        placeholder="New email"
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
      />}
      {fieldToUpdate == "username" && <input
        className={"input input-bordered mb-3 self-stretch" + (errors.username ? " input-error" : "")}
        placeholder="New username"
        type="text"
        required
        {...register("username", {
          required: "Username is required",
        })}
      />}
      {fieldToUpdate == "password" && <input
        className={"input input-bordered mb-3 self-stretch" + (errors.password ? " input-error" : "")}
        placeholder="New password"
        type="password"
        required
        {...register("password", {
          required: "Password is required",
        })}
      />}
      <input
        className={"input input-bordered mb-3 self-stretch" + (errors.oldPassword ? " input-error" : "")}
        placeholder={fieldToUpdate == "password" ? "Old password" : "Password"}
        type="password"
        required
        {...register("oldPassword", {
          required: "Password is required",
        })}
      />
      <div className="self-stretch flex flex-col justify-between items-start mt-2">
        <button type="submit" className="btn btn-primary self-stretch">
          Update
        </button>
        <span className="text-center text-sm text-error mt-3 min-h-6">
          {(errors && handleErrors(errors)) || (signInError && signInError.message) ||
           (emailError && emailError.message) || (passwordError && passwordError.message) || (profileError && profileError.message)}
        </span>
      </div>
    </form>
  );
}
