// pages/reset-password.tsx
"use client";
import logo from "@/public/logo.png";
import mainImage from "@/public/signUpPageImg.svg";
import axios from "axios";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
const ResetPassword = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    try {
      const response = await axios.post("/api/reset-password", {
        email,
        password,
      });
      setMessage(response.data.message);
      const signInResult = await signIn("credentials", {
        redirect: false,
        identifier: email, // Use email or username used for resetting password
        password,
      });

      if (signInResult?.url) {
        router.push("/"); // Redirect to home page or dashboard
      }
    } catch (error) {
      setError("Failed to reset password. Please try again.");
      console.error("Error resetting password:", error);
    }
  };

  return (
    <Suspense>
      <div className="flex md:justify-center items-center min-h-screen bg-black gap-5 flex-col md:flex-row">
        <div className="w-full max-w-md space-y-8 bg-white rounded-lg shadow-md hidden md:block">
          <Image
            src={mainImage}
            alt=""
            width={100}
            height={100}
            className="w-full h-full rounded-lg"
          />
        </div>
        <Link href="/">
          <Image
            src={logo}
            alt=""
            width={100}
            height={100}
            className="md:hidden w-52"
          />
        </Link>
        <div className="max-w-md w-full p-6 bg-black rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-white">Reset Password</h2>
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 border text-white bg-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="mt-1 block w-full px-3 py-2 border text-white bg-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Confirm your new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
            >
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </Suspense>
  );
};

export default ResetPassword;
