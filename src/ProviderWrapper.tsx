import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { Worker } from "@react-pdf-viewer/core";
import { QueryClient, QueryClientProvider } from "react-query";

const emotionCache = createCache({
  key: "emotion-css-cache",
  prepend: true,
});

const theme = {
  fonts: {
    heading: `'Manrope', sans-serif`,
    body: `'Manrope', sans-serif`,
  },
};

const customTheme = extendTheme(theme);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,

      refetchOnMount: true,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

export default function ProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CacheProvider value={emotionCache}>
      <ChakraProvider theme={customTheme}>
        {
          //@ts-ignore
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        }
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js"></Worker>
      </ChakraProvider>
    </CacheProvider>
  );
}
