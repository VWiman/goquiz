import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/QuizContext";
import { useRouter } from "next/router";

export default function userpage() {
  const router = useRouter();
  const { username } = router.query;

  // Get states from context
  const { stateQuestions, setStateQuestions } = useContext(QuizContext);
  const [clickedChoices, setClickedChoices] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [isScoreSaved, setIsScoreSaved] = useState(false); // State to track if the score is saved

  // Function to handle choice click
  const handleChoiceClick = (questionIndex, choiceIndex, correctIndex) => {
    // Create a copy of clickedChoices state
    const newClickedChoices = [...clickedChoices];
    // Update the clicked status for the clicked choice
    newClickedChoices[questionIndex] = choiceIndex;
    // Update the state
    setClickedChoices(newClickedChoices);
    // Check if the choice is correct
    if (choiceIndex === correctIndex) {
      setCorrectAnswers(correctAnswers + 1);
    }
  };

  // Function to calculate score
  const calculateScore = () => {
    return correctAnswers * 10;
  };

  // Function to handle saving score
  const handleSaveScore = async () => {
    try {
      const score = calculateScore();
      const response = await fetch("/api/userscore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, score }),
      });
      if (response.ok) {
        setIsScoreSaved(true);
        router.back(); // Navigate back to the previous page (home page)
      } else {
        throw new Error("Failed to save score");
      }
    } catch (error) {
      console.error("Error saving score:", error);
    }
  };

  // Shuffle function to randomize array elements
  const shuffle = (array) => {
    for (let index = array.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
    }
    return array;
  };

  // Function to fetch questions from the backend
  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/store");
      const data = await response.json();
      // Shuffle choices for each question
      const shuffledQuestions = data.questions.map((question) => ({
        ...question,
        choices: shuffle(question.choices),
      }));
      // Set the shuffled questions in the context state
      setStateQuestions({ questions: shuffledQuestions });
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  useEffect(() => {
    // Fetch the questions only if username is available
    if (username) {
      // Fetch questions from the backend
      fetchQuestions();
    }
  }, [username]); // Trigger the effect when username changes

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
                      clickedChoices[index] === i
                        ? choice === item.answer
                          ? "bg-green-400"
                          : "bg-red-400"
                        : "bg-gray-300"
                    }`}
                    onClick={() => handleChoiceClick(index, i, item.choices.indexOf(item.answer))}
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
        <p>
          Username: {username} | Correct Answers: {correctAnswers} | Score: {calculateScore()}
        </p>
        {/* Disable the button if the score is already saved */}
        <button onClick={handleSaveScore} disabled={isScoreSaved}>
          Finish & Save My Score
        </button>
      </div>
    </main>
  );
}
