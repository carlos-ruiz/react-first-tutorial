import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        key={i}
      />
    )
  }

  render() {
    let i = 0
    const rows = [0, 1, 2]
    const columns = [0, 1, 2]
    const board = rows.map((value, index) => {
      return (
        <div key={i} className="board-row">
          {columns.map((value) => this.renderSquare(i++))}
        </div>
      )
    })
    return <div>{board}</div>
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          lastSquareSelected: null
        }
      ],
      xIsNext: true,
      stepNumber: 0,
      ascOrder: true
    }
  }
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    // const lastSquareSelected = current.lastSquareSelected
    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{squares: squares, lastSquareSelected: i}]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }
  changeOrder() {
    this.setState({ascOrder: !this.state.ascOrder})
  }
  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0
    })
  }
  render() {
    console.log('rendering game component')
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)

    const moves = history.map((step, move, array) => {
      const lastSquareSelected = this.state.history[move].lastSquareSelected
      const location = getSquareLocation(lastSquareSelected)
      const desc = move
        ? 'Go to move #' +
          move +
          ' (' +
          location.column +
          ', ' +
          location.row +
          ')'
        : 'Go to the start'
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
            className={`btn ${move === this.state.stepNumber ? 'bold' : ''}`}
          >
            {desc}
          </button>
        </li>
      )
    })

    let status
    if (winner) {
      status = 'Winner is ' + winner
    } else {
      status = 'Next player is ' + (this.state.xIsNext ? 'X' : 'O')
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.changeOrder()}>
            {this.state.ascOrder ? 'Ascendente' : 'Descendente'}
          </button>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
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
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a]
    }
  }
  return null
}

function getSquareLocation(i) {
  const locations = [
    {row: 0, column: 0},
    {row: 0, column: 1},
    {row: 0, column: 2},
    {row: 1, column: 0},
    {row: 1, column: 1},
    {row: 1, column: 2},
    {row: 2, column: 0},
    {row: 2, column: 1},
    {row: 2, column: 2}
  ]
  return locations[i]
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'))
