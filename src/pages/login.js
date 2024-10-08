import { useState } from "react";
import { useRouter } from "next/router";
import { login } from "../../public/functions/auth";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Link from "next/link";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const loginToDashboard = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const res = await login(email, password, rememberMe);

    setIsLoading(false);

    if (res.error) {
      setError(res.data?.message || "Login failed. Please try again.");
    } else {
      router.push("/");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 px-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-extrabold text-primary">Saramoda</h1>
        </div>
        <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">
          Login to Dashboard
        </h2>
        {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
        <form className="space-y-6" onSubmit={loginToDashboard}>
          <div>
            <label
              htmlFor="email"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="relative">
            <label
              htmlFor="password"
              className="block text-left text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-primary focus:border-primary"
            />
            <div
              className="absolute inset-y-0 top-6 right-0 pr-3 flex items-center cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <AiFillEyeInvisible className="h-6 w-6 text-gray-500" />
              ) : (
                <AiFillEye className="h-6 w-6 text-gray-500" />
              )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me
              </label>
            </div>
            <div className="text-sm">
              <Link
                href="/forget-password"
                className="font-medium text-primary hover:text-primary-dark"
              >
                Forgot your password?
              </Link>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-white ${
              isLoading
                ? "bg-primary cursor-not-allowed"
                : "bg-primary hover:bg-primary-dark"
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary font-semibold transition duration-300`}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </div>
    </main>
  );
}
