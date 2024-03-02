import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/QuizContext";
import { useRouter } from "next/router";
import TopList from "@/components/TopList";

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
      <div className="container mx-auto px-3 py-4">
        <h2 className="pt-10 font-semibold text-xl mb-5">
          Welcome, {username}
        </h2>
        <div className=" flex md:hidden gap-2 bg-blue-200 py-1 sticky top-0 text-xs mb-3 justify-between">
          <p>Correct Answers: {correctAnswers}</p>
          <p>Score: {calculateScore()}</p>
        </div>
        <div className="flex flex-col md:flex-row items-start gap-7">
          <div className="basis-full md:basis-9/12 ">
            {/* // Displays the list of questions with their choices */}
            <ul className="flex flex-col gap-10 pb-10 justify-center ">
              {stateQuestions.questions.map((item, index) => (
                <li key={index} className="shadow-xl ">
                  <div className=" flex justify-center ">
                    <h3
                      className="bg-blue-500 w-[100%] rounded-t-xl 
              p-2 pl-6 text-left text-lg text-slate-50 font-semibold"
                    >
                      {item.question}
                    </h3>
                  </div>

                  <ul className="p-6 text-sm grid grid-cols-2 gap-3 bg-slate-50 rounded-b-xl ">
                    {item.choices.map((choice, i) => (
                      <li key={i}>
                        <button
                          className={` min-w-full p-2 rounded-xl hover:shadow-md hover:shadow-blue-500/20 border-none hover:text-blue-600 ${
                            clickedChoices[index] === i
                              ? choice === item.answer
                                ? "bg-green-400"
                                : "bg-red-400"
                              : "bg-gray-200"
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
          <div className="hidden md:block md:basis-3/12 sticky top-0  ">
            <div className=" bg-blue-100 py-6 px-4 text-base rounded-md border border-gray-200">
              <p className="font-semibold mb-2">{username}´s Status</p>
              <p>Correct Answers: {correctAnswers}</p>
              <p>Score: {calculateScore()}</p>
            </div>
            <div className=" mt-4">
              <TopList />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
