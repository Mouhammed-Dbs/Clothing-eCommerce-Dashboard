import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import {
  forgetPassword,
  verifyPassResetCode,
  resetPassword,
} from "../../public/functions/auth";
import { useRouter } from "next/router";

export default function ForgetPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // حالة إظهار أو إخفاء كلمة المرور
  const [isSuccess, setIsSuccess] = useState(false); // حالة لتحديد إذا كانت العملية ناجحة

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await forgetPassword(email);
      setIsSuccess(response.data.status === "Success"); // تحديث حالة النجاح
      setMessage(
        response.data.message || "Failed to send reset code. Please try again."
      );
      if (response.data.status === "Success") {
        setStep(2);
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error.response?.data.message ||
          "Failed to send reset code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await verifyPassResetCode(resetCode);
      setIsSuccess(response.data.status === "Success"); // تحديث حالة النجاح

      if (response.data.status === "Success") {
        setStep(3);
        setMessage(
          response.data.message || "The password reset code has been confirmed."
        );
      } else {
        setMessage(
          response.data.message || "Invalid or expired code. Please try again."
        );
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error.response?.data.message ||
          "Invalid or expired code. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await resetPassword(email, newPassword);
      setIsSuccess(response.data.status === "Success"); // تحديث حالة النجاح
      if (response.data.status === "Success") {
        setMessage(
          response.data.message || "The password has been reset successfully."
        );
        setTimeout(() => router.replace("/login"), 1500);
      } else {
        setMessage(
          response.data.message || "Failed to reset password. Please try again."
        );
      }
    } catch (error) {
      setIsSuccess(false);
      setMessage(
        error.response?.data.message ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-8 lg:p-12 xl:p-16 min-h-screen bg-gradient-to-br from-orange-200 via-orange-300 to-orange-400 flex flex-col justify-center items-center">
      <div className="bg-white rounded-lg shadow-md p-6 md:p-8 lg:p-10 xl:p-12 transform transition-transform duration-300 lg:max-w-2xl xl:max-w-xl mx-auto border-t-4 border-orange-500">
        <h2 className="text-2xl lg:text-3xl xl:text-4xl font-bold mb-4 text-center text-orange-500">
          Forgot Password
        </h2>
        <p className="text-gray-600 text-md lg:text-lg xl:text-xl mb-6 text-center">
          {step === 1
            ? "Enter your email address below and we'll send you a link to reset your password."
            : step === 2
            ? "Enter the 6-digit code sent to your email."
            : "Enter your new password."}
        </p>
        {message && (
          <p
            className={`text-center mb-4 ${
              isSuccess ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col">
            <input
              type="email"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="submit"
              className={`bg-orange-500 text-white py-3 rounded-lg transition-colors duration-300 ${
                isLoading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeSubmit} className="flex flex-col">
            <input
              type="text"
              placeholder="Enter 6-digit Code"
              value={resetCode}
              onChange={(e) => setResetCode(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="submit"
              className={`bg-orange-500 text-white py-3 rounded-lg transition-colors duration-300 ${
                isLoading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        )}

        {step === 3 && (
          <form
            onSubmit={handlePasswordReset}
            className="flex flex-col relative"
          >
            <input
              type={showPassword ? "text" : "password"} // تحديد نوع الإدخال بناءً على حالة إظهار أو إخفاء كلمة المرور
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="border-2 border-gray-300 p-3 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-4 top-3 text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={24} /> : <FaEye size={24} />}
            </button>
            <button
              type="submit"
              className={`bg-orange-500 text-white py-3 rounded-lg transition-colors duration-300 ${
                isLoading
                  ? "bg-orange-300 cursor-not-allowed"
                  : "hover:bg-orange-600"
              }`}
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
