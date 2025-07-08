"use client";

import React, { useState, useRef, useCallback, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useApiQuery } from "@/hooks/use-api-query";
import { AppWindow } from "lucide-react";
import { sdk } from "@farcaster/frame-sdk";

interface MiniApp {
  id: string;
  appId: string;
  title: string;
  description: string;
  frameUrl: string;
  image: string;
  frame: string;
  createdAt: string;
}

interface WheelSection {
  id: string;
  icon: React.ReactNode;
  color: string;
  prize: string;
  degreeRange: [number, number];
  miniApp?: MiniApp;
}

interface SpinWheelProps {
  className?: string;
  maxAttempts?: number;
  onSpin?: (result: string, miniApp?: MiniApp) => void;
}

// Colors for wheel sections
const wheelColors = [
  "#000000", // Teal
  "#2980b9", // Blue
  "#e67e22", // Orange
  "#8e44ad", // Purple
  "#e74c3c", // Red
  "#f1c40f", // Yellow
  "#1abc9c", // Turquoise
  "#34495e", // Dark Blue
  "#fd79a8", // Pink
  "#00b894", // Green
  "#fdcb6e", // Light Orange
  "#636e72", // Gray
];

export function SpinWheel({
  className,
  maxAttempts = 8,
  onSpin,
}: SpinWheelProps) {
  const [attempts, setAttempts] = useState(maxAttempts);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<string>("");
  const [rotation, setRotation] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [winningMiniApp, setWinningMiniApp] = useState<MiniApp | null>(null);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Fetch mini apps from the API
  const {
    data: miniAppsData,
    isLoading,
    error,
  } = useApiQuery<{
    items: MiniApp[];
    nextCursor: string | null;
    hasMore: boolean;
  }>({
    queryKey: ["mini-apps", "season", "all"],
    url: "/api/mini-apps/season?season=all",
    isProtected: true,
    enabled: true,
  });

  // Create wheel sections from mini apps
  const wheelSections: WheelSection[] = useMemo(() => {
    // Use first 10 mini apps for wheel sections
    const appsForWheel = miniAppsData?.items?.slice(0, 10) || [];
    const sectionSize = 360 / appsForWheel.length;
    // console.log("apps for wheel", appsForWheel);

    return appsForWheel.map((app, index) => ({
      id: app.id,
      icon: <AppWindow className="w-8 h-8" />,
      color: wheelColors[index % wheelColors.length],
      prize: `You discovered: ${app.title}`,
      degreeRange: [index * sectionSize, (index + 1) * sectionSize] as [
        number,
        number
      ],
      miniApp: app,
    }));
  }, [miniAppsData]);
  //   console.log("wheel", wheelSections);

  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      console.log(urlObj.hostname);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const handleSpin = useCallback(() => {
    if (attempts <= 0 || isSpinning) return;

    setIsSpinning(true);
    setResult("");
    setWinningMiniApp(null);

    const newClicks = clicks + 1;
    setClicks(newClicks);

    const baseDegree = 1800;
    // Generate a random angle between 0 and 360 degrees for true randomness
    const extraDegree = Math.floor(Math.random() * 360);
    const totalDegree = baseDegree * newClicks + extraDegree;

    setRotation(totalDegree);
    setAttempts(attempts - 1);

    // Determine result based on final position
    // The arrow points to the top (0°), so we need to calculate which section is at the top
    const finalDegree = extraDegree % 360;

    // Calculate which section the arrow points to
    const sectionSize = 360 / wheelSections.length;

    // Since the first section starts at 0° and the wheel rotates clockwise,
    // we need to find which section ends up at the arrow position (top = 0°)
    const normalizedAngle = (360 - finalDegree) % 360;

    // Add half section offset to ensure we're pointing to the center of sections
    // This prevents off-by-one errors at section boundaries
    const adjustedAngle = (normalizedAngle + sectionSize / 2) % 360;

    // Find the section index based on the adjusted angle
    const sectionIndex = Math.floor(adjustedAngle / sectionSize);
    const winningSection = wheelSections[sectionIndex] || wheelSections[0];

    setTimeout(() => {
      if (winningSection) {
        setResult(winningSection.prize);
        setWinningMiniApp(winningSection.miniApp || null);
        onSpin?.(winningSection.prize, winningSection.miniApp);
      }
      setIsSpinning(false);
    }, 6000); // Match the CSS transition duration
  }, [attempts, isSpinning, clicks, onSpin, wheelSections]);

  const resetWheel = () => {
    setAttempts(maxAttempts);
    setClicks(0);
    setRotation(0);
    setResult("");
    setWinningMiniApp(null);
    setIsSpinning(false);
  };

  if (isLoading) {
    return (
      <div className={cn("flex flex-col items-center space-y-6", className)}>
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-4">
            Loading Mini Apps...
          </div>
          <div className="w-64 h-64 rounded-full border-8 border-gray-200 animate-pulse" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex flex-col items-center space-y-6", className)}>
        <div className="text-center">
          <div className="text-lg font-semibold text-red-600 mb-4">
            Failed to load mini apps
          </div>
          <Button onClick={() => window.location.reload()} variant="outline">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col items-center space-y-6", className)}>
      <div className="text-center space-y-2">
        {result && (
          <div className="text-lg font-bold text-green-600 bg-green-50 px-4 py-2 rounded-lg space-y-3">
            <div>{result}</div>
            {winningMiniApp && (
              <div className="flex justify-center gap-3">
                <button
                  onClick={() =>
                    sdk.actions.openUrl(
                      `https://farcaster.xyz/~/mini-apps/launch?domain=${getDomainFromUrl(
                        winningMiniApp.frameUrl
                      )}`
                    )
                  }
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                >
                  🚀 Open Miniapp
                </button>
                <button
                  onClick={async () => {
                    try {
                      await sdk.actions.composeCast({
                        text: `Just discovered ${winningMiniApp.title} on the Miniapp Monday spin wheel! Try it out! 👇`,
                        embeds: [
                          "https://farcaster.xyz/miniapps/2_-h28xamTWj/miniapp-monday",
                          winningMiniApp.frameUrl,
                        ],
                        channelKey: "miniapps",
                      });
                    } catch (error) {
                      console.error("Failed to compose cast:", error);
                    }
                  }}
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
                >
                  📢 Share Cast
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="relative w-80 h-80 mx-auto overflow-hidden">
        {/* Wheel Container */}
        <div className="relative w-full h-full">
          {/* Wheel */}
          <div
            ref={wheelRef}
            className="w-full h-full rounded-full border-8 border-white shadow-lg relative overflow-hidden"
            style={{
              transform: `rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 6s cubic-bezier(0,0.99,0.44,0.99)",
            }}
          >
            {/* Wheel Sections */}
            {wheelSections.map((section, index) => {
              const sectionSize = 360 / wheelSections.length;
              const rotation = sectionSize * index;

              // Calculate dynamic border width based on section size
              const radius = 155; // wheel radius (adjusted for border, scaled up)
              const sectionWidth =
                Math.tan((sectionSize * Math.PI) / 360) * radius;

              return (
                <div
                  key={section.id}
                  className="absolute w-0 h-0 border-solid border-transparent"
                  style={{
                    borderWidth: `${radius}px ${sectionWidth}px 0`,
                    borderColor: `${section.color} transparent`,
                    transformOrigin: `${sectionWidth}px ${radius}px`,
                    left: `50%`,
                    top: `50%`,
                    marginLeft: `-${sectionWidth}px`,
                    marginTop: `-${radius}px`,
                    transform: `rotate(${rotation}deg)`,
                  }}
                >
                  {/* Text positioned relative to section center */}
                  <div
                    className="absolute"
                    style={{
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) translateY(-135px)",
                      fontSize: "11px",
                      fontWeight: "700",
                      color: "rgba(255,255,255,1)",
                      textShadow:
                        "rgba(0, 0, 0, 1) 0px 1px 2px, rgba(0, 0, 0, 0.8) 0px 0px 4px",
                      maxWidth: `${sectionWidth * 1.6}px`,
                      textAlign: "center",
                      lineHeight: "1.0",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      letterSpacing: "0.3px",
                      textTransform: "uppercase",
                      paddingBottom: "8px",
                      marginBottom: "4px",
                    }}
                  >
                    {section.miniApp?.title || "APP"}
                  </div>
                </div>
              );
            })}

            {/* Inner Border */}
            <div className="absolute inset-4 border-4 border-black/10 rounded-full" />
          </div>

          {/* Spin Button */}
          <button
            onClick={handleSpin}
            disabled={attempts <= 0 || isSpinning}
            className={cn(
              "absolute top-1/2 left-1/2 w-20 h-20 -mt-10 -ml-10 rounded-full bg-white shadow-lg cursor-pointer select-none z-10",
              "flex items-center justify-center text-gray-400 font-semibold",
              "hover:shadow-xl transition-shadow duration-200",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              isSpinning && "animate-pulse"
            )}
            // style={{
            //   textShadow: "0 2px 0 #fff, 0 -2px 0 rgba(0,0,0,0.3)",
            // }}
          >
            <div className="relative">
              SPIN
              {/* Arrow */}
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-0 h-0 border-solid border-transparent"
                style={{
                  borderWidth: "0 10px 14px 10px",
                  borderColor: "transparent transparent #ffffff transparent",
                }}
              />
            </div>
          </button>

          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-full opacity-10 bg-gradient-radial from-white via-white/90 to-transparent" />
        </div>

        {/* Center Arrow Pointer */}
        <div
          className="absolute top-1/2 left-1/2 z-20"
          style={{
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          <div
            className="w-0 h-0 border-solid"
            style={{
              borderWidth: "0 15px 25px 15px",
              borderColor: "transparent transparent #ffffff transparent",
              transform: "translateY(-50px)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
