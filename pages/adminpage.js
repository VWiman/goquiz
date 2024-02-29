import { useContext, useEffect } from "react";
import { QuizContext } from "@/context/QuizContext";
export default function adminpage() {
  // Get states from context
  const {
    stateQuestions,
    setStateQuestions,
    newQuestion,
    setNewQuestion,
    isSending,
    setIsSending,
  } = useContext(QuizContext);

  // Function to fetch questions from the backend
  const fetchQuestions = async () => {
    const response = await fetch("/api/store");
    const data = await response.json();
    console.log(data);
    setStateQuestions(data);
  };

  // Function to update the list of questions, including the current question being created
  const updateQuestions = async () => {
    const orderedChoices = [
      newQuestion.answer,
      newQuestion.choiceTwo,
      newQuestion.choiceThree,
      newQuestion.choiceFour,
    ];
    // Shuffles the array of choices to randomize their order
    function shuffle(array) {
      for (let index = array.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1));
        [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
      }
      return array;
    }
    const randomChoices = shuffle(orderedChoices);
    const updatedNewQuestions = {
      question: newQuestion.question,
      choices: randomChoices,
      answer: newQuestion.answer,
    };

    const joinedQuestions = {
      questions: [...stateQuestions.questions, updatedNewQuestions],
    };

    console.log(joinedQuestions);

    const response = await fetch("/api/store", {
      method: "POST",
      body: JSON.stringify(joinedQuestions),
    });
    const data = await response.json();
    console.log(data);
    setIsSending(false);
    fetchQuestions();
  };

  // Handles form submission, validates the question, and triggers question update
  function handleForm(e) {
    if (newQuestion.question != "") {
      setIsSending(true);
      e.preventDefault();
      console.log(e.target.value);
      updateQuestions();
      // Resets the form fields after submission
      const resetNewQuestion = { ...newQuestion };
      for (const key in resetNewQuestion) {
        resetNewQuestion[key] = "";
      }
      setNewQuestion(resetNewQuestion);
    } else alert("You need to fill in the question form.");
  }

  // Fetches the list of questions when the component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  return (
    <main className="bg-blue-200 font-mono">
      {/* // The form for creating a new question */}
      <form onSubmit={(e) => handleForm(e)}>
        <div className="flex justify-between w-full px-20  ">
          <div className="flex items-center text-2xl">
            <label htmlFor="question" className="bg-blue-100 p-3 text-2xl mb-6">
              Question:
              <input
                id="question"
                name="question"
                value={newQuestion.question}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    question: e.target.value,
                  })
                }
              ></input>
            </label>
          </div>

          <div className="mt-10">
            <label
              htmlFor="answer"
              className="bg-blue-100 p-3 text-2xl mb-6 justify-between"
            >
              Choice one - Correct answer:
              <input
                id="answer"
                name="answer"
                value={newQuestion.answer}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    answer: e.target.value,
                  })
                }
              ></input>
            </label>

            <label
              htmlFor="choiceTwo"
              className="bg-blue-100 p-3 text-2xl mb-6 flex justify-between "
            >
              Choice two - Wrong answer:
              <input
                id="choiceTwo"
                name="choiceTwo"
                value={newQuestion.choiceTwo}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    choiceTwo: e.target.value,
                  })
                }
              ></input>
            </label>

            <label
              htmlFor="choiceThree"
              className="bg-blue-100 p-3 text-2xl mb-6 flex justify-between"
            >
              Choice three - Wrong answer:
              <input
                id="choiceThree"
                name="choiceThree"
                value={newQuestion.choiceThree}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    choiceThree: e.target.value,
                  })
                }
              ></input>
            </label>

            <label
              htmlFor="choiceFour"
              className="bg-blue-100 p-3 text-2xl flex justify-between mb-6"
            >
              Choice four - Wrong answer:
              <input
                id="choiceFour"
                name="choiceFour"
                value={newQuestion.choiceFour}
                onChange={(e) =>
                  setNewQuestion({
                    ...newQuestion,
                    choiceFour: e.target.value,
                  })
                }
              ></input>
            </label>

            <div className="w-[600px] justify-center flex">
              <button
                disabled={isSending}
                type="submit"
                id="submitButton"
                className=" py-2.5 px-5 ml-10 mb-2 text-xl  text-gray-900 
           bg-blue-100 border border-gray-200  hover:text-gray-500 hover:underline
           "
              >
                Add question
              </button>
            </div>
          </div>
        </div>
      </form>
      {/* // Displays the list of questions with their choices */}
      <ul className="mt-20">
        {stateQuestions.questions.map((item, index) => (
          <li key={index}>
            <div className=" flex justify-center">
              <h2 className="bg-blue-100 w-fit p-3 text-2xl mb-6  ">
                {item.question}
              </h2>
            </div>

            <ul className="p-6  text-2xl mb-6 grid grid-cols-2 ">
              {item.choices.map((choice, i) => (
                <li key={i}>
                  {/* Highlights the correct answer in blue and wrong answers in
                  red */}
                  <button
                    className={`${
                      choice == item.answer
                        ? "min-w-[500px] bg-blue-500/60 p-4 rounded-xl shadow-2xl m-4 border-none"
                        : " min-w-[500px] bg-red-500/90 border-none p-4 rounded-xl shadow-2xl m-4 "
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
