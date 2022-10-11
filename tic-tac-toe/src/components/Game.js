import React, { useReducer } from 'react'
import Board from './Board'

/* define reducer function*/
const reducer = (state, action)=>{
  switch(action.type) {
    case 'JUMP' :
      return{
        ...state,//keep prev. state
        xIsNext: action.payload.step % 2 === 0,
        history: state.history.slice(0, action.payload.step + 1),
      };
    case 'MOVE' ://if a move happens return a new state
      return{
        ...state,
        history: state.history.concat({//history within state concat with new one
          squares:action.payload.squares,
        }),
        xIsNext:!state.xIsNext,//next player 
      };
      default:
        return state;//return current state 
  }
};

export default function Game() {
  const [state, dispatch] = useReducer(reducer, {
    /*default state */
    xIsNext: true,//1st player is X
    history:[{squares: Array(9).fill(null)}] //arrays of arrays
  });
  const {xIsNext, history} = state;
  const jumpTo = (step)=>{
    dispatch({type:'JUMP', payload:{step}});
  };
  
  const handleClick = (i) => {
    const current = history[history.length-1];//get the last item in the history
    const squares = current.squares.slice();//copy of squares in a new variable
    const winner = calWinner(squares);//get winner
    if(winner || squares[i]){//if winner is exact or square is occupied  
      return;
    }
    squares[i]= xIsNext? 'X': '0';//fill square 
    dispatch({type:'MOVE', payload: {squares}});
  };
  const current = history[history.length-1];
  const winner = calWinner(current.squares);

  const status = winner? winner=== 'D'?'Draw': 'Winner is ' + winner: 'Next player is ' + (xIsNext? 'X' : '0'); 

  const moves = history.map((step,move)=>{
    const desc = move? 'Go to #' + move: 'Start the Game';//if move is 0 start the game otherwise render go to #
    //btn use to move in btw history 
    return <li key={move}>
      <button onClick={()=>jumpTo(move)}>
        {desc}
      </button>
    </li>
  });
  

  return (
    <div>
      <div className={winner ? 'game disabled':'game'}>
        <div className='game-board'>
          <Board onClick={(i) => handleClick(i)} squares={current.squares}></Board>
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ul>{moves}</ul>
        </div>
      </div>
    </div>
  )
}

const calWinner = (squares) => {
  const winnerLines = [ //possible lines for winning the game
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6],
  ];
  let isDraw = true;
  for(let i=0; i < winnerLines.length; i++){
    const[a, b, c] = winnerLines[i];
    
    if(squares[a] && squares[a] === squares[b] && squares[b] === squares[c]){//compare the current state with winnerLines 
      return squares[a];//have a winner
    }
    if(!squares[a] || !squares[b] || !squares[c]){
      isDraw = false;//no draw cuz we have room to continue the game
    }
  }
  if(isDraw) return 'D';
  return null;
};