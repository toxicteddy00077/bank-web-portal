
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to login page
    navigate("/login");
  }, [navigate]);
  
  return null; // Component doesn't render anything since it redirects
};

export default Index;
