import { useContext, useEffect } from "react";
import { QuizContext } from "@/context/QuizContext";
export default function userpage() {
  // Get states from context
  const { stateQuestions, setStateQuestions } = useContext(QuizContext);

  // Function to fetch questions from the backend
  const fetchQuestions = async () => {
    const response = await fetch("/api/store");
    const data = await response.json();
    setStateQuestions(data);
  };

  // Fetches the list of questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <main className="bg-slate-50 font-mono ">
      {/* // Displays the list of questions with their choices */}
      <ul className="flex gap-20 py-20">
        {stateQuestions.questions.map((item, index) => (
          <li key={index} className="shadow-xl">
            <div className=" flex justify-center ">
              <h2 className="bg-gradient-to-b from-blue-500 to-blue-700 w-[100%] p-10 text-center text-3xl text-slate-50 font-bold">
                {item.question}
              </h2>
            </div>

            <ul className="p-10  text-2xl grid grid-cols-2 gap-10 bg-slate-50">
              {item.choices.map((choice, i) => (
                <li key={i}>
                  {/* Highlights the correct answer in green and wrong answers in
                  red */}
                  <button
                    className={`${
                      choice == item.answer
                        ? "min-w-[400px] bg-green-400 p-5 rounded-xl shadow-lg border-none"
                        : " min-w-[400px] bg-red-400 p-5 rounded-xl shadow-lg border-none"
                    }`}
                  >
                    {choice}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </main>
  );
}
