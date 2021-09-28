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
            {[...Array(this.props.size).keys()].map(i =>
              {return(
                <div className="board-row" key={i}>
                    {[...Array(this.props.size).keys()].map(j => {
                      return(
                        this.renderSquare(i*this.props.size+j)
                      )
                    })}
                </div>
            )})}
        </div>
        );
    }
}

export default Board