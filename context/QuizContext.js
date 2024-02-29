// Just a start

import { createContext, useState } from "react";

export const QuizContext = createContext();

export const QuizProvider = ({ children }) => {
  const [qaPairs, setQAPairs] = useState([]);
  const [userSelection, setUserSelection] = useState("");
  const [adminAction, setAdminAction] = useState("");

  return (
    <QuizContext.Provider
      value={{
        qaPairs,
        setQAPairs,
        userSelection,
        setUserSelection,
        adminAction,
        setAdminAction,
      }}
    >
      {children}
    </QuizContext.Provider>
  );
};
