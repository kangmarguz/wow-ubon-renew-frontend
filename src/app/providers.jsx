import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import { queryClient } from "../shared/lib/queryClient";

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastContainer position="top-right" autoClose={2500} pauseOnFocusLoss={false} />
    </QueryClientProvider>
  );
}
