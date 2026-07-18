import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";

import Button from "../components/common/Button";
import Input from "../components/common/Input";
import useAuth from "../hooks/useAuth";

export default function AuthPage() {
  const navigate = useNavigate();

  const { login, register, loading } = useAuth();

  const [isLogin, setIsLogin] = useState(true);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      if (isLogin) {
        await login({
          email,
          password,
        });
      } else {
        await register({
          email,
          password,
        });
      }

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert("Authentication Failed");
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10"
      >
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
            URL Shortener
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            {isLogin ? "Login" : "Register"}
          </h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-500 sm:text-base">
            Access your workspace to create, manage, and analyze short links in one place.
          </p>
        </div>

        <div className="mt-8 space-y-4 sm:space-y-5">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" disabled={loading}>
            {loading
              ? "Loading..."
              : isLogin
              ? "Login"
              : "Register"}
          </Button>
        </div>

        <p className="mt-6 text-center text-sm text-slate-600">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="ml-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
            onClick={() => setIsLogin((prev) => !prev)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}