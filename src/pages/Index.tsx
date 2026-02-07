// Update this page (the content is just a fallback if you fail to update the page)

import { Navigate } from "react-router-dom";

const Index = () => {
  // Redirect to the POS screen (handled by App.tsx routing)
  return <Navigate to="/" replace />;
};

export default Index;
