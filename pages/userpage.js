import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/QuizContext";
export default function userpage() {
  // Get states from context
  const { stateQuestions, setStateQuestions } = useContext(QuizContext);

  // Create State for clicked choices
  const [clickedChoices, setClickedChoices] = useState([]);

  // Function to handle choice click
  const handleChoiceClick = (questionIndex, choiceIndex) => {
    // Create a copy of clickedChoices state
    const newClickedChoices = [...clickedChoices];
    // Update the clicked status for the clicked choice
    newClickedChoices[questionIndex] = choiceIndex;
    // Update the state
    setClickedChoices(newClickedChoices);
  };

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
                  <button
                    className={`min-w-[400px] p-5 rounded-xl shadow-lg border-none ${
                      // Check if choice is clicked and mark it accordingly
                      clickedChoices[index] === i
                        ? choice === item.answer
                          ? "bg-green-400"
                          : "bg-red-400"
                        : "bg-gray-300"
                    }`}
                    // Attach click event handler
                    onClick={() => handleChoiceClick(index, i)}
                    // Disable the button after it's clicked
                    disabled={clickedChoices[index] !== undefined}
                  >
                    {choice}
                  </button>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <div>
        <p>Antal rätt svar: {}</p>
      </div>
    </main>
  );
}
