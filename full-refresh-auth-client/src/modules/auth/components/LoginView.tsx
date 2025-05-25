type LoginViewProps = {
  toggleView: () => void;
};

const LoginView = ({ toggleView }: LoginViewProps) => {
  return (
    <>
      <input
        className="h-12 w-full bg-white text-black px-3 focus:outline-none rounded text-sm"
        type="email"
        placeholder="Email"
      />
      <input
        className="h-12 w-full bg-white text-black px-3 focus:outline-none rounded text-sm"
        type="password"
        placeholder="Password"
      />
      <button className="w-full bg-black h-12 text-white rounded text-sm hover:bg-black/70 transition-all ease-in-out duration-300">
        Sign In
      </button>
    </>
  );
};

export default LoginView;
