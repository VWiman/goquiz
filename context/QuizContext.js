import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [stateQuestions, setStateQuestions] = useState({ questions: [] });

  const [isSending, setIsSending] = useState(false);

  const fetchQuestions = async () => {
    try {
      const response = await fetch("/api/store");
      const data = await response.json();
      setStateQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  return (
    <QuizContext.Provider
      value={{
        stateQuestions,
        setStateQuestions,
        isSending,
        setIsSending,
        fetchQuestions, // new fetchQuestions function
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
