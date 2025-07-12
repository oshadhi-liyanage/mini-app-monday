"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SelectMiniApp } from "@/db/schema";
import { useQuickAuth } from "@/hooks/use-quick-auth";
import { sdk } from "@farcaster/frame-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useCallback, useState } from "react";
import { sdk as miniAppSdk } from "@farcaster/miniapp-sdk";

interface MiniAppsResponse {
  items: SelectMiniApp[];
  nextCursor: string | null;
  hasMore: boolean;
}

type SeasonType = "this-week" | "last-week" | "all";

export function MiniAppsList() {
  const { isSignedIn } = useQuickAuth({
    autoSignIn: true,
  });

  const [activeTab, setActiveTab] = useState<SeasonType>("this-week");

  const getDomainFromUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      console.log(urlObj.hostname);
      return urlObj.hostname;
    } catch (e) {
      return url;
    }
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MiniAppsResponse>({
    queryKey: ["miniApps", activeTab],
    queryFn: async ({ pageParam = null }) => {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();

      const response = await fetch(
        `/api/mini-apps/season?season=${activeTab}${
          pageParam ? `&cursor=${pageParam}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch mini apps");
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    enabled: isSignedIn,
  });

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useCallback(
    (node: HTMLDivElement) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [hasNextPage, isFetchingNextPage, fetchNextPage]
  );

  if (!isSignedIn) {
    return null;
  }

  const renderMiniAppsGrid = (miniApps: SelectMiniApp[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {miniApps.map((app) => (
        <Card
          key={app.id}
          className="overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="relative w-full h-48">
            {app.image ? (
              <Image
                src={app.image}
                alt={app.title}
                fill
                className="object-cover"
              />
            ) : (
              <div
                className="w-full h-full"
                style={{
                  backgroundImage:
                    "linear-gradient(120deg, #a6c0fe 0%, #f68084 100%)",
                }}
              />
            )}
          </div>
          <CardHeader>
            <CardTitle>{app.title}</CardTitle>
            <CardDescription>{app.description}</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <button
              onClick={() =>
                miniAppSdk.actions.openMiniApp({
                  url: `https://farcaster.xyz/~/mini-apps/launch?domain=${getDomainFromUrl(
                    app.frameUrl
                  )}`,
                })
              }
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View MiniApp
            </button>
            {/*  */}
            <Image
              src={
                app.frame ? JSON.parse(app.frame)?.author?.pfp_url || "" : ""
              }
              alt="Profile"
              className="w-10 h-10 rounded-full"
              width={40}
              height={40}
            />
          </CardContent>
        </Card>
      ))}

      {/* Loading indicator */}
      <div ref={loadMoreRef} className="col-span-full flex justify-center py-4">
        {isFetchingNextPage && (
          <div className="flex gap-2">
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-4 h-4 rounded-full" />
            <Skeleton className="w-4 h-4 rounded-full" />
          </div>
        )}
      </div>
    </div>
  );

  const renderLoadingState = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="w-full h-72" />
      ))}
    </div>
  );

  const renderErrorState = () => (
    <div className="text-red-500 p-6">Error loading mini apps</div>
  );

  const renderEmptyState = () => (
    <div className="text-center text-muted-foreground p-6">
      No mini apps found for this period.
    </div>
  );

  return (
    <div className="px-4">
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SeasonType)}
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="this-week">This Week</TabsTrigger>
          <TabsTrigger value="last-week">Last Week</TabsTrigger>
          <TabsTrigger value="all">All Time</TabsTrigger>
        </TabsList>

        <TabsContent value="this-week" className="mt-6">
          {isLoading
            ? renderLoadingState()
            : error
            ? renderErrorState()
            : (() => {
                const miniApps =
                  data?.pages.flatMap((page) => page.items) ?? [];
                return miniApps.length > 0
                  ? renderMiniAppsGrid(miniApps)
                  : renderEmptyState();
              })()}
        </TabsContent>

        <TabsContent value="last-week" className="mt-6">
          {isLoading
            ? renderLoadingState()
            : error
            ? renderErrorState()
            : (() => {
                const miniApps =
                  data?.pages.flatMap((page) => page.items) ?? [];
                return miniApps.length > 0
                  ? renderMiniAppsGrid(miniApps)
                  : renderEmptyState();
              })()}
        </TabsContent>

        <TabsContent value="all" className="mt-6">
          {isLoading
            ? renderLoadingState()
            : error
            ? renderErrorState()
            : (() => {
                const miniApps =
                  data?.pages.flatMap((page) => page.items) ?? [];
                return miniApps.length > 0
                  ? renderMiniAppsGrid(miniApps)
                  : renderEmptyState();
              })()}
        </TabsContent>
      </Tabs>
    </div>
  );
}
