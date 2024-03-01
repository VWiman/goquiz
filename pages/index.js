import Header from "@/components/Header";
import TopList from "@/components/TopList";
import Link from "next/link";
import { useState } from "react";

export default function Home() {
  const [username, setUsername] = useState("");

  return (
    <>
      <main className="flex justify-center items-center h-screen font-mono bg-blue-200">
        <div className="max-w-5xl mx-auto">
          <h1 className=" mb-4 text-2xl font-extrabold">Welcome to GoQuiz</h1>
          <p className="text-base">Some short text here</p>
          <div className="flex justify-center gap-10 items-center mt-3">
            <input
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
