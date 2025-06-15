import { useMiniApp } from "@/contexts/miniapp-context";
import { sdk } from "@farcaster/frame-sdk";
import { useCallback, useEffect, useState } from "react";
import { useApiQuery } from "./use-api-query";
import { useApiMutation } from "./use-api-mutation";
import { NeynarUser } from "@/lib/neynar";

export const useQuickAuth = ({
  autoSignIn = false,
}: { autoSignIn?: boolean } = {}) => {
  const { context } = useMiniApp();
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  console.log("came here");

  const {
    data: user,
    isLoading: isLoadingNeynarUser,
    refetch: refetchUser,
  } = useApiQuery<NeynarUser>({
    url: "/api/users/me",
    method: "GET",
    isProtected: true,
    queryKey: ["user"],
    enabled: isSignedIn,
  });

  console.log("user111111111", user);

  const { mutate: signIn, isPending } = useApiMutation<
    { user: NeynarUser },
    {
      token: string;
      fid: number;
    }
  >({
    url: "/api/auth/quick-sign-in",
    method: "POST",
    body: (variables) => variables,
    onSuccess: (data) => {
      setIsSignedIn(true);
    },
    onError: (err) => {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
    },
  });

  const handleSignIn = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!context) {
        throw new Error("No context found");
      }

      // Get Quick Auth token
      const { token } = await sdk.quickAuth.getToken();

      if (!token) {
        throw new Error("Failed to get Quick Auth token");
      }

      await signIn({
        token,
        fid: context.user.fid,
      });

      refetchUser();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Sign in failed";
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [context, signIn, refetchUser]);

  useEffect(() => {
    if (autoSignIn && !isSignedIn && !isLoading) {
      handleSignIn();
    }
  }, [autoSignIn, isSignedIn, isLoading, handleSignIn]);

  return {
    signIn: handleSignIn,
    isSignedIn,
    isLoading: isLoading || isPending || isLoadingNeynarUser,
    error,
    user,
  };
};
