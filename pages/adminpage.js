import { useEffect, useState } from "react";

export default function adminpage() {
	const [stateQuestions, setStateQuestions] = useState({ questions: [] });
	const [question, setQuestion] = useState("");
	const [answer, setAnswer] = useState("");
	const [choiceTwo, setChoiceTwo] = useState("");
	const [choiceThree, setChoiceThree] = useState("");
	const [choiceFour, setChoiceFour] = useState("");
	const [isSending, setIsSending] = useState(false);

	const fetchQuestions = async () => {
		const response = await fetch("/api/store");
		const data = await response.json();
		console.log(data);
		setStateQuestions(data);
	};

	const updateQuestions = async () => {
		const orderedChoices = [answer, choiceTwo, choiceThree, choiceFour];
		// shuffle fick jag leta upp
		function shuffle(array) {
			for (let index = array.length - 1; index > 0; index--) {
				const randomIndex = Math.floor(Math.random() * (index + 1));
				[array[index], array[randomIndex]] = [array[randomIndex], array[index]];
			}
			return array;
		}
		const randomChoices = shuffle(orderedChoices);
		const newQuestions = { question: question, choices: randomChoices, answer: answer };

		const joinedQuestions = { questions: [...stateQuestions.questions, newQuestions] };

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

	function handleForm(e) {
		if (question != "") {
			setIsSending(true);
			e.preventDefault();
			console.log(e.target.value);
			updateQuestions();
			setQuestion("");
			setAnswer("");
			setChoiceTwo("");
			setChoiceThree("");
			setChoiceFour("");
		} else alert("You need to fill in the question form.");
	}

	useEffect(() => {
		fetchQuestions();
	}, []);

	return (
		<main>
			<form onSubmit={(e) => handleForm(e)}>
				<label htmlFor="question">
					Question:
					<input id="question" name="question" value={question} onChange={(e) => setQuestion(e.target.value)}></input>
				</label>

				<label htmlFor="answer">
					Choice one - Correct answer:
					<input id="answer" name="answer" value={answer} onChange={(e) => setAnswer(e.target.value)}></input>
				</label>

				<label htmlFor="choiceTwo">
					Choice two - Wrong answer:
					<input
						id="choiceTwo"
						name="choiceTwo"
						value={choiceTwo}
						onChange={(e) => setChoiceTwo(e.target.value)}></input>
				</label>

				<label htmlFor="choiceThree">
					Choice three - Wrong answer:
					<input
						id="choiceThree"
						name="choiceThree"
						value={choiceThree}
						onChange={(e) => setChoiceThree(e.target.value)}></input>
				</label>

				<label htmlFor="choiceFour">
					Choice four - Wrong answer:
					<input
						id="choiceFour"
						name="choiceFour"
						value={choiceFour}
						onChange={(e) => setChoiceFour(e.target.value)}></input>
				</label>
				<button disabled={isSending} type="submit" id="submitButton">
					Add question
				</button>
			</form>

			<ul>
				{stateQuestions.questions.map((item, index) => (
					<li key={index}>
						<h2>{item.question}</h2>
						<ul>
							{item.choices.map((choice, i) => (
								<li key={i}>
									<button className={`${choice == item.answer ? "bg-blue-500" : "bg-red-500"}`}>{choice}</button>
								</li>
							))}
						</ul>
					</li>
				))}
			</ul>
		</main>
	);
}
