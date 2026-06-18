import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "./PageLoader";

function PageTransition({ children }) {
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setLoading(true);
    }, 0);

    const endTimer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(endTimer);
    };
  }, [location.pathname]);

  if (loading) {
    return <PageLoader />;
  }

  return children;
}

export default PageTransition;