import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import BottomNav from "@/components/BottomNav";
import AppHeader from "@/components/AppHeader";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import Journey from "./pages/Journey";
import StepDetail from "./pages/StepDetail";
import Guides from "./pages/Guides";
import GuideDetail from "./pages/GuideDetail";
import Community from "./pages/Community";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import AuthPage from "./pages/AuthPage";
import ResetPassword from "./pages/ResetPassword";
import NotFound from "./pages/NotFound";
import AdminLayout from "./pages/AdminLayout";
import AdminSteps from "./pages/AdminSteps";
import AdminGuides from "./pages/AdminGuides";
import AdminCorridors from "./pages/AdminCorridors";
import AdminCommunity from "./pages/AdminCommunity";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

const RequireOnboarding = ({ children }: { children: React.ReactNode }) => {
  const onboardingComplete = localStorage.getItem('onboarding_complete');
  // Check both localStorage (fast) and will be overridden by DB check in profile hook
  if (!onboardingComplete) {
    return <Navigate to="/onboarding" replace />;
  }
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, loading } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={user && !loading ? <Navigate to="/dashboard" replace /> : <AuthPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/guides" element={<Guides />} />
        <Route path="/guide/:id" element={<GuideDetail />} />

        {/* Protected routes */}
        <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><RequireOnboarding><HomePage /></RequireOnboarding></ProtectedRoute>} />
        <Route path="/journey" element={<ProtectedRoute><RequireOnboarding><Journey /></RequireOnboarding></ProtectedRoute>} />
        <Route path="/step/:id" element={<ProtectedRoute><RequireOnboarding><StepDetail /></RequireOnboarding></ProtectedRoute>} />
        <Route path="/community" element={<ProtectedRoute><RequireOnboarding><Community /></RequireOnboarding></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><RequireOnboarding><Profile /></RequireOnboarding></ProtectedRoute>} />

        {/* Admin routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<AdminSteps />} />
          <Route path="steps" element={<AdminSteps />} />
          <Route path="guides" element={<AdminGuides />} />
          <Route path="corridors" element={<AdminCorridors />} />
          <Route path="community" element={<AdminCommunity />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <AppHeader />
      <BottomNav />
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
