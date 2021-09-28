import { Component } from 'react'
import Square from './Square';
import './global.css'

class Board extends Component {
    renderSquare(i) {
        return (
          <Square
            key={i}
            value={this.props.squares[i]}
            inWinLine={this.props.winLine.includes(i)}
            onClick={() => this.props.onClick(i)}
          />
        );
    }

    render() {
        
        return (
          <div>
            {[...Array(3).keys()].map(i =>
              {return(
                <div className="board-row" key={i}>
                    {[...Array(3).keys()].map(j => {
                      return(
                        this.renderSquare(i*3+j)
                      )
                    })}
                </div>
            )})}
        </div>
        );
    }
}

export default Board