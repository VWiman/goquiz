// Just a start

import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [stateQuestions, setStateQuestions] = useState({ questions: [] });
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [choiceTwo, setChoiceTwo] = useState("");
  const [choiceThree, setChoiceThree] = useState("");
  const [choiceFour, setChoiceFour] = useState("");
  const [isSending, setIsSending] = useState(false);
  return (
    <QuizContext.Provider
      value={{
        stateQuestions,
        setStateQuestions,
        question,
        setQuestion,
        answer,
        setAnswer,
        choiceTwo,
        setChoiceTwo,
        choiceThree,
        setChoiceThree,
        choiceFour,
        setChoiceFour,
        isSending,
        setIsSending,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
