import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { sdk } from "@farcaster/frame-sdk";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface UseApiMutationOptions<TData, TVariables = unknown>
  extends Omit<UseMutationOptions<TData, Error, TVariables>, "mutationFn"> {
  url: string | ((variables: TVariables) => string);
  method?: HttpMethod;
  body?: (variables: TVariables) => unknown;
  isProtected?: boolean;
}

export const useApiMutation = <TData, TVariables = unknown>(
  options: UseApiMutationOptions<TData, TVariables>
) => {
  const {
    url,
    method = "POST",
    isProtected = true,
    ...mutationOptions
  } = options;

  return useMutation<TData, Error, TVariables>({
    ...mutationOptions,
    mutationFn: async (variables) => {
      const resolvedUrl = typeof url === "function" ? url(variables) : url;
      const resolvedBody = options.body ? options.body(variables) : null;

      if (isProtected) {
        // Use Quick Auth for protected requests
        const response = await sdk.quickAuth.fetch(resolvedUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(resolvedBody ? { body: JSON.stringify(resolvedBody) } : {}),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
      } else {
        // Regular fetch for non-protected requests
        const response = await fetch(resolvedUrl, {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          ...(resolvedBody ? { body: JSON.stringify(resolvedBody) } : {}),
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        return response.json();
      }
    },
  });
};
