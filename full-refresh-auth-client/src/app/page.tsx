import { useState } from "react";

export default function Home() {
  const [view, setView] = useState<"signin" | "signup">("signin");
  return (
    <main className="h-screen w-screen overflow-x-hidden bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-8 backdrop-blur-md w-[350px]">
          <div className="w-[80%] h-14 rounded-md relative flex items-center text-black p-1 justify-center gap-1 bg-white/20">
            <div className="flex-1 text-center cursor-pointer">Sign in</div>
            <div className="flex-1 text-center cursor-pointer">Sign up</div>
            <div className="absolute h-[85%] w-1/2 bg-white/60 -z-1 left-0 m-1 rounded-sm"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
