import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button style={props.winTile ? {background:'#44ff44'} : {background:'#fff'}} className = "square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

  class Board extends React.Component {
    renderSquare(i,key) {
        let winTile = false;
        for (let loopIter=0;loopIter<this.props.winTiles.length;loopIter++) {
            if (this.props.winTiles[loopIter] === i) {
                winTile = true;
            }
        }
        return ( <Square
        key={key}
        value={this.props.squares[i]}
        winTile={winTile}
        onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    render() {
      let toReturn = [];
      let divContents;
      for(let row=0; row<3; row++) {
        divContents = [];
        for(let col=0; col<3; col++) {
            divContents.push(this.renderSquare((row*3)+col,col));
        }
        toReturn.push(<div key={row} className="board-row">{divContents}</div>)
      }
      
      return (
        <div>{toReturn}</div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber:0,
            xIsNext:true,
            winTiles:[],
            ascending:true,
        }
    }
    
    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length-1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X':'O';
        const winner = calculateWinner(squares);
        let winningTiles = [];
        if(winner) {
            winningTiles = winner[1];
        }
        this.setState({
            history: history.concat([{
                squares:squares,
            }]),
            stepNumber:history.length,
            xIsNext: !this.state.xIsNext,
            winTiles:winningTiles,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber:step,
            xIsNext:(step%2) === 0,
            winTiles:[],
        });
    }

    toggleAsc() {
      this.setState({
        ascending:!this.state.ascending,
      })
    }

    render() {
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const boardFull = boardFilled(current.squares);

      const moves = history.map((step,move) => {
        let bold = false;
        if (move === this.state.stepNumber) {
            bold = true;
        }
        let coOrds;
        let x;
        let y;
        if(move > 0) {
            coOrds = differenceBetween(history[move].squares, history[move-1].squares);
            x = (coOrds%3) + 1;
            y = (Math.floor(coOrds/3)) +1;
        }

        const desc = move ?
            'Go to move #' + move +' ('+x+','+y+')':
            'Go to game start';
            return (
                <li key={move}>
                    <button
                    style={bold ? {fontWeight:'bold'} : {fontWeight:'normal'}} 
                    onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
      });

      if(!this.state.ascending) {
        moves.reverse();
      }

      let status;
      if (winner) {
        status = "Winner: " + winner[0];
      } else if (boardFull) {
        status = "It's a tie!"
      } else {
        status = "Next player: " + (this.state.xIsNext ? 'X':'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
                squares={current.squares}
                onClick={i => this.handleClick(i)}
                winTiles={this.state.winTiles}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button 
              className = "toggle" 
                onClick={() => this.toggleAsc()}>
                  Toggle Ascending/Descending
            </button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
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
        return [squares[a],lines[i]];
      }
    }
    return null;
  }

  function boardFilled(squares) {
    for (let i=0; i < squares.length; i++) {
        if(squares[i] === null) {
            return false;
        }
    }
    return true;
  }

  function differenceBetween(listOne,listTwo) {
    //we'll assume both lists are the same dimensions, and flat
    if(listOne) {
        if(listTwo) {
            for(let i=0; i<listOne.length; i++) {
                if(listOne[i] !== listTwo[i]) {
                    return i;
                }
            }
        } else {
            for(let i=0; i<listOne.length; i++) {
                if (listOne[i] === 'X') {
                    return i;
                }
            }
        }
    }
    return null;
  }