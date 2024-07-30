// pages/verify-otp.tsx
"use client";
import logo from "@/public/logo.png";
import mainImage from "@/public/signUpPageImg.svg";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const VerifyOTP = () => {
  const [otp, setOTP] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/verify-otp", { email, otp });
      setMessage(response.data.message);
      router.push(`reset-password?email=${email}`);
    } catch (error) {
      setError("Failed to verify OTP. Please try again.");
      console.error("Error verifying OTP:", error);
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
        <div className="w-full max-w-md p-8 md:space-y-8 bg-black text-white rounded-lg shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
          </div>
          <div className="max-w-md w-full p-6 bg-black rounded-lg shadow-md">
            {message && <p className="text-green-500 mb-4">{message}</p>}
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
              <div className="mb-4 bg-black text-white">
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-white"
                >
                  OTP
                </label>
                <input
                  type="text"
                  id="otp"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-black rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter the OTP received"
                  value={otp}
                  onChange={(e) => setOTP(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
              >
                Verify OTP
              </button>
            </form>
          </div>
          <div className="flex justify-center mt-4">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </Suspense>
  );
};

export default VerifyOTP;
