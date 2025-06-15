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
    <div className="bg-white text-black min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center space-y-4 mb-12">
          <h1
            className={`text-2xl font-bold text-center text-white ${londrina.className} mb-8`}
          >
            MAM
          </h1>
          {/* <p className="text-lg text-muted-foreground">
            {isSignedIn ? "You are signed in!" : "Sign in to get started"}
          </p>
          <p className="text-lg text-muted-foreground">
            {address
              ? `${address.substring(0, 6)}...${address.substring(
                  address.length - 4
                )}`
              : "No address found"}
          </p> */}

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
              {user && (
                <div className="flex flex-col items-center space-y-2">
                  <Image
                    src={user.pfp_url}
                    alt="Profile"
                    className="w-20 h-20 rounded-full"
                    width={80}
                    height={80}
                  />
                  <div className="text-center">
                    <p className="font-semibold">{user.display_name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                  </div>
                </div>
              )}
              {/* <button
                onClick={testAuth}
                className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition-colors duration-200"
              >
                Test Authentication
              </button> */}

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
  );
}
