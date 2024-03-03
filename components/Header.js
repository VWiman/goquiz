import { useEffect, useState } from "react";

const Header = () => {
	// State to check existence of .env.local
	const [fileExist, setFileExist] = useState(false);

	useEffect(() => {
		// On mount we check if the .env.local is present
		async function checkEnv() {
			const res = await fetch("/api/envHandler");
			const data = await res.json();
			setFileExist(data.fileExists);
		}
		checkEnv();
	}, []);

	return (
		<header className="flex w-full h-[40px]  bg-blue-100 py-2 px-10 justify-between font-mono">
			<a href="/" className="hover:text-gray-500 hover:underline">
				GOQUIZ
			</a>
			<div className="flex justify-between gap-7">
				<a href="/" className="hover:text-gray-500 hover:underline">
					Home
				</a>
				{/* If .env.local is present we show admin, if not its hidden. */}
				{fileExist ? (
					<a href="/adminpage" className="hover:text-gray-500 hover:underline">
						Admin
					</a>
				) : (
					<a href="/" onClick={() => alert("You are missing the .env.local file.")} className="hover:text-gray-500 hover:underline">
						Admin
					</a>
				)}
			</div>
		</header>
	);
};

export default Header;
