import { useState, useEffect } from "react";
import { AuthForm } from "@/components/AuthForm";
import { Feed } from "@/components/Feed";

const Index = () => {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("currentUser");
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const handleAuth = (username: string) => {
    setCurrentUser(username);
    localStorage.setItem("currentUser", username);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
  };

  if (!currentUser) {
    return <AuthForm onAuth={handleAuth} />;
  }

  return <Feed currentUser={currentUser} onLogout={handleLogout} />;
};

export default Index;
