import Link from "next/link";
import RegisterForm from "./registerForm";

export default function Register() {
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-center">
        <div className="text-2xl font-bold mb-4 text-center">Create account</div>
        <RegisterForm className="w-full flex flex-col justify-start items-center"/>
      </div>
    </div>
  );
}
