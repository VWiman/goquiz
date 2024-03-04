import { useContext, useEffect, useState } from "react";
import { QuizContext } from "@/context/QuizContext";
import TopList from "@/components/TopList";
import { useRef } from "react";

export default function adminpage({ adminUsername, adminPassword }) {
	// Local state to toggle the editing mode
	const [isEditing, setIsEditing] = useState(false);

	// Local state to manage form data for new or edited question
	const [newQuestion, setNewQuestion] = useState({
		question: "",
		answer: "",
		choiceTwo: "",
		choiceThree: "",
		choiceFour: "",
	});
	// Local state to track what question is being edited
	const [indexBeingEdited, setIndexBeingEdited] = useState(null);

	// Local state for storing admin login information
	const [loginCredentials, setLoginCredentials] = useState({
		username: "",
		password: "",
	});

	// Local state to track if admin is logged in
	const [isLoggedIn, setIsLoggedIn] = useState(false); //admin login

	// Get states from context
	const { stateQuestions, setStateQuestions, isSending, setIsSending } = useContext(QuizContext);

	// Function to fetch questions from the backend
	const fetchQuestions = async () => {
		const response = await fetch("/api/store");
		const data = await response.json();
		console.log(data);
		setStateQuestions(data);
	};

	// Function to update the list of questions and send to backend
	const updateQuestions = async () => {
		const orderedChoices = [newQuestion.answer, newQuestion.choiceTwo, newQuestion.choiceThree, newQuestion.choiceFour];

		const updatedQuestion = {
			question: newQuestion.question,
			choices: orderedChoices,
			answer: newQuestion.answer,
		};

		let updatedQuestionsList = [...stateQuestions.questions];

		if (indexBeingEdited !== null) {
			// Update the question at index that is being edited
			updatedQuestionsList[indexBeingEdited] = updatedQuestion;
		} else {
			// If not editing, push the new question to the list
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

		// Fetch to update UI with latest data
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

	// Handles login form submission and local storage
	const handleLogin = (e) => {
		e.preventDefault();
		const { username, password } = loginCredentials;
		if (username === adminUsername && password === adminPassword) {
			localStorage.setItem("isLoggedIn", "true");
			setIsLoggedIn(true);
		} else {
			alert("Invalid username or password");
		}
	};

	// Check session on page load
	useEffect(() => {
		const session = localStorage.getItem("isLoggedIn");
		if (session === "true") {
			setIsLoggedIn(true);
		}
	}, []);

	// Handle logout
	const handleLogout = () => {
		// Clear session from localStorage
		localStorage.removeItem("isLoggedIn");
		setIsLoggedIn(false);
	};

	// Defines an asynchronous function to handle the deletion of a question from a list.
	const handleDelete = async (e) => {
		// Checks if the user is logged in before allowing deletion
		if (!isLoggedIn) {
			alert("You need to log in to perform this action");
			return;
		}
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

	const myFormRef = useRef(null);

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
		myFormRef.current.scrollIntoView({ behavior: "smooth" });
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
			window.location.reload(); // Refresh the page after delete user scores
		} catch (error) {
			console.error("Error clearing user scores:", error);
		}
	};

	// Renders login form if user is not logged in
	if (!isLoggedIn) {
		return (
			<div>
				<h1>Admin Login</h1>
				<form onSubmit={handleLogin}>
					<label>
						Username:
						<input
							id="adminName"
							name="adminName"
							type="text"
							autoComplete="username"
							value={loginCredentials.username}
							onChange={(e) =>
								setLoginCredentials({
									...loginCredentials,
									username: e.target.value,
								})
							}
						/>
					</label>
					<label>
						Password:
						<input
							id="adminPassword"
							name="adminPassword"
							type="password"
							autoComplete="current-password"
							value={loginCredentials.password}
							onChange={(e) =>
								setLoginCredentials({
									...loginCredentials,
									password: e.target.value,
								})
							}
						/>
					</label>
					<button type="submit">Login</button>
				</form>
			</div>
		);
	}

	// Renders admin page content if user is logged in
	return (
		<main className="bg-blue-200 font-mono">
			<div className="container mx-auto px-3 py-4">
				<div className="flex justify-between py-3">
					<div>
						Welcome back <span className=" font-extrabold">{adminUsername}</span>
					</div>
					<div className="flex gap-2">
						{/* <div>
              <button onClick={handleClearScores}>Clear User Scores</button>
            </div> */}
						<div>
							<button onClick={handleLogout}>Logout</button>
						</div>
					</div>
				</div>
				{/* // The form for creating a new question */}
				<div className="flex flex-col md:flex-row gap-5 my-8">
					<div id="myform" ref={myFormRef} className="addform bg-blue-100  p-5 basis-full md:basis-3/4">
						<h2 className="text-xl font-semibold">Add new question</h2>
						<form id="form" name="form" onSubmit={(e) => handleForm(e)}>
							<div className="w-full">
								<div className=" mb-4">
									<label htmlFor="question">
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

								<div className="mt-5">
									<label htmlFor="answer">
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

									<label htmlFor="choiceTwo">
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

									<label htmlFor="choiceThree">
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

									<label htmlFor="choiceFour">
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

									<div className="justify-end flex mt-2">
										<button
											disabled={isSending}
											type="submit"
											id="submitButton"
											className=" py-2.5 px-5 mt-5 text-lg text-gray-900 bg-blue-100 border border-gray-600  hover:text-gray-500 hover:underline">
											{isEditing ? "Update question" : "Add question"}
										</button>
									</div>
								</div>
							</div>
						</form>
					</div>
					<div className="basis-full md:basis-1/4 bg-blue-100 p-5">
						<TopList />
						<div className="justify-end flex mt-2">
							<button
								className="py-2.5 px-5 mt-5 text-lg text-gray-900 bg-blue-100 border border-gray-600  hover:text-gray-500 hover:underline"
								onClick={handleClearScores}>
								Clear User Scores
							</button>
						</div>
					</div>
				</div>

				{/* // Displays the list of questions with their choices */}
				<div className="qlist mt-4">
					<h2 className="text-xl font-semibold">Published Questions List</h2>
					<ul className="mt-5">
						{stateQuestions.questions.map((item, index) => (
							<li id={index} key={index}>
								<h3 className="text-2xl mb-2 pl-6 pt-6">{item.question}</h3>

								<ul className=" px-6 pt-2 flex flex-col">
									{item.choices.map((choice, i) => (
										<li key={i} className=" w-full">
											{/* Highlights the correct answer in blue and wrong answers in
                  red */}
											<div
												className={`${
													choice == item.answer
														? " border-l-4 border-green-600 bg-blue-50"
														: " border-l-4 border-gray-600 bg-blue-50"
												} pl-2`}>
												{choice}
											</div>
										</li>
									))}
								</ul>
								<div className="flex justify-end gap-3 px-6 mt-2 pb-3">
									<button value={index} onClick={(e) => handleEdit(e)}>
										EDIT
									</button>
									<button value={index} onClick={(e) => handleDelete(e)}>
										DELETE
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			</div>
		</main>
	);
}

export async function getStaticProps() {
	const adminUsername = process.env.ADMIN_USERNAME;
	const adminPassword = process.env.ADMIN_PASSWORD;
	return {
		props: {
			adminUsername,
			adminPassword,
		},
	};
}
