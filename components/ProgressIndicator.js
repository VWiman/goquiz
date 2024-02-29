import { QuizContext } from "../../context/QuizContext";

export default function ProgressIndicator() {
  const { qaPairs } = useContext(QuizContext);
  const totalQuestions = qaPairs.length;
  const { answeredQuestions } = useContext(QuizContext);
  const answeredCount = answeredQuestions.length;
  const progress = (answeredCount / totalQuestions) * 100;

  return (
    <div>
      <h2>Progress: {progress}%</h2>
      <p>
        Answered: {answeredCount} / {totalQuestions}
      </p>
    </div>
  );
}
