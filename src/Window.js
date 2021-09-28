import React, { Component } from "react";
import Game from "./Game";
import "./global.css";

class Window extends Component {
    state = {
        input: null,
        size: null,
    }

    renderGame(size) {
        console.log(size);
        if (size > 0) {
            console.log(typeof size);
            return React.createElement(Game, { size: Number(size) })
        }
        return null
    }

    render() {
        return(
            <div>
                <input 
                    className={'input'}
                    type={'number'} 
                    placeholder={'Please input size of board (nxn) ...'} 
                    value={this.state.input} 
                    onChange={(e) => {
                        this.setState({input: e.target.value})
                    }}
                    required
                />

                <button onClick={() => {
                    this.setState({size: this.state.input})
                }}
                disabled={!!this.state.size}>Enter</button>

                <button onClick={() => {
                    this.setState({size: null})
                }}
                disabled={!this.state.size}>Reset</button>
                
                {this.renderGame(this.state.size)}
            </div>
        )
    }
}

export default Window;