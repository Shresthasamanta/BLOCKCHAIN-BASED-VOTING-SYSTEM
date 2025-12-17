import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ElectionProvider } from "@/contexts/ElectionContext";
import { MainLayout } from "@/components/layout/MainLayout";
import Landing from "./pages/Landing";
import Elections from "./pages/Elections";
import VotingBooth from "./pages/VotingBooth";
import Results from "./pages/Results";
import VerifyVote from "./pages/VerifyVote";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ElectionProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Landing />} />
                <Route path="/elections" element={<Elections />} />
                <Route path="/elections/:id" element={<VotingBooth />} />
                <Route path="/results" element={<Results />} />
                <Route path="/results/:id" element={<Results />} />
                <Route path="/verify" element={<VerifyVote />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/auth" element={<Auth />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ElectionProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
