"use client";

import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { sdk } from "@farcaster/frame-sdk";
import { useQuickAuth } from "@/hooks/use-quick-auth";
import { MiniAppsList } from "../dashboard/mini-apps";
import { Londrina_Solid } from "next/font/google";
const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function Home() {
  const { signIn, isLoading, isSignedIn, user } = useQuickAuth({
    autoSignIn: true,
  });
  console.log("user", user);
  const [testResult, setTestResult] = useState<string>("");

  const { address } = useAccount();

  const testAuth = async () => {
    try {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();
      console.log("token", token);

      const res = await fetch("/api/test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (!res.ok) {
        setTestResult(`Auth test failed: ${data.error}`);
        return;
      }

      setTestResult(
        `Auth test succeeded! Server response: ${data.message} (FID: ${data.fid})`
      );
    } catch (error) {
      setTestResult(
        "Auth test failed: " +
          (error instanceof Error ? error.message : "Unknown error")
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-[#eee3c9] to-[#a9bef5] -z-10" />
      <div className="relative min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header with logo and profile */}
          <div className="flex justify-between items-center mb-4">
            <h1
              className={`text-4xl font-bold text-purple-700 ${londrina.className}`}
            >
              MAM
            </h1>
            {isSignedIn && user && (
              <div className="flex items-center gap-2">
                <Image
                  src={user.pfp_url}
                  alt="Profile"
                  className="w-10 h-10 rounded-full"
                  width={40}
                  height={40}
                />
              </div>
            )}
          </div>
          {isSignedIn && user && (
            <p
              className={`text-2xl font-bold text-left ${londrina.className} `}
            >
              Hello, {user?.username}
              <span className="inline-block -mt-1">👋</span>
            </p>
          )}

          <div className="text-center space-y-4">
            {!isSignedIn ? (
              <button
                onClick={signIn}
                disabled={isLoading}
                className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            ) : (
              <div className="space-y-4">
                {testResult && (
                  <div className="mt-4 p-4 rounded-lg bg-gray-100 text-black text-sm">
                    {testResult}
                  </div>
                )}
              </div>
            )}
          </div>

          {isSignedIn && <MiniAppsList />}
        </div>
      </div>
    </>
  );
}
