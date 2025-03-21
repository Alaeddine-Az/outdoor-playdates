
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Playdates from "./pages/Playdates";
import Achievements from "./pages/Achievements";
import Connections from "./pages/Connections";
import NotFound from "./pages/NotFound";
import ParentProfile from "./pages/ParentProfile";
import PlaydateDetail from "./pages/PlaydateDetail";
import GroupDetail from "./pages/GroupDetail";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/playdates" element={<Playdates />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/connections" element={<Connections />} />
          <Route path="/parent/:id" element={<ParentProfile />} />
          <Route path="/playdate/:id" element={<PlaydateDetail />} />
          <Route path="/group/:id" element={<GroupDetail />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
