import React, { useState } from 'react';

const Exam = ({ quizData }) => {
  const [studentAnswers, setStudentAnswers] = useState(
    Array(quizData.length).fill([])
  );
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
  };

  const handleAnswerChange = (event, questionIndex, option) => {
    const isChecked = event.target.checked;
    setStudentAnswers((prevStudentAnswers) => {
      const updatedStudentAnswers = [...prevStudentAnswers];
      const selectedOptions = updatedStudentAnswers[questionIndex];

      if (isChecked) {
        selectedOptions.push(option);
      } else {
        const optionIndex = selectedOptions.indexOf(option);
        if (optionIndex !== -1) {
          selectedOptions.splice(optionIndex, 1);
        }
      }

      return updatedStudentAnswers;
    });
  };

  const handleRetakeExam = () => {
    setSubmitted(false);
    setStudentAnswers(Array(quizData.length).fill([]));
  };

  if (submitted) {
    return (
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Exam Submitted!</h2>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleRetakeExam}
        >
          Retake Exam
        </button>
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
