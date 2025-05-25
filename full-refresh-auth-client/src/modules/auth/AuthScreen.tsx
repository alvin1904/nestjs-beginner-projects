"use client";

import { useState } from "react";
import AuthViewToggle from "./components/AuthViewToggle";

const AuthScreen = () => {
  const [view, setView] = useState<"signIn" | "signUp">("signIn");
  const toggleView = () => {
    setView((prev) => (prev === "signIn" ? "signUp" : "signIn"));
  };

  return (
    <>
      <AuthViewToggle view={view} toggleView={toggleView} />
    </>
  );
};

export default AuthScreen;
