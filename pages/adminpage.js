import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/QuizContext";

export default function adminpage() {
	// set local state

	const [isEditing, setIsEditing] = useState(false);
	const [newQuestion, setNewQuestion] = useState({
		question: "",
		answer: "",
		choiceTwo: "",
		choiceThree: "",
		choiceFour: "",
	});
	const [indexBeingEdited, setIndexBeingEdited] = useState(null);

	// Get states from context
	const { stateQuestions, setStateQuestions, isSending, setIsSending } = useContext(QuizContext);

	// Function to fetch questions from the backend
	const fetchQuestions = async () => {
		const response = await fetch("/api/store");
		const data = await response.json();
		console.log(data);
		setStateQuestions(data);
	};

	// Function to update the list of questions, including the current question being created
	const updateQuestions = async () => {
		const orderedChoices = [newQuestion.answer, newQuestion.choiceTwo, newQuestion.choiceThree, newQuestion.choiceFour];

		const updatedQuestion = {
			question: newQuestion.question,
			choices: orderedChoices,
			answer: newQuestion.answer,
		};

		let updatedQuestionsList = [...stateQuestions.questions];

		if (indexBeingEdited !== null) {
			// Replace the question at the specific index
			updatedQuestionsList[indexBeingEdited] = updatedQuestion;
		} else {
			// If not editing, add the new question to the list
			updatedQuestionsList.push(updatedQuestion);
		}

		const response = await fetch("/api/store", {
			method: "POST",
			body: JSON.stringify({ questions: updatedQuestionsList }),
		});
		const data = await response.json();
		console.log(data);
		setIndexBeingEdited(null);
		setIsEditing(false);
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

	// Defines an asynchronous function to handle the deletion of a question from a list.
	const handleDelete = async (e) => {
		// Copies the current state of questions.
		const currentQuestions = [...stateQuestions.questions];

		// Retrieves the identifier (e.g., index or unique ID) of the question to delete
		// from the event's target value. (index/ID is stored in button value)
		const questionToDelete = isEditing ? e : e.target.value;

		// Filters out the question to delete by comparing each question's index or ID
		// against the `questionToDelete`.
		const questionsAfterDelete = currentQuestions.filter((q) => currentQuestions.indexOf(q) != questionToDelete);

		// Updates the component's state with the new array of questions, without the deleted question.
		setStateQuestions({ questions: questionsAfterDelete });

		// Sends a POST request to a server endpoint with updated questions.
		const response = await fetch("/api/store", {
			method: "POST",
			body: JSON.stringify({ questions: questionsAfterDelete }),
		});

		// Parses the JSON response from the server.
		const data = await response.json();

		console.log(data);

		// Calls a function to re-fetch the list of questions.
		fetchQuestions();
	};

	const handleEdit = (e) => {
		setIsEditing(true);

		const currentQuestions = [...stateQuestions.questions];

		const idToEdit = e.target.value;

		setIndexBeingEdited(idToEdit);

		const questionToEdit = currentQuestions.filter((q) => currentQuestions.indexOf(q) == idToEdit);

		console.log(questionToEdit);

		const data = { ...questionToEdit };

		const question = data[0].question;
		const answer = data[0].answer;
		const choices = data[0].choices;
		const choiceTwo = choices[1];
		const choiceThree = choices[2];
		const choiceFour = choices[3];

		console.log(question, answer, choices);

		setNewQuestion({
			...newQuestion,
			question: question,
			answer: answer,
			choiceTwo: choiceTwo,
			choiceThree: choiceThree,
			choiceFour: choiceFour,
		});
	};

	// Clear all score
	const handleClearScores = async () => {
		try {
			const response = await fetch("/api/userscore", {
				method: "DELETE",
			});
			const data = await response.json();
			console.log(data);
			fetchQuestions();
		} catch (error) {
			console.error("Error clearing user scores:", error);
		}
	};

	return (
		<main className="bg-blue-200 font-mono">
			{/* // The form for creating a new question */}
			<form id="form" name="form" onSubmit={(e) => handleForm(e)}>
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
								}></input>
						</label>
					</div>

					<div className="mt-10">
						<label htmlFor="answer" className="bg-blue-100 p-3 text-2xl mb-6 justify-between">
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
								}></input>
						</label>

						<label htmlFor="choiceTwo" className="bg-blue-100 p-3 text-2xl mb-6 flex justify-between ">
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
								}></input>
						</label>

						<label htmlFor="choiceThree" className="bg-blue-100 p-3 text-2xl mb-6 flex justify-between">
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
								}></input>
						</label>

						<label htmlFor="choiceFour" className="bg-blue-100 p-3 text-2xl flex justify-between mb-6">
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
								}></input>
						</label>

						<div className="w-[600px] justify-center flex">
							<button
								disabled={isSending}
								type="submit"
								id="submitButton"
								className=" py-2.5 px-5 ml-10 mb-2 text-xl  text-gray-900 
           bg-blue-100 border border-gray-200  hover:text-gray-500 hover:underline
           ">
								{isEditing ? "Update question" : "Add question"}
							</button>
						</div>
					</div>
				</div>
			</form>

			{/* // Displays the list of questions with their choices */}
			<ul className="mt-20">
				{stateQuestions.questions.map((item, index) => (
					<li id={index} key={index}>
						<div className=" flex justify-center">
							<h2 className="bg-blue-100 w-fit p-3 text-2xl mb-6  ">{item.question}</h2>
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
										}`}>
										{choice}
									</button>
								</li>
							))}
						</ul>
						<button value={index} onClick={(e) => handleDelete(e)}>
							DELETE
						</button>
						<button value={index} onClick={(e) => handleEdit(e)}>
							EDIT
						</button>
					</li>
				))}
			</ul>
			{/* Button to clear user scores */}
			<div className="mt-10">
				<button onClick={handleClearScores}>Clear User Scores</button>
			</div>
		</main>
	);
}
