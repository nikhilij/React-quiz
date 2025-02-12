function Progress({ index, length, points, maxPoints, answer }) {
  return (
    <>
      <header className="progress">
        <progress max={length} value={index + Number(answer !== null)} />

        <p>
          Question <strong>{index+1}</strong> /{length}
        </p>
        <p>
          <strong>{points}</strong> / {maxPoints} points
        </p>
      </header>
    </>
  );
}
export default Progress;
