function FinishScreen({ points, maxPoints, highscore, dispatch }) {
  const percentage = (points / maxPoints) * 100;

  let emoji;
  if (percentage === 100) emoji = "🏅";
  if (percentage >= 80 && percentage < 100) emoji = "🎉";
  if (percentage >= 60 && percentage < 80) emoji = "😊";
  if (percentage >= 40 && percentage < 60) emoji = "😐";
  if (percentage >= 20 && percentage < 40) emoji = "😔";
  if (percentage < 20) emoji = "😢";
  return (
    <>
      <p className="result">
        <span>{emoji}</span> you Scored <strong>{points}</strong> out of{" "}
        {maxPoints} ({Math.ceil(percentage)}%)
      </p>
      <p className="highscore">
        (Highscore:{highscore} Points)
      </p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "restart" })}
      >
        Restart Quiz
      </button>
    </>
  );
}
export default FinishScreen;
