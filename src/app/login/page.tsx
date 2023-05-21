import Link from "next/link";
import LoginForm from "./loginForm";

export default function Login() {
  return (
    <div className="col-start-1 col-span-4 sm:col-start-2 sm:col-span-4 lg:col-start-3 lg:col-span-4 xl:col-start-5 xl:col-span-4">
      <div className="rounded-xl bg-base-200 p-5 flex flex-col justify-start items-center">
        <div className="text-2xl font-bold mb-4 text-center">Log in</div>
        <LoginForm className="w-full flex flex-col justify-start items-center" />
        <p className="text-center w-full inline mt-2">
          <span>New? </span>
          <Link
            href="/register"
            className="text-secondary hover:text-secondary-focus transition-colors"
          >
            Create account
          </Link>
          <span> and start playing bridge.</span>
        </p>
      </div>
    </div>
  );
}
