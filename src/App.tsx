import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import BottomNav from "@/components/BottomNav";
import HomePage from "./pages/HomePage";
import Journey from "./pages/Journey";
import StepDetail from "./pages/StepDetail";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const onboardingComplete = localStorage.getItem('onboarding_complete');
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/" element={<RequireOnboarding><HomePage /></RequireOnboarding>} />
          <Route path="/journey" element={<RequireOnboarding><Journey /></RequireOnboarding>} />
          <Route path="/step/:id" element={<RequireOnboarding><StepDetail /></RequireOnboarding>} />
          <Route path="/guides" element={<RequireOnboarding><Guides /></RequireOnboarding>} />
          <Route path="/guide/:id" element={<RequireOnboarding><GuideDetail /></RequireOnboarding>} />
          <Route path="/community" element={<RequireOnboarding><Community /></RequireOnboarding>} />
          <Route path="/profile" element={<RequireOnboarding><Profile /></RequireOnboarding>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
