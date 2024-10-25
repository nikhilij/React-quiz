import React from "react";
import Options from "./Options";

function Question({ questions, dispatch, answer }) {
  return (
    <>
      <h4>{questions.question}</h4>
      <Options questions={questions} dispatch={dispatch} answer={answer} />
    </>
  );
}
export default Question;
