import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { sdk } from "@farcaster/frame-sdk";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiQueryOptions<TData, TBody = unknown>
  extends Omit<UseQueryOptions<TData>, "queryFn"> {
  url: string;
  method?: HttpMethod;
  body?: TBody;
  isProtected?: boolean;
  enabled?: boolean;
}

export const useApiQuery = <TData, TBody = unknown>(
  options: UseApiQueryOptions<TData, TBody>
) => {
  const {
    url,
    method = "GET",
    body,
    isProtected = false,
    enabled = true,
    ...queryOptions
  } = options;

  return useQuery<TData>({
    ...queryOptions,
    queryFn: async () => {
      if (isProtected) {
        // Use Quick Auth for protected requests
        const response = await sdk.quickAuth.fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(body && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
      } else {
        // Regular fetch for non-protected requests
        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(body && { body: JSON.stringify(body) }),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
      }
    },
    enabled,
  });
};
