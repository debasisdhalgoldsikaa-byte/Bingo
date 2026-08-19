import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

type Player = 'player1' | 'player2';

interface Box {
  owner: Player | null;
}

@Component({
  selector: 'app-connects-dots',
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './connects-dots.html',
  styleUrl: './connects-dots.scss',
})
export class ConnectsDots {

  readonly rows = 10;
  readonly cols = 10;

  // =========================
  // PLAYER DETAILS
  // =========================

  player1Name = '';
  player2Name = '';

  player1Color = '#2196f3';
  player2Color = '#f44336';

  gameStarted = false;

  // =========================
  // GAME
  // =========================

  horizontalLines: (Player | null)[][] = [];
  verticalLines: (Player | null)[][] = [];

  boxes: Box[][] = [];

  currentPlayer: Player = 'player1';

  player1Score = 0;
  player2Score = 0;

  gameOver = false;


  constructor() {
    this.initializeGame();
  }


  // =========================
  // INITIALIZE
  // =========================

  initializeGame(): void {

    // 10 rows × 9 horizontal lines
    this.horizontalLines = Array.from(
      { length: this.rows },
      () => Array(this.cols - 1).fill(null)
    );

    // 9 rows × 10 vertical lines
    this.verticalLines = Array.from(
      { length: this.rows - 1 },
      () => Array(this.cols).fill(null)
    );

    // 9 × 9 = 81 boxes
    this.boxes = Array.from(
      { length: this.rows - 1 },
      () =>
        Array.from(
          { length: this.cols - 1 },
          () => ({
            owner: null
          })
        )
    );

    this.currentPlayer = 'player1';
    this.player1Score = 0;
    this.player2Score = 0;
    this.gameOver = false;
  }


  // =========================
  // START GAME
  // =========================

  startGame(): void {

    this.player1Name =
      this.player1Name.trim() || 'Player 1';

    this.player2Name =
      this.player2Name.trim() || 'Player 2';

    if (this.player1Color === this.player2Color) {
      alert('Please select different colors.');
      return;
    }

    this.initializeGame();

    this.gameStarted = true;
  }


  // =========================
  // HORIZONTAL LINE
  // =========================

  drawHorizontal(row: number, col: number): void {

    if (this.gameOver) {
      return;
    }

    if (this.horizontalLines[row][col] !== null) {
      return;
    }

    // Save which player drew this line
    this.horizontalLines[row][col] =
      this.currentPlayer;

    const completedBoxes: {
      row: number;
      col: number;
    }[] = [];


    // Box above
    if (
      row > 0 &&
      this.isBoxCompleted(row - 1, col)
    ) {
      completedBoxes.push({
        row: row - 1,
        col
      });
    }


    // Box below
    if (
      row < this.rows - 1 &&
      this.isBoxCompleted(row, col)
    ) {
      completedBoxes.push({
        row,
        col
      });
    }


    this.handleCompletedBoxes(completedBoxes);
  }


  // =========================
  // VERTICAL LINE
  // =========================

  drawVertical(row: number, col: number): void {

    if (this.gameOver) {
      return;
    }

    if (this.verticalLines[row][col] !== null) {
      return;
    }

    // Save which player drew this line
    this.verticalLines[row][col] =
      this.currentPlayer;

    const completedBoxes: {
      row: number;
      col: number;
    }[] = [];


    // Box left
    if (
      col > 0 &&
      this.isBoxCompleted(row, col - 1)
    ) {
      completedBoxes.push({
        row,
        col: col - 1
      });
    }


    // Box right
    if (
      col < this.cols - 1 &&
      this.isBoxCompleted(row, col)
    ) {
      completedBoxes.push({
        row,
        col
      });
    }


    this.handleCompletedBoxes(completedBoxes);
  }


  // =========================
  // CHECK BOX
  // =========================

  isBoxCompleted(
    row: number,
    col: number
  ): boolean {

    if (
      row < 0 ||
      col < 0 ||
      row >= this.rows - 1 ||
      col >= this.cols - 1
    ) {
      return false;
    }

    const top =
      this.horizontalLines[row][col] !== null;

    const bottom =
      this.horizontalLines[row + 1][col] !== null;

    const left =
      this.verticalLines[row][col] !== null;

    const right =
      this.verticalLines[row][col + 1] !== null;

    return top && bottom && left && right;
  }


  // =========================
  // COMPLETE BOX
  // =========================

  handleCompletedBoxes(
    completedBoxes: {
      row: number;
      col: number;
    }[]
  ): void {

    // No box completed
    if (completedBoxes.length === 0) {

      this.changePlayer();

      return;
    }


    // Assign box to current player
    for (const box of completedBoxes) {

      if (
        this.boxes[box.row][box.col].owner === null
      ) {

        this.boxes[box.row][box.col].owner =
          this.currentPlayer;


        if (this.currentPlayer === 'player1') {

          this.player1Score++;

        } else {

          this.player2Score++;

        }
      }
    }


    // Player gets another turn
    this.checkGameOver();
  }


  // =========================
  // CHANGE PLAYER
  // =========================

  changePlayer(): void {

    this.currentPlayer =
      this.currentPlayer === 'player1'
        ? 'player2'
        : 'player1';
  }


  // =========================
  // BOX OWNER
  // =========================

  getBoxOwner(
    row: number,
    col: number
  ): Player | null {

    return this.boxes[row][col].owner;
  }


  // =========================
  // CURRENT PLAYER NAME
  // =========================

  getCurrentPlayerName(): string {

    return this.currentPlayer === 'player1'
      ? this.player1Name
      : this.player2Name;
  }


  // =========================
  // GAME OVER
  // =========================

  checkGameOver(): void {

    const total =
      this.player1Score +
      this.player2Score;

    if (total === 81) {
      this.gameOver = true;
    }
  }


  // =========================
  // WINNER
  // =========================

  getWinner(): string {

    if (
      this.player1Score >
      this.player2Score
    ) {
      return `${this.player1Name} Wins!`;
    }

    if (
      this.player2Score >
      this.player1Score
    ) {
      return `${this.player2Name} Wins!`;
    }

    return 'Game Draw!';
  }


  // =========================
  // RESTART
  // =========================

  restartGame(): void {
    this.initializeGame();
  }


  // =========================
  // NEW GAME
  // =========================

  newGame(): void {

    this.gameStarted = false;

    this.initializeGame();
  }

  getWinnerMessage(): string {

  if (this.player1Score > this.player2Score) {
    return `Amazing game, ${this.player1Name}! You dominated the board! 🔥`;
  }

  if (this.player2Score > this.player1Score) {
    return `Amazing game, ${this.player2Name}! What a victory! 🔥`;
  }

  return `What a battle! Both players are equally matched! 🤝`;
}
}