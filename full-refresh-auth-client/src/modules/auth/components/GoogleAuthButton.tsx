const GoogleAuthButton = () => {
  return (
    <div className="h-12 w-[80%] flex items-center justify-center">
      <button className="bg-black text-white cursor-pointer hover:bg-black/70 transition-all ease-in-out duration-300 rounded-md text-sm w-full h-full flex items-center justify-center gap-2">
        <img src="/google.png" alt="G" className="w-6 h-6" />
        <span>Sign in with Google</span>
      </button>
    </div>
  );
};

export default GoogleAuthButton;
