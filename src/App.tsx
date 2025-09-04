
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import IntakeForm from "./pages/IntakeForm";
import RoleBasedDashboard from "./components/RoleBasedDashboard";
import LARSAMA from "./pages/LARSAMA";
import LLP from "./pages/LLP";
import LARSManager from "./pages/LARSManager";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/intake" element={<IntakeForm />} />
          <Route path="/dashboard" element={<RoleBasedDashboard />} />
          <Route path="/lars-ama" element={<LARSAMA />} />
          <Route path="/llp" element={<LLP />} />
          <Route path="/lars-manager" element={<LARSManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
