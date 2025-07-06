"use client";

import { SpinWheel } from "@/components/ui/spin-wheel";
import { Londrina_Solid } from "next/font/google";

const londrina = Londrina_Solid({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export default function SpinWheelDemo() {
  const handleSpinResult = (result: string, miniApp?: any) => {
    console.log("Spin wheel result:", result);
    if (miniApp) {
      console.log("Discovered mini app:", miniApp);
      // You can add logic here to navigate to the mini app or show more details
    }
    // You can add additional logic here like showing a toast notification
    // or updating user's balance in your database
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#eee3c9] to-[#a9bef5] py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${londrina.className}`}>
            🎰 Spin Wheel Demo 🎰
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Experience the excitement of our spin wheel! Each spin gives you a
            chance to win different prizes. You have 5 attempts to try your
            luck.
          </p>
        </div>

        <div className="flex justify-center">
          <SpinWheel
            onSpin={handleSpinResult}
            maxAttempts={5}
            className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
          />
        </div>

        <div className="mt-12 text-center">
          <h2 className={`text-2xl font-bold mb-4 ${londrina.className}`}>
            How It Works
          </h2>
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">🎯</div>
              <h3 className="font-semibold mb-2">Spin the Wheel</h3>
              <p className="text-sm text-gray-700">
                Click the spin button to start the wheel animation
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">🎁</div>
              <h3 className="font-semibold mb-2">Win Prizes</h3>
              <p className="text-sm text-gray-700">
                Land on different sections to win various prizes
              </p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-6">
              <div className="text-3xl mb-2">🔄</div>
              <h3 className="font-semibold mb-2">Try Again</h3>
              <p className="text-sm text-gray-700">
                Use your remaining attempts to win more prizes
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
