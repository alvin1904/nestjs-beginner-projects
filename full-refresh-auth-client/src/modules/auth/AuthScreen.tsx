"use client";

import { useState } from "react";
import AuthViewToggle from "./components/AuthViewToggle";
import LoginView from "./components/LoginView";
import RegisterView from "./components/RegisterView";
import GoogleAuthButton from "./components/GoogleAuthButton";

const AuthScreen = () => {
  const [view, setView] = useState<"signIn" | "signUp">("signIn");
  const toggleView = () => {
    setView((prev) => (prev === "signIn" ? "signUp" : "signIn"));
  };

  return (
    <>
      <AuthViewToggle view={view} toggleView={toggleView} />
      <div className="flex flex-col items-center justify-center gap-3 py-2">
        {view === "signIn" ? (
          <LoginView toggleView={toggleView} />
        ) : (
          <RegisterView toggleView={toggleView} />
        )}
      </div>
      <GoogleAuthButton />
    </>
  );
};

export default AuthScreen;
