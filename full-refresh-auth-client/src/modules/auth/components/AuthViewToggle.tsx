import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);

type AuthViewToggleProps = {
  view: "signIn" | "signUp";
  toggleView: () => void;
};

const AuthViewToggle = ({ view, toggleView }: AuthViewToggleProps) => {
  const containerRef = useRef(null);
  const barRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!barRef.current) return;

      const shrinkWidth = gsap.to(barRef.current, {
        width: "25%", // half of current width (50% => 25%)
        duration: 0.2,
        ease: "power2.inOut",
      });

      const targetLeft = view === "signIn" ? "0%" : "50%";

      const expandAndMove = () => {
        if (!barRef.current) return;
        gsap.to(barRef.current, {
          width: "calc(50% - 0.5rem)",
          left: targetLeft,
          duration: 0.4,
          ease: "power2.inOut",
        });
      };

      shrinkWidth.eventCallback("onComplete", expandAndMove);
    },
    { dependencies: [view], scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="w-[80%] h-10 rounded-md relative flex items-center text-black p-1 justify-center gap-1 bg-white/30 select-none backdrop-blur-sm"
    >
      <div
        className="flex-1 text-center cursor-pointer h-full flex items-center justify-center transition-colors duration-200 ease-in-out"
        onClick={() => view !== "signIn" && toggleView()}
        style={{ color: view === "signIn" ? "#000000" : "#00000060" }}
      >
        Sign in
      </div>
      <div
        className="flex-1 text-center cursor-pointer h-full flex items-center justify-center transition-colors duration-200 ease-in-out"
        onClick={() => view !== "signUp" && toggleView()}
        style={{ color: view === "signUp" ? "#000000" : "#00000060" }}
      >
        Sign up
      </div>
      <div
        ref={barRef}
        className="absolute h-[85%] bg-white/60 backdrop-blur-md left-0 m-1 rounded-sm -z-1 shadow-sm"
        style={{ width: "calc(50% - 0.5rem)" }}
      ></div>
    </div>
  );
};

export default AuthViewToggle;
