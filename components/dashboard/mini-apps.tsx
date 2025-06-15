"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { SelectMiniApp } from "@/db/schema";
import { useQuickAuth } from "@/hooks/use-quick-auth";
import { sdk } from "@farcaster/frame-sdk";

export function MiniAppsList() {
  const { isSignedIn } = useQuickAuth({
    autoSignIn: true,
  });

  const {
    data: miniApps,
    isLoading,
    error,
  } = useQuery<SelectMiniApp[]>({
    queryKey: ["miniApps"],
    queryFn: async () => {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();

      const response = await fetch("/api/mini-apps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch mini apps");
      }
      return response.json();
    },
    enabled: isSignedIn, // Only fetch when signed in
  });

  if (!isSignedIn) {
    return null; // Don't show anything if not signed in
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading mini apps</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {miniApps?.map((app) => (
        <Card
          key={app.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-full h-48">
            <Image
              src={app.image || "/placeholder-app.png"}
              alt={app.title}
              fill
              className="object-cover"
            />
          </div>
          <CardHeader>
            <CardTitle>{app.title}</CardTitle>
            <CardDescription>{app.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href={app.frameUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Frame →
            </a>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
