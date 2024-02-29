// Just a start

import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
	const [stateQuestions, setStateQuestions] = useState({ questions: [] });
	const [newQuestion, setNewQuestion] = useState({question: "", answer: "", choiceTwo: "", choiceThree: "", choiceFour: ""});
	// const [question, setQuestion] = useState("");
	// const [answer, setAnswer] = useState("");
	// const [choiceTwo, setChoiceTwo] = useState("");
	// const [choiceThree, setChoiceThree] = useState("");
	// const [choiceFour, setChoiceFour] = useState("");
	const [isSending, setIsSending] = useState(false);
	return (
		<QuizContext.Provider
			value={{
				stateQuestions,
				setStateQuestions,
				newQuestion,
				setNewQuestion,
				isSending,
				setIsSending,
			}}>
			{children}
		</QuizContext.Provider>
	);
};
