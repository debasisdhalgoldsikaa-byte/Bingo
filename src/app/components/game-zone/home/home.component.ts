
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  // input,
  signal,
} from '@angular/core';
// import { GameEngine } from './engine.service';
import { combineLatest, map, Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
@Component({
  selector: 'app-home',
  // templateUrl: game.component.html,
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  playerAvatar = '👤';

showAvatarPicker = false;

avatarEmojis: string[] = [
  '😀',
  '😎',
  '🥳',
  '🤩',
  '😇',
  '😂',
  '🤣',
  '😍',
  '🤓',
  '😎',
  '🤠',
  '🥰',
  '😜',
  '🐶',
  '🐱',
  '🦊',
  '🐼',
  '🐯',
  '🦁',
  '🐸',
  '🐵',
  '🐨',
  '🐰',
  '🦄',
  '🐲',
  '👻',
  '🤖',
  '👽',
  '🎃',
  '⭐',
  '🔥',
  '💖'
];
 friendshipWord = 'FRIENDSHIP';

  numbers: number[] = [];

  markedNumbers = new Set<number>();

  inputNumber: number | null = null;

  completedRows = new Set<number>();
  completedColumns = new Set<number>();

  diagonal1Completed = false;
  diagonal2Completed = false;

  // Stores already completed lines
  completedLineKeys = new Set<string>();

  // Number of completed lines
  completedLineCount = 0;

  // Congratulations popup
  showCongratulations = false;
  playerName = '';

totalWins = 0;
totalGames = 0;

showNameInput = true;
  playerImage: any;

  constructor() {
    this.generateRandomNumbers();
  }

  ngOnInit(): void {
    const savedAvatar =
  localStorage.getItem('friendshipPlayerAvatar');

if (savedAvatar) {

  this.playerAvatar = savedAvatar;

}

  const savedName =
    localStorage.getItem('friendshipPlayerName');

  const savedWins =
    localStorage.getItem('friendshipTotalWins');

  const savedGames =
    localStorage.getItem('friendshipTotalGames');


  if (savedName) {

    this.playerName = savedName;

    this.showNameInput = false;
  }


  if (savedWins) {

    this.totalWins = Number(savedWins);
  }


  if (savedGames) {

    this.totalGames = Number(savedGames);
  }
}

onPlayerImageSelected(event: Event): void {

  const input =
    event.target as HTMLInputElement;

  if (!input.files || input.files.length === 0) {
    return;
  }

  const file = input.files[0];

  // Check image type
  if (!file.type.startsWith('image/')) {

    alert('Please select an image file.');

    return;
  }


  // Optional: 2 MB limit
  if (file.size > 2 * 1024 * 1024) {

    alert('Please select an image smaller than 2 MB.');

    return;
  }


  const reader = new FileReader();

  reader.onload = () => {

    const image = reader.result as string;

    this.playerImage = image;

    // Store image
    localStorage.setItem(
      'friendshipPlayerImage',
      image
    );
  };


  reader.readAsDataURL(file);
}

savePlayerName(): void {

  const name = this.playerName.trim();

  if (!name) {

    alert('Please enter your name');

    return;
  }

  this.playerName = name;

  localStorage.setItem(
    'friendshipPlayerName',
    name
  );

  this.showNameInput = false;
}

changePlayerName(): void {

  this.showNameInput = true;
}

// registerCompletedLine(lineKey: string): void {

//   if (this.completedLineKeys.has(lineKey)) {
//     return;
//   }

//   this.completedLineKeys.add(lineKey);

//   this.completedLineCount++;


//   // 10 lines completed = WIN
// if (
//   this.completedLineCount === 10 &&
//   !this.showCongratulations
// ) {

//   this.totalWins++;
//   this.totalGames++;

//   localStorage.setItem(
//     'friendshipTotalWins',
//     this.totalWins.toString()
//   );

//   localStorage.setItem(
//     'friendshipTotalGames',
//     this.totalGames.toString()
//   );

//   // this.showCongratulations = true;
// }
// }


  // =====================================
  // RANDOM 1 - 100
  // =====================================

  generateRandomNumbers(): void {

    this.markedNumbers.clear();

    this.completedRows.clear();
    this.completedColumns.clear();

    this.diagonal1Completed = false;
    this.diagonal2Completed = false;

    this.completedLineKeys.clear();

    this.completedLineCount = 0;

    this.showCongratulations = false;

    this.inputNumber = null;

    this.numbers = Array.from(
      { length: 100 },
      (_, i) => i + 1
    );

    // Random shuffle
    for (let i = this.numbers.length - 1; i > 0; i--) {

      const j = Math.floor(
        Math.random() * (i + 1)
      );

      [
        this.numbers[i],
        this.numbers[j]
      ] = [
        this.numbers[j],
        this.numbers[i]
      ];
    }
  }


  // =====================================
  // MARK FROM SEARCH BOX
  // =====================================

  markNumber(): void {

    if (
      this.inputNumber === null ||
      this.inputNumber < 1 ||
      this.inputNumber > 100
    ) {
      alert('Enter a number between 1 and 100');
      return;
    }

    if (this.markedNumbers.has(this.inputNumber)) {
      alert(`Number ${this.inputNumber} is already marked`);
      return;
    }

    this.markedNumbers.add(this.inputNumber);

    this.checkCompletedLines();

    this.inputNumber = null;
  }


  // =====================================
  // UNMARK FROM SEARCH BOX
  // =====================================

  unmarkNumber(): void {

    if (
      this.inputNumber === null ||
      this.inputNumber < 1 ||
      this.inputNumber > 100
    ) {
      alert('Enter a number between 1 and 100');
      return;
    }

    if (!this.markedNumbers.has(this.inputNumber)) {
      alert(`Number ${this.inputNumber} is not marked`);
      return;
    }

    this.markedNumbers.delete(this.inputNumber);

    this.checkCompletedLines();

    this.inputNumber = null;
  }


  // =====================================
  // CLICK NUMBER
  // =====================================

  toggleNumber(number: number): void {

    if (this.markedNumbers.has(number)) {

      this.markedNumbers.delete(number);

    } else {

      this.markedNumbers.add(number);
    }

    this.checkCompletedLines();
  }


  // =====================================
  // CHECK MARKED
  // =====================================

  isMarked(number: number): boolean {
    return this.markedNumbers.has(number);
  }


  // =====================================
  // CHECK ROWS / COLUMNS / DIAGONALS
  // =====================================

  checkCompletedLines(): void {

     this.completedRows.clear();
  this.completedColumns.clear();

  this.diagonal1Completed = false;
  this.diagonal2Completed = false;

    // -------------------------------
    // ROWS
    // -------------------------------

  for (let row = 0; row < 10; row++) {

    let complete = true;

    for (let column = 0; column < 10; column++) {

      const index = row * 10 + column;

      if (
        !this.markedNumbers.has(
          this.numbers[index]
        )
      ) {
        complete = false;
        break;
      }
    }

    if (complete) {

      this.completedRows.add(row);

      this.addCompletedLine(`row-${row}`);
    }
  }


    // -------------------------------
    // COLUMNS
    // -------------------------------

    for (let column = 0; column < 10; column++) {

      let complete = true;

      for (let row = 0; row < 10; row++) {

        const index = row * 10 + column;

        if (
          !this.markedNumbers.has(
            this.numbers[index]
          )
        ) {
          complete = false;
          break;
        }
      }

      if (complete) {

        this.completedColumns.add(column);

        this.addCompletedLine(
          `column-${column}`
        );
      }
    }


    // -------------------------------
    // DIAGONAL 1
    // -------------------------------

    let diagonal1 = true;

    for (let i = 0; i < 10; i++) {

      const index = i * 10 + i;

      if (
        !this.markedNumbers.has(
          this.numbers[index]
        )
      ) {
        diagonal1 = false;
        break;
      }
    }

    if (diagonal1) {

      this.diagonal1Completed = true;

      this.addCompletedLine(
        'diagonal-1'
      );
    }


    // -------------------------------
    // DIAGONAL 2
    // -------------------------------

    let diagonal2 = true;

    for (let i = 0; i < 10; i++) {

      const index = i * 10 + (9 - i);

      if (
        !this.markedNumbers.has(
          this.numbers[index]
        )
      ) {
        diagonal2 = false;
        break;
      }
    }

    if (diagonal2) {

      this.diagonal2Completed = true;

      this.addCompletedLine(
        'diagonal-2'
      );
    }
  }


  // =====================================
  // ADD COMPLETED LINE
  // =====================================

  addCompletedLine(lineKey: string): void {

    // Don't count the same line twice
    if (
      this.completedLineKeys.has(lineKey)
    ) {
      return;
    }

    this.completedLineKeys.add(lineKey);

    this.completedLineCount++;

    // 10 lines completed
    if (this.completedLineCount === 10) {

        this.totalWins++;
  this.totalGames++;

  localStorage.setItem(
    'friendshipTotalWins',
    this.totalWins.toString()
  );

  localStorage.setItem(
    'friendshipTotalGames',
    this.totalGames.toString()
  );

      this.showCongratulations = true;
    }
  }


  // =====================================
  // ROW
  // =====================================

  getRow(index: number): number {
    return Math.floor(index / 10);
  }


  // =====================================
  // COLUMN
  // =====================================

  getColumn(index: number): number {
    return index % 10;
  }


  // =====================================
  // COMPLETED LINE
  // =====================================

  isLineCompleted(index: number): boolean {

    const row = this.getRow(index);

    const column = this.getColumn(index);

    return (
      this.completedRows.has(row) ||
      this.completedColumns.has(column) ||
      this.isDiagonalCell(index)
    );
  }


  // =====================================
  // DIAGONAL
  // =====================================

  isDiagonalCell(index: number): boolean {

    const row = this.getRow(index);

    const column = this.getColumn(index);

    return (
      (
        this.diagonal1Completed &&
        row === column
      ) ||
      (
        this.diagonal2Completed &&
        row + column === 9
      )
    );
  }


  // =====================================
  // FRIENDSHIP LETTER
  // =====================================

  isLetterCrossed(index: number): boolean {

    return index < this.completedLineCount;
  }


  // =====================================
  // RESET
  // =====================================

  resetGame(): void {
    this.generateRandomNumbers();
  }

  openAvatarPicker(): void {

  this.showAvatarPicker = !this.showAvatarPicker;

}
selectAvatar(emoji: string): void {

  this.playerAvatar = emoji;

  localStorage.setItem(
    'friendshipPlayerAvatar',
    emoji
  );

  this.showAvatarPicker = false;

}


}



