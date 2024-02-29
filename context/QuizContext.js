import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
	const [stateQuestions, setStateQuestions] = useState({ questions: [] });
	const [newQuestion, setNewQuestion] = useState({question: "", answer: "", choiceTwo: "", choiceThree: "", choiceFour: ""});
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
