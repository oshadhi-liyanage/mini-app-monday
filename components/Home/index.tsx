"use client";

import Image from "next/image";
import { useState } from "react";
import { useAccount } from "wagmi";
import { sdk } from "@farcaster/frame-sdk";
import { useQuickAuth } from "@/hooks/use-quick-auth";
import { MiniAppsList } from "../dashboard/mini-apps";
import { Londrina_Solid } from "next/font/google";
import Routte from "../routte";
import { SpinWheel } from "../ui/spin-wheel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Home as HomeIcon, Flame } from "lucide-react";

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
  const [activeTab, setActiveTab] = useState<string>("home");

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

  const handleSpinResult = (result: string, miniApp?: any) => {
    console.log("Spin wheel result:", result);
    if (miniApp) {
      console.log("Discovered mini app:", miniApp);
      // You can add logic here to navigate to the mini app or show more details
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-gradient-to-b from-[#eee3c9] to-[#a9bef5] -z-10" />
      <div className="relative flex flex-col">
        {/* Header */}
        <div className="px-4 pt-8 flex-1">
          <div className="flex justify-between items-center mb-4">
            <Image
              src="/images/mam_icon_url.png"
              alt="Logo"
              width={100}
              height={100}
            />
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
          <div className="flex justify-between items-center">
            {isSignedIn && user && (
              <p
                className={`text-2xl font-bold text-left ${londrina.className} `}
              >
                Hello, {user?.username}
                <span className="inline-block -mt-1">👋</span>
              </p>
            )}
            {/* <Routte /> */}
          </div>

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
        </div>
      </div>
      {/* Main Content with Bottom Tabs */}
      {isSignedIn && (
        <div className="flex-1 pb-20">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full h-full"
          >
            <TabsContent value="home" className="mt-0">
              <MiniAppsList />
            </TabsContent>

            <TabsContent value="hot-picks" className="mt-0">
              <div className="mt-12">
                <div className="text-center mb-8">
                  <h2
                    className={`text-3xl font-bold mb-4 ${londrina.className}`}
                  >
                    Try Your Luck! 🎰
                  </h2>
                  <p className="text-gray-600 max-w-md mx-auto">
                    Spin the wheel and see what you win! You have 5 attempts to
                    try your luck.
                  </p>
                </div>
                <div className="flex justify-center">
                  <SpinWheel onSpin={handleSpinResult} />
                </div>
              </div>
            </TabsContent>

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200 z-10">
              <TabsList className="grid w-full grid-cols-2 bg-transparent h-16 p-0 rounded-none">
                <TabsTrigger
                  value="home"
                  className="flex flex-col items-center justify-center gap-1 h-full bg-transparent border-0 rounded-none p-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-transparent transition-colors"
                >
                  <HomeIcon className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs font-medium">Home</span>
                </TabsTrigger>
                <TabsTrigger
                  value="hot-picks"
                  className="flex flex-col items-center justify-center gap-1 h-full bg-transparent border-0 rounded-none p-0 data-[state=active]:bg-transparent data-[state=active]:text-primary data-[state=active]:shadow-none hover:bg-transparent transition-colors"
                >
                  <Flame className="h-5 w-5 flex-shrink-0" />
                  <span className="text-xs font-medium">Hot Picks</span>
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>
      )}
    </>
  );
}
