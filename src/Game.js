import { Component } from "react";
import Board from "./Board";
import "./global.css";

class Game extends Component {
  state = {
    size: this.props.size,
    history: [
      {
        squares: Array(this.props.size ** 2).fill(null),
        location:{
          col: null,
          row: null,
        }
      },
    ],
    stepNumber: 0,
    xIsNext: true,
  };

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
            col: i % this.state.size,
            row: Math.floor(i / this.state.size),
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
      newHistory[i].squares[newHistory[i].location.row * this.state.size + newHistory[i].location.col] = i % 2 ? 'X' : 'O'

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
    } else if (this.state.stepNumber < this.state.size ** 2) {
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
            size={this.state.size}
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
  const size = Math.sqrt(squares.length)

  // Check all lines to calculate winner
  const lines = [];
  for (let i = 0; i < size; i++) {
    const horizontal = []
    const vertical = []
    for (let j = 0; j < size; j++) {
      horizontal.push(i * size + j)
      vertical.push(i + j * size)
    }
    lines.push(horizontal)
    lines.push(vertical)
  }
  const cross = []
  const reverse = []
  for (let i = 0; i < size; i++) {
    cross.push(i * size + i)
    reverse.push((i+1) * size - (i+1))
  }
  lines.push(cross)
  lines.push(reverse)

  // check winner
  for (let i = 0; i < lines.length; i++) {
    if (!squares[lines[i][0]]) {
      continue;
    }
    let role = squares[lines[i][0]]
    const res = lines[i].every(num => {
      return squares[num] === role
    })

    if (res) {
      return {
        winner: role,
        line: lines[i],
      };
    }
  }
  return null;
}
