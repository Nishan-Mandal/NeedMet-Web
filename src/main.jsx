import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme/colors.css";
import "./theme/typography.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRouter";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { AppProvider } from "./contexts/AppProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 30 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
});

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 days
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const key = query.queryKey[0];

            // persist only selected queries
            return ["all-category"].includes(key);
          },
        },
      }}
    >
      <RouterProvider router={router} />

      {/* {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </PersistQueryClientProvider>
  </AppProvider>
);