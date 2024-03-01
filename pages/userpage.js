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
    <main className="bg-blue-200 font-mono ">
      <h2 className="text-center pt-10">Welcome, {username}</h2>

      <div className="flex items-start ">
        <div className=" w-2/3  ">
          {/* // Displays the list of questions with their choices */}
          <ul className="flex gap-10 pt-6 pb-10 justify-center ">
            {stateQuestions.questions.map((item, index) => (
              <li key={index} className="shadow-xl ">
                <div className=" flex justify-center ">
                  <h2
                    className="bg-blue-500 w-[100%] rounded-t-xl 
              p-2 text-left text-lg text-slate-50 font-semibold"
                  >
                    {item.question}
                  </h2>
                </div>

                <ul className="p-6 text-sm grid grid-cols-2 gap-3 bg-slate-50 rounded-b-xl ">
                  {item.choices.map((choice, i) => (
                    <li key={i}>
                      <button
                        className={`min-w-[400px] p-2 rounded-xl shadow-lg border-none hover:text-slate-100 ${
                          clickedChoices[index] === i
                            ? choice === item.answer
                              ? "bg-green-400"
                              : "bg-red-400"
                            : "bg-gray-300"
                        }`}
                        onClick={() =>
                          handleChoiceClick(
                            index,
                            i,
                            item.choices.indexOf(item.answer)
                          )
                        }
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
          <div className="flex justify-center">
            {/* Disable the button if the score is already saved */}
            <button
              onClick={handleSaveScore}
              disabled={isScoreSaved}
              className="flex  py-2.5 px-5 me-2 mb-6 text-lg text-gray-900 
              bg-blue-100 border border-gray-200 hover:text-gray-500 hover:underline"
            >
              Finish & Save My Score
            </button>
          </div>
        </div>
        <div className=" flex justify-center w-1/3 pt-6 sticky top-0  ">
          <div className="  bg-blue-100 w-[300px] py-6 text-lg   text-center rounded-xl border border-gray-200">
            <p>Username: {username}</p>
            <p>Correct Answers: {correctAnswers}</p>
            <p>Score: {calculateScore()}</p>
          </div>
        </div>
      </div>
    </main>
  );
}
