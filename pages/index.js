import TopList from "@/components/TopList";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");

  const [currentFact, setCurrentFact] = useState("");

  const facts = [
    "Who wrote \"Romeo and Juliet\"?",
    "What language is used to style web pages?",
    "What is the largest planet in our solar system?",
    "Who discovered gravity?",
    "Which company created the JavaScript programming language?",
  ];
  const fetchRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * facts.length);
    setCurrentFact(facts[randomIndex]);
  };

  useEffect(() => {
    fetchRandomFact(); // İlk random text'i yüklenirken göster
    const timer = setInterval(() => {
      fetchRandomFact();
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <main className="flex justify-center min-h-svh font-mono bg-blue-200 pt-14 pb-8 px-3 md:px-0">
        <div className="max-w-xl mx-auto">
          <h1 className=" mb-8 text-3xl font-extrabold">Welcome to GoQuiz</h1>
          <div className="bg-zinc-900 rounded-md -mb-4 py-1 px-3 text-white text-xs inline-block -ml-3">Do you know the answer?</div>
          <p className="transition-opacity duration-1000 rounded-md bg-blue-100 text-black p-2">{currentFact}</p>
          <h2 className="mt-5 text-xl font-extrabold">Can you achieve a perfect score?</h2>
          <p className="text-xs mt-4 mb-4">Enter your username and click 'START' to begin. Choose from four options for each question. </p>
          <div className="flex justify-center gap-5 md:gap-10 items-center mt-10 mb-8 flex-col md:flex-row">
            <input
              id="userNameInput"
              name="userNameInput"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="py-2.5 px-5 me-2 mb-2 text-lg text-gray-900 bg-blue-100 border border-gray-200"
            />
            <Link href={`/userpage?username=${username}`}>
              <button
                disabled={!username}
                className={`py-2.5 px-5 me-2 mb-2 text-lg text-gray-900 bg-blue-100 border border-gray-200 hover:text-gray-500 hover:underline ${
                  !username && "cursor-not-allowed opacity-50"
                }`}
              >
                Start Quiz
              </button>
            </Link>
          </div>
          <div className=" mt-5">
            <TopList />
          </div>
        </div>
      </main>
    </>
  );
}
