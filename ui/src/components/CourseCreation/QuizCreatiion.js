import React from "react";

const QuizCreator = ({
  handleQuizUpdate,
  moduleIndex,
  topicIndex,
  quizData,
}) => {
  // const [quizData, setQuizData] = useState( [
  //   {
  //     question: '',
  //     options: [''],
  //     correctOptions: [],
  //   },
  // ]);
  // useEffect(() => {

  // }, [quizData])

  if (quizData === undefined || quizData == null) {
    handleQuizUpdate(
      [
        {
          question: "",
          options: [""],
          correctOptions: [],
        },
      ],
      moduleIndex,
      topicIndex
    );
    return null;
  }
  const handleQuestionChange = (event, index) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[index].question = event.target.value;
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  const handleOptionChange = (event, questionIndex, optionIndex) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[questionIndex].options[optionIndex] = event.target.value;
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  const addQuestion = () => {
    handleQuizUpdate(
      [
        ...quizData,
        {
          question: "",
          options: [""],
          correctOptions: [],
        },
      ],
      moduleIndex,
      topicIndex
    );
  };

  const deleteQuestion = (index) => {
    const updatedQuizData = [...quizData];
    updatedQuizData.splice(index, 1);
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  const addOption = (questionIndex) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[questionIndex].options.push("");
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  const deleteOption = (questionIndex, optionIndex) => {
    const updatedQuizData = [...quizData];
    updatedQuizData[questionIndex].options.splice(optionIndex, 1);
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  const handleCorrectOptionChange = (event, questionIndex, optionIndex) => {
    const updatedQuizData = [...quizData];
    const optionValue = `${quizData[questionIndex].options[optionIndex]}`;
    const optionIndexInCorrectOptions =
      updatedQuizData[questionIndex].correctOptions.indexOf(optionValue);

    if (event.target.checked) {
      if (optionIndexInCorrectOptions === -1) {
        updatedQuizData[questionIndex].correctOptions.push(optionValue);
      }
    } else {
      if (optionIndexInCorrectOptions !== -1) {
        updatedQuizData[questionIndex].correctOptions.splice(
          optionIndexInCorrectOptions,
          1
        );
      }
    }
    handleQuizUpdate(updatedQuizData, moduleIndex, topicIndex);
  };

  return (
    <div className="container mx-auto px-4">
      {quizData.map((question, questionIndex) => (
        <div key={questionIndex} className="my-4">
          <label className="font-semibold">Question {questionIndex + 1}</label>
          <input
            type="text"
            className="block w-full p-2 border rounded mt-2"
            placeholder="Enter question"
            value={question.question}
            onChange={(event) => handleQuestionChange(event, questionIndex)}
          />

          {question.options.map((option, optionIndex) => (
            <div key={optionIndex} className="flex py-2">
              <input
                type="checkbox"
                className="mr-2 w-5 ml-5"
                checked={question.correctOptions.includes(option)}
                onChange={(event) =>
                  handleCorrectOptionChange(event, questionIndex, optionIndex)
                }
              />
              <input
                type="text"
                className="block w-full p-2 border rounded"
                placeholder="Enter option"
                value={option}
                onChange={(event) =>
                  handleOptionChange(event, questionIndex, optionIndex)
                }
              />
              <button
                type="button"
                className="ml-2 text-red-500 remove_button"
                onClick={() => deleteOption(questionIndex, optionIndex)}
                disabled={question.options.length === 1}
              >
                Delete Option
              </button>
            </div>
          ))}

          <button
            type="button"
            className="my-2"
            onClick={() => addOption(questionIndex)}
          >
            Add Option
          </button>

          <button
            type="button"
            className="text-red-500 ml-2 remove_button"
            onClick={() => deleteQuestion(questionIndex)}
            disabled={quizData.length === 1}
          >
            Delete Question
          </button>
        </div>
      ))}

      <button type="button" className="my-4" onClick={addQuestion}>
        Add Question
      </button>
    </div>
  );
};

export default QuizCreator;
