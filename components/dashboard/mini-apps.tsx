"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { useInfiniteQuery } from "@tanstack/react-query";
import { SelectMiniApp } from "@/db/schema";
import { useQuickAuth } from "@/hooks/use-quick-auth";
import { sdk } from "@farcaster/frame-sdk";
import { Skeleton } from "@/components/ui/skeleton";
import { useRef, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";

interface MiniAppsResponse {
  items: SelectMiniApp[];
  nextCursor: string | null;
  hasMore: boolean;
}

export function MiniAppsList() {
  const { isSignedIn } = useQuickAuth({
    autoSignIn: true,
  });

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<MiniAppsResponse>({
    queryKey: ["miniApps"],
    queryFn: async ({ pageParam = null }) => {
      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();

      const response = await fetch(
        `/api/mini-apps${pageParam ? `?cursor=${pageParam}` : ""}`,
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

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-72" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error loading mini apps</div>;
  }

  const miniApps = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {/* <Carousel className="h-72 w-full">
        <CarouselContent>
          {miniApps.map(
            (app) => (
              console.log(app),
              (
                <CarouselItem key={app.id}>
                  <Card>
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
                    </CardHeader>
                    <CardContent>
                      <a
                        href={`https://farcaster.xyz/?launchFrameUrl=${app.frameUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View Mini App →
                      </a>
                    </CardContent>
                  </Card>
                </CarouselItem>
              )
            )
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel> */}
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
            <a
              href={`https://farcaster.xyz/?launchFrameUrl=${app.frameUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              View Mini App →
            </a>
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
}
