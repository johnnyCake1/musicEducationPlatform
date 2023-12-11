import React, { useState } from 'react';

const Exam = ({ quizData, nextAllowed = () => {} }) => {
  const [studentAnswers, setStudentAnswers] = useState(
    Array(quizData.length).fill([])
  );
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const calculateScore = () => {
    const totalQuestions = quizData.length;
    let correctAnswers = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const question = quizData[i];
      const studentAnswer = studentAnswers[i];
      const correctOptions = question.correctOptions.map(
        (opt) => opt.split(') ')[1]
      ); // Extract correct option values

      if (
        studentAnswer.every((ans) => correctOptions.includes(ans)) &&
        studentAnswer.length === correctOptions.length
      ) {
        correctAnswers++;
      }
    }

    return (correctAnswers / totalQuestions) * 100;
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    // // Calculate score
    // const totalCorrectAnswers = studentAnswers.reduce(
    //   (total, answers, index) => {
    //     const correctOptions = quizData[index].correctOptions.map(
    //       (opt) => opt.split(') ')[1]
    //     ); // Extracting option value

    //     console.log('correctOptions', correctOptions);
    //     return total + answers.every((ans) => correctOptions.includes(ans)) &&
    //       answers.length === correctOptions.length
    //       ? 1
    //       : 0;

    //   },
    //   0
    // );
    const totalQuestions = quizData.length;
    let correctAnswers = 0;

    for (let i = 0; i < totalQuestions; i++) {
      const question = quizData[i];
      const studentAnswer = studentAnswers[i];
      const correctOptions = question.correctOptions;
      if (
        studentAnswer.every((ans) => correctOptions.includes(ans)) &&
        studentAnswer.length === correctOptions.length
      ) {
        correctAnswers++;
      }
    }

    // return (correctAnswers / totalQuestions) * 100;
    // console.log('totalCorrectAnswers', totalCorrectAnswers);

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    setScore(scorePercentage);
    if (scorePercentage >= 80) {
      nextAllowed(true);
    }
    // Pass score to parent
  };

  const handleAnswerChange = (event, questionIndex, option) => {
    const isChecked = event.target.checked;

    setStudentAnswers((prevStudentAnswers) => {
      // Create a deep copy of the array
      const updatedStudentAnswers = prevStudentAnswers.map((answers) => [
        ...answers,
      ]);

      if (isChecked) {
        // Replace the answers array for the question with the new selection
        updatedStudentAnswers[questionIndex] = [option];
      } else {
        // If the option is unchecked, clear the selection
        updatedStudentAnswers[questionIndex] = [];
      }
      return updatedStudentAnswers;
    });
  };

  const handleRetakeExam = () => {
    setSubmitted(false);
    setStudentAnswers(Array(quizData.length).fill([]));
  };

  if (submitted) {
    const scorePercentage = score;
    const resultText =
      scorePercentage >= 80
        ? 'Congratulations! You have passed the exam.'
        : 'You did not score high enough to pass. Please try again.';

    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Exam Submitted!</h2>
        <p className="mb-4">Your score: {scorePercentage.toFixed(2)}%</p>
        <p className="mb-4">{resultText}</p>
        {scorePercentage < 80 && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleRetakeExam}
          >
            Retake Exam
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSubmit}>
        {quizData.map((question, questionIndex) => (
          <div key={questionIndex} className="my-4">
            <label className="font-semibold">
              Question {questionIndex + 1}
            </label>
            <p>{question.question}</p>

            <div className="space-y-2 mt-1">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 w-7"
                    id={`question${questionIndex}-option${optionIndex}`}
                    value={option}
                    onChange={(event) =>
                      handleAnswerChange(event, questionIndex, option)
                    }
                    checked={studentAnswers[questionIndex].includes(option)}
                    disabled={submitted}
                  />
                  <label
                    htmlFor={`question${questionIndex}-option${optionIndex}`}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          disabled={submitted}
        >
          Submit Exam
        </button>
      </form>
    </div>
  );
};

export default Exam;
