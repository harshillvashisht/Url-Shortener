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
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg"
      >
        <h1 className="mb-6 text-center text-3xl font-bold">
          {isLogin ? "Login" : "Register"}
        </h1>

        <div className="space-y-4">
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

        <p className="mt-6 text-center">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            className="ml-2 text-blue-600"
            onClick={() => setIsLogin((prev) => !prev)}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </form>
    </div>
  );
}