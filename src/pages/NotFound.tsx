import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="text-center space-y-4">
        <div className="text-8xl">🎪</div>
        <h1 className="text-4xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">
          Oops! This page got lost at the festival.
        </p>
        <Button onClick={() => navigate("/")} className="touch-target">
          <Home className="h-4 w-4 mr-2" />
          Back to POS
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
