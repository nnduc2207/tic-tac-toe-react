import { Component } from "react";
import Board from "./Board";
import "./global.css";

class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          location:{
            col: null,
            row: null,
          }
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: {
            col: i % 3,
            row: Math.floor(i / 3),
          }
        },
      ]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
    });
  }

  moveUp(step) {
    //Change move
    const history = this.state.history
    const newHistory = [...history]
    newHistory.splice(step-1, 1)
    newHistory.splice(step,0,history[step-1])

    for (let i = step - 1; i < newHistory.length; i++) {
      // Change squares
      newHistory[i].squares = [...newHistory[i-1].squares]
      newHistory[i].squares[newHistory[i].location.row * 3 + newHistory[i].location.col] = i % 2 ? 'X' : 'O'

      //Check winner
      const winner = calculateWinner(newHistory[i].squares)
      if (winner) {
        newHistory.splice(i+1)
        this.setState({
          history: newHistory,
        })
        if (this.state.stepNumber > i) {
          this.setState({
            stepNumber: i,
          })
        }
      }
    }

    this.setState({history: newHistory})
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const win = calculateWinner(current.squares);

    let status;
    if (win?.winner) {
      status = "Winner: " + win.winner;
    } else if (history.length < 10) {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    } else {
      status = "End game: no one become winner"
    }

    const moves = history.map((el, move) => {
      const desc = move ? `Go to move # ${move}: Choice at (${el.location.col}, ${el.location.row}) ` : "Go to game start";
      return (
        <li key={move}>
          <button 
            className={this.state.stepNumber === move ? 'bold' : ''}
            onClick={() => this.jumpTo(move)}>
              {desc}
          </button>
          {move > 0 ? 
            <button 
            onClick={() => this.moveUp(move)}
            disabled={move === 1}>UP</button>
          : null}
          {move > 0 ? 
            <button 
            onClick={() => this.moveUp(move + 1)}
            disabled={move === history.length - 1}>DOWN</button>
          : null}
        </li>
      );
    });

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            winLine={win? win.line : []}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{ moves }</ol>
        </div>
      </div>
    );
  }
}

export default Game;

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
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winner: squares[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}
