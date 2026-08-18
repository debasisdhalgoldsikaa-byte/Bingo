import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  imports: [CommonModule],
  templateUrl: './tic-tac-toe.html',
  styleUrl: './tic-tac-toe.scss',
})
export class TicTacToe {
  board: string[] = ['', '', '', '', '', '', '', '', ''];

  currentPlayer: 'X' | 'O' = 'X';

  winner: string = '';

  isDraw = false;

  soundOn = true;

  winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
  ];

  makeMove(index: number): void {

    if (
      this.board[index] !== '' ||
      this.winner ||
      this.isDraw
    ) {
      return;
    }

    this.board[index] = this.currentPlayer;

    this.checkWinner();

    if (!this.winner && !this.isDraw) {
      this.currentPlayer =
        this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): void {

    for (const combination of this.winningCombinations) {

      const [a, b, c] = combination;

      if (
        this.board[a] &&
        this.board[a] === this.board[b] &&
        this.board[a] === this.board[c]
      ) {
        this.winner = this.board[a];
        return;
      }
    }

    if (this.board.every(cell => cell !== '')) {
      this.isDraw = true;
    }
  }

  restartGame(): void {

    this.board = ['', '', '', '', '', '', '', '', ''];

    this.currentPlayer = 'X';

    this.winner = '';

    this.isDraw = false;
  }

  newGame(): void {
    this.restartGame();
  }

  toggleSound(): void {
    this.soundOn = !this.soundOn;
  }
}
