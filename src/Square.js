import './global.css'

function Square(props) {
    return (
      <button className={`square ${props.inWinLine ? 'highlight' : ''}`} onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

export default Square;
