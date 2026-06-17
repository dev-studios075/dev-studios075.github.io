import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Seo from "@/components/seo/Seo";
import { SITE_NAME } from "@/lib/site";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground relative">
      <Seo
        title={`Page Not Found | ${SITE_NAME}`}
        description="The requested page could not be found."
        noindex
      />
      <div className="absolute inset-0 grid-bg pointer-events-none" />
      <div className="text-center relative">
        <h1 className="font-display text-7xl font-bold text-gradient-primary mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Oops! Page not found</p>
        <Button asChild variant="hero" size="lg">
          <Link to="/">
            <ArrowLeft className="w-4 h-4" />
            Return to Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
