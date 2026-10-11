import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRouter";
import { QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { AppProvider } from "./contexts/AppProvider";

const PERSIST_ALLOWLIST = [
  "all-category",
  "homeDetails",
  "recommendedListings",
  "newListings",
  "categoryListings",
  "searchListings",
];

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 10 * 60 * 1000,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours retention
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

const localStoragePersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: "NEEDMET_QUERY_OFFLINE_CACHE",
});

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: localStoragePersister,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const key = query.queryKey[0];

            // Persist valid, successful queries in the allowlist
            return (
              query.state.status === "success" &&
              Boolean(query.state.data) &&
              PERSIST_ALLOWLIST.includes(key)
            );
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