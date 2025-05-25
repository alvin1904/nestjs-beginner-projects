import AuthScreen from "@/modules/auth/AuthScreen";

export default function Home() {
  return (
    <main className="h-screen w-screen overflow-x-hidden bg-[url('/bg.webp')] bg-cover bg-center">
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-white/10 p-8 backdrop-blur-md w-[350px]">
          <AuthScreen />
        </div>
      </div>
    </main>
  );
}
