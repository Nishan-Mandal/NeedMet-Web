import { createRoot } from "react-dom/client";
import "./index.css";
import "./theme/colors.css";
import "./theme/typography.css";
import { RouterProvider } from "react-router-dom";
import router from "./routes/AppRouter";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AppProvider } from "./contexts/AppProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />

      {/* {import.meta.env.DEV && (
        <ReactQueryDevtools initialIsOpen={false} />
      )} */}
    </QueryClientProvider>
  </AppProvider>
);