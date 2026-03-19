import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import MasterIndex from "./pages/MasterIndex";
import Threads from "./pages/Threads";
import ThreadView from "./pages/ThreadView";

const queryClient = new QueryClient();

function ThreadQueryHandler() {
  const [searchParams] = useSearchParams();
  const thread = searchParams.get("thread");

  console.log("THREAD ID:", thread);

  if (thread) {
    return <Navigate to={`/thread/${thread}`} replace />;
  }

  return <Index />;
}

export default function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />

          <HashRouter>
            <Routes>
              <Route path="/" element={<ThreadQueryHandler />} />
              <Route path="/master-index" element={<MasterIndex />} />
              <Route path="/threads" element={<Threads />} />
              <Route path="/thread/:id" element={<ThreadView />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
      

        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}