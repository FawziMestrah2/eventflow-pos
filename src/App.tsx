import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useStore";
import PinLogin from "@/components/PinLogin";
import POSScreen from "@/pages/POSScreen";
import ReturnsScreen from "@/pages/ReturnsScreen";
import ProductsScreen from "@/pages/ProductsScreen";
import ReportsScreen from "@/pages/ReportsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected route wrapper
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Auth route wrapper (redirect if already logged in)
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
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
          <Route 
            path="/login" 
            element={
              <AuthRoute>
                <PinLogin />
              </AuthRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <POSScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/returns" 
            element={
              <ProtectedRoute>
                <ReturnsScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/products" 
            element={
              <ProtectedRoute>
                <ProductsScreen />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/reports" 
            element={
              <ProtectedRoute>
                <ReportsScreen />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
