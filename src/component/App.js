import Timer from "./Timer";
import React, { useEffect, useReducer } from "react";
import Header from "./Header";
import Main from "./Main";
import Loader from "./Loader";
import Error from "./Error";
import StartScreen from "./StartScreen";
import Question from "./Question";
import "../index.css";
import Footer from "./Footer";
import NextButton from "./NextButton";
import Progress from "./Progress";
import FinishScreen from "./FinishScreen";
const initalState = {
  questions: [],
  // loading ,error,  ready , active , finished,
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaining: null,
};

const SEC_PER_QUESTION = 30;
function reducer(state, action) {
  switch (action.type) {
    case "dataReceived":
      return {
        ...state,
        questions: action.payload,
        status: "ready",
      };

    case "dataFailed":
      return {
        ...state,
        status: "error",
      };

    case "start":
      const secondsRemaining = state.questions.length * SEC_PER_QUESTION;
      localStorage.setItem(
        "quizState",
        JSON.stringify({ ...state, status: "active", secondsRemaining })
      );
      return { ...state, status: "active", secondsRemaining };

    case "newAnswer":
      const question = state.questions[state.index];
      const newPoints =
        action.payload === question.correctOption
          ? state.points + question.points
          : state.points;
      const updatedState = {
        ...state,
        answer: action.payload,
        points: newPoints,
      };
      localStorage.setItem("quizState", JSON.stringify(updatedState));
      return updatedState;

    case "nextquestion":
      const nextState = { ...state, index: state.index + 1, answer: null };
      localStorage.setItem("quizState", JSON.stringify(nextState));
      return nextState;

    case "finish":
      const finishedState = {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore,
      };
      localStorage.setItem("quizState", JSON.stringify(finishedState));
      return finishedState;

    case "restart":
      localStorage.removeItem("quizState");
      return {
        ...initalState,
        questions: state.questions,
        status: "ready",
      };

    case "tick":
      const tickState = {
        ...state,
        secondsRemaining: state.secondsRemaining - 1,
        status: state.secondsRemaining === 0 ? "finished" : state.status,
      };
      localStorage.setItem("quizState", JSON.stringify(tickState));
      return tickState;

    default:
      throw new Error("Action unknown");
  }
}

function App() {
  const savedState = localStorage.getItem("quizState");
  const initialStateFromLocalStorage = savedState
    ? JSON.parse(savedState)
    : initalState;

  const [
    { questions, status, index, answer, points, highscore, secondsRemaining },
    dispatch,
  ] = useReducer(reducer, initialStateFromLocalStorage);

  const len = questions.length;
  const maxPoints = questions.reduce((acc, curr) => acc + curr.points, 0);

  useEffect(
    function () {
      if (!savedState) {
        fetch(`http://localhost:8000/questions`)
          .then((res) => res.json())
          .then((data) => dispatch({ type: "dataReceived", payload: data }))
          .catch((err) => dispatch({ type: "dataFailed" }));
      }
    },
    [savedState]
  );

  return (
    <>
      <div className="app">
        <Header />
        <Main>
          {status === "loading" && <Loader />}
          {status === "error" && <Error />}
          {status === "ready" && (
            <StartScreen length={len} dispatch={dispatch} />
          )}
          {status === "active" && (
            <>
              <Progress
                index={index}
                length={len}
                points={points}
                maxPoints={maxPoints}
                answer={answer}
              />
              <Question
                dispatch={dispatch}
                answer={answer}
                questions={questions[index]}
              />
              <Footer>
                <Timer
                  dispatch={dispatch}
                  secondsRemaining={secondsRemaining}
                />
                <NextButton
                  dispatch={dispatch}
                  answer={answer}
                  length={len}
                  index={index}
                />
              </Footer>
            </>
          )}
          {status === "finished" && (
            <FinishScreen
              points={points}
              maxPoints={maxPoints}
              highscore={highscore}
              dispatch={dispatch}
            />
          )}
        </Main>
      </div>
    </>
  );
}

export default App;
