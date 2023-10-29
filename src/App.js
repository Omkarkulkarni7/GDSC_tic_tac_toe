import { useEffect, useState } from "react";

function Square({ value, onSquareClick }) {
  return (
    <>
      <button className="square" onClick={onSquareClick}>
        {value}
      </button>
    </>
  );
}

function Board({ xIsNext, squares, onPlay, setPlayer1, setPlayer2}) {
  /*   const [xisNext, setXIsNext] = useState(true); //by default the first move is X
  const [squares, setSquares] = useState(Array(9).fill(null)); //null,O,null,X,.. this is a masked array a duplicate shallow copy of the original array
 */
  const winner = calculateWinner(squares);
  let status;
  
  useEffect(()=>{
    if(winner === "X"){
      setPlayer1((e)=>e+1);
    }
    else if(winner === "O"){
      setPlayer2((e)=>e+1);
    } 
  },[setPlayer1,setPlayer2,winner]);

  if (winner) {
    status = "Winner is " + winner;
  } else {
    status = "Next Player is : " + (xIsNext ? "X" : "O");
  }
  function handleClick(i) {
    if (squares[i] || calculateWinner(squares)) return; //to avoid overwrite

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  return (
    <>
      <div className="status">{status}</div>

      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>  
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); //nested array like this [[null,null,...]]
  const [currentMove, setCurrentMove] = useState(0);
  const [player1, setPlayer1] = useState(0);
  const [player2, setPlayer2] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares]; //If you “go back in time” and then make a new move from that point, you only want to keep the history up to that point

    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1); // currentMove to point to the latest history entry.
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  //here-in  the squares argument goes through each element of history, and the move argument goes through each array index: 0, 1, 2, …. (In most cases, you’d need the actual array elements, but to render a list of moves you will only need indexes.)
  const moves = history.map((squares, move) => {
    let description;

    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
        <li key={move}>
          <button onClick={() => jumpTo(move)}>{description}</button>
        </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} setPlayer1={setPlayer1} setPlayer2={setPlayer2}/>
      </div>

      <div className="game-info">
        <ol>{moves}</ol>
      </div>
      <div>
        <ul>Player 1 Wins : {player1}</ul>
        <ul>Player 2 Wins : {player2}</ul>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c])
      return squares[a];
  }
  return null;
}

export default Game; //now the state is lifted again and now the game is the top level component




// If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game, listed in order of increasing difficulty:

// For the current move only, show “You are at move #…” instead of a button.
// Rewrite Board to use two loops to make the squares instead of hardcoding them.
// Add a toggle button that lets you sort the moves in either ascending or descending order.
// When someone wins, highlight the three squares that caused the win (and when no one wins, display a message about the result being a draw).
// Display the location for each move in the format (row, col) in the move history list.