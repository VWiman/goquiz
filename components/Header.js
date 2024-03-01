const Header = () => {
  return (
    <header className="flex w-full h-[40px]  bg-blue-100 py-2 px-10 justify-between font-mono">
      <a href="/" className="hover:text-gray-500 hover:underline">
        GOQUIZ
      </a>
      <div className="flex justify-between gap-7">
        <a href="/" className="hover:text-gray-500 hover:underline">
          Home
        </a>
        <a href="/adminpage" className="hover:text-gray-500 hover:underline">
          Admin
        </a>
      </div>
    </header>
  );
};

export default Header;
