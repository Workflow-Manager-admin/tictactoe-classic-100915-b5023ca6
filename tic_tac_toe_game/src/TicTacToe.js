import React, { useState } from "react";

// PUBLIC_INTERFACE
function TicTacToe() {
  /**
   * Main Container for TicTacToe Classic.
   * Features: Two-player mode, win detection, restart game, themed UI
   * Theme Colors:
   *   -- primary: #ffffff
   *   -- secondary: #222222
   *   -- accent (used for highlight/winner): #4caf50
   */

  // Set up board state, X = "X", O = "O", empty = null
  const emptyBoard = Array(9).fill(null);
  const [board, setBoard] = useState(emptyBoard);
  const [xIsNext, setXIsNext] = useState(true);
  const [winnerInfo, setWinnerInfo] = useState({ winner: null, line: null });
  const [isDraw, setIsDraw] = useState(false);

  // Utility to determine winner and winning line
  function calculateWinner(squares) {
    const lines = [
      [0,1,2],[3,4,5],[6,7,8], // rows
      [0,3,6],[1,4,7],[2,5,8], // cols
      [0,4,8],[2,4,6]          // diagonals
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    return null;
  }

  function handleClick(index) {
    if (board[index] || winnerInfo.winner || isDraw) return;
    const nextBoard = board.slice();
    nextBoard[index] = xIsNext ? "X" : "O";
    const computedWinner = calculateWinner(nextBoard);
    setBoard(nextBoard);
    if (computedWinner) {
      setWinnerInfo(computedWinner);
      setIsDraw(false);
    } else if (nextBoard.every(cell => cell)) {
      setIsDraw(true);
      setWinnerInfo({ winner: null, line: null });
    } else {
      setXIsNext(!xIsNext);
    }
  }

  function handleRestart() {
    setBoard(emptyBoard);
    setXIsNext(true);
    setWinnerInfo({ winner: null, line: null });
    setIsDraw(false);
  }

  // Status message
  let status;
  if (winnerInfo.winner) {
    status = (
      <span>
        Winner:{" "}
        <span style={{ color: "var(--ttt-accent, #4caf50)", fontWeight: 700 }}>
          {winnerInfo.winner}
        </span>
      </span>
    );
  } else if (isDraw) {
    status = <span>It's a <span style={{ color: "#e87a41", fontWeight: 500 }}>Draw!</span></span>;
  } else {
    status = <span>Next turn: <b style={{color: xIsNext ? "#4caf50":"#222222"}}>{xIsNext ? "X" : "O"}</b></span>;
  }

  // Render cell (board square)
  function renderCell(i) {
    const isWinningCell =
      winnerInfo.line && winnerInfo.line.includes(i);
    return (
      <button
        className="ttt-cell"
        style={{
          color: board[i]==="X" ? "#222222" : "#4caf50",
          backgroundColor: isWinningCell ? "var(--ttt-accent, #4caf50)" : "#fff",
          borderColor: "#4caf50",
          cursor: board[i] || winnerInfo.winner || isDraw ? "not-allowed" : "pointer",
          transition: "background 0.2s"
        }}
        key={i}
        onClick={() => handleClick(i)}
        tabIndex={0}
        aria-label={`Cell ${i+1}: ${board[i] ? board[i] : "empty"}`}
        disabled={!!board[i] || !!winnerInfo.winner || isDraw}
      >
        {board[i]}
      </button>
    );
  }

  // Custom styles using provided color palette and light theme
  // Additional color variable for the TicTacToe container
  const rootThemeVars = `
    :root {
      --ttt-primary: #ffffff;
      --ttt-secondary: #222222;
      --ttt-accent: #4caf50;
      --ttt-shadow: 0 6px 30px 0 rgba(0,0,0,.07);
    }
  `;

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--ttt-primary, #fff)",
      color: "var(--ttt-secondary, #222)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    }}>
      <style>{rootThemeVars}</style>
      <div className="ttt-main-container" style={{
        background: "#fff",
        borderRadius: 16,
        boxShadow: "var(--ttt-shadow)",
        padding: "32px 24px 28px 24px",
        width: 350,
        maxWidth: "95vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h1 style={{
          fontWeight: 700,
          fontSize: "2.1rem",
          textAlign: "center",
          margin: "8px 0 12px 0",
          letterSpacing: '-0.03em'
        }}>
          Tic Tac Toe
        </h1>
        <div style={{
          marginBottom: 18,
          minHeight: 30,
          fontSize: "1.08rem",
          fontWeight: 500,
          letterSpacing: "-0.014em"
        }}>
          {status}
        </div>

        <div className="ttt-board" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 64px)",
          gridTemplateRows: "repeat(3, 64px)",
          gap: 6,
          background: "#eee",
          borderRadius: 11,
          marginBottom: 18,
          boxShadow: "0 2px 6px rgba(34,34,34,0.09)"
        }}>
          {board.map((_, i) => renderCell(i))}
        </div>

        <button
          className="ttt-restart-btn"
          style={{
            background: "var(--ttt-accent, #4caf50)",
            color: "#fff",
            fontWeight: 600,
            fontSize: "1.05rem",
            border: "none",
            borderRadius: 6,
            padding: "10px 36px",
            marginTop: 8,
            marginBottom: 5,
            cursor: "pointer",
            boxShadow: "0 1px 5px rgba(76,175,80,.10)",
            transition: "background 0.18s"
          }}
          onClick={handleRestart}
          tabIndex={0}
        >
          Restart Game
        </button>
        <div style={{fontSize: "0.92rem", color: "#bdbdbd", marginTop: 2}}>
          Two Player (local) &nbsp;|&nbsp; Classic Mode
        </div>
      </div>
      {/* Internal styles for game cells */}
      <style>{`
        .ttt-cell {
          width: 64px; height: 64px;
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: bolder; border-radius: 8px;
          border: 2.5px solid #4caf50; outline: none;
          background: #fff;
          transition: background 0.18s, color 0.14s;
          box-shadow: 0 2px 9px rgba(76,175,80,0.08);
          user-select: none;
        }
        .ttt-cell:focus-visible {
          box-shadow: 0 0 0 3px #e1fad9;
        }
        .ttt-cell[disabled] {
          opacity: 0.64;
        }
        .ttt-restart-btn:hover {
          background: #388e3c;
        }
      `}</style>
    </div>
  );
}

export default TicTacToe;
