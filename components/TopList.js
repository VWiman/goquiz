// components/TopList.js
import { useState, useEffect } from "react";

export default function TopList() {
  const [topScores, setTopScores] = useState([]);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const response = await fetch("/api/userscore");
        const data = await response.json();
        // Sıralama işlemi
        const sortedScores = data.scores.sort((a, b) => b.score - a.score);
        setTopScores(sortedScores);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  return (
    <div>
      <h2 className=" font-bold text-xl mb-3">Top List</h2>
      <div className=" rounded-md bg-blue-100 p-3">
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="text-sm">Username</th>
              <th className="text-sm">Score</th>
            </tr>
          </thead>
          <tbody>
            {topScores.map((score, index) => (
              <tr
                key={index}
                className="border-b-[0.05em] border-white p-1 mb-2"
              >
                <td className=" text-xs">{score.username}</td>
                <td className=" text-xs">{score.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
