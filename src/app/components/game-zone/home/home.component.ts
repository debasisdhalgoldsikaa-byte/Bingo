import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Friendshipgame } from './friendshipgame';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  // =====================================================
  // AVATAR
  // =====================================================

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


  // =====================================================
  // FRIENDSHIP GAME
  // =====================================================

  friendshipWord = 'FRIENDSHIP';

  numbers: number[] = [];

  markedNumbers = new Set<number>();

  inputNumber: number | null = null;


  // =====================================================
  // LINES
  // =====================================================

  completedRows = new Set<number>();

  completedColumns = new Set<number>();

  diagonal1Completed = false;

  diagonal2Completed = false;

  completedLineKeys = new Set<string>();

  completedLineCount = 0;


  // =====================================================
  // CONGRATULATIONS
  // =====================================================

  showCongratulations = false;


  // =====================================================
  // PLAYER
  // =====================================================

  playerName = '';

  totalWins = 0;

  totalGames = 0;

  showNameInput = true;

  playerImage: any;


  // =====================================================
  // MULTIPLAYER
  // =====================================================

  gameId = '';

  joinGameId = '';

  playerRole: 'player1' | 'player2' = 'player1';

  isGameCreated = false;

  isJoined = false;

  waitingForPlayer = false;


  // =====================================================
  // FIREBASE PLAYER NUMBERS
  // =====================================================

  player1MarkedNumbers = new Set<number>();

  player2MarkedNumbers = new Set<number>();


  // =====================================================
  // LATEST PLAYER ACTION
  // =====================================================

  player1LatestNumber: number | null = null;

  player2LatestNumber: number | null = null;

  lastActionMessage = '';


  // =====================================================
  // FIREBASE LISTENER
  // =====================================================

  private unsubscribeGame?: () => void;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private gameService: Friendshipgame,
    private cdr: ChangeDetectorRef
  ) {

    this.generateRandomNumbers();

  }


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    const savedAvatar =
      localStorage.getItem(
        'friendshipPlayerAvatar'
      );

    if (savedAvatar) {

      this.playerAvatar = savedAvatar;

    }


    const savedName =
      localStorage.getItem(
        'friendshipPlayerName'
      );

    const savedWins =
      localStorage.getItem(
        'friendshipTotalWins'
      );

    const savedGames =
      localStorage.getItem(
        'friendshipTotalGames'
      );


    if (savedName) {

      this.playerName = savedName;

      this.showNameInput = false;

    }


    if (savedWins) {

      this.totalWins =
        Number(savedWins);

    }


    if (savedGames) {

      this.totalGames =
        Number(savedGames);

    }

  }


  // =====================================================
  // CREATE MULTIPLAYER GAME
  // =====================================================

  async createMultiplayerGame(): Promise<void> {

    if (!this.playerName.trim()) {

      alert(
        'Please enter your name first'
      );

      return;

    }


    try {

      /*
       * Your createGame currently accepts:
       *
       * createGame(
       *   player1Name,
       *   player1Avatar,
       *   player1Numbers,
       *   player2Numbers
       * )
       *
       * Player 2 starts with an empty array.
       */

      this.gameId =
        await this.gameService.createGame(
          this.playerName,
          this.playerAvatar,
          this.numbers,
          []
        );


      this.playerRole = 'player1';

      this.isGameCreated = true;

      this.waitingForPlayer = true;


      this.listenToGame();


      // alert(
      //   `Game created!\nGame ID: ${this.gameId}`
      // );


    } catch (error: any) {

      console.error(
        'Create game error:',
        error
      );

      alert(
        `${error?.code}\n${error?.message}`
      );

    }

  }


  // =====================================================
  // JOIN MULTIPLAYER GAME
  // =====================================================

  async joinMultiplayerGame(): Promise<void> {

    if (!this.playerName.trim()) {

      alert(
        'Please enter your name first'
      );

      return;

    }


    if (!this.joinGameId.trim()) {

      alert(
        'Please enter Game ID'
      );

      return;

    }


    const id =
      this.joinGameId
        .trim()
        .toUpperCase();


    try {

      const game =
        await this.gameService.getGame(id);


      if (!game) {

        alert(
          'Game not found'
        );

        return;

      }


      if (game.player2Name) {

        alert(
          'Game already has Player 2'
        );

        return;

      }


      this.gameId = id;

      this.playerRole = 'player2';


      await this.gameService.joinGame(
        id,
        this.playerName,
        this.playerAvatar
      );


      this.isJoined = true;

      this.waitingForPlayer = false;


      this.listenToGame();


    } catch (error: any) {

      console.error(
        'Join game error:',
        error
      );

      alert(
        `${error?.code}\n${error?.message}`
      );

    }

  }


  // =====================================================
  // FIREBASE LISTENER
  // =====================================================

  listenToGame(): void {

    if (!this.gameId) {

      return;

    }


    // Remove old listener
    if (this.unsubscribeGame) {

      this.unsubscribeGame();

    }


    this.unsubscribeGame =
      this.gameService.listenToGame(
        this.gameId,
        (game) => {

          if (!game) {

            return;

          }


          // =================================================
          // BOARD NUMBERS
          // =================================================

          if (game.numbers) {

            this.numbers =
              game.numbers;

          }


          // =================================================
          // PLAYER 1 NUMBERS
          // =================================================

          this.player1MarkedNumbers =
            new Set<number>(
              game.player1MarkedNumbers || []
            );


          // =================================================
          // PLAYER 2 NUMBERS
          // =================================================

          this.player2MarkedNumbers =
            new Set<number>(
              game.player2MarkedNumbers || []
            );


          // =================================================
          // LATEST PLAYER 1 NUMBER
          // =================================================

          this.player1LatestNumber =
            game.player1LatestNumber ??
            null;


          // =================================================
          // LATEST PLAYER 2 NUMBER
          // =================================================

          this.player2LatestNumber =
            game.player2LatestNumber ??
            null;


          // =================================================
          // COMBINED NUMBERS
          //
          // Keep your existing markedNumbers logic.
          // =================================================

          this.markedNumbers =
            new Set<number>([
              ...this.player1MarkedNumbers,
              ...this.player2MarkedNumbers
            ]);


          // =================================================
          // OTHER PLAYER ACTION
          // =================================================

          const otherNumber =
            this.getOtherPlayerLatestNumber();


          if (otherNumber !== null) {

            if (
              this.playerRole === 'player1'
            ) {

              this.lastActionMessage =
                `Player 2 chose ${otherNumber}`;

            } else {

              this.lastActionMessage =
                `Player 1 chose ${otherNumber}`;

            }

          }


          // =================================================
          // PLAYER 2 JOINED
          // =================================================

          if (game.player2Name) {

            this.waitingForPlayer = false;

          }


          // =================================================
          // EXISTING GAME LOGIC
          // =================================================

          this.checkCompletedLines();


          // =================================================
          // ON PUSH
          // =================================================

          this.cdr.markForCheck();

        }
      );

  }


  // =====================================================
  // GET OTHER PLAYER LATEST NUMBER
  // =====================================================

  getOtherPlayerLatestNumber(): number | null {

    if (
      this.playerRole === 'player1'
    ) {

      return this.player2LatestNumber;

    }

    return this.player1LatestNumber;

  }


  // =====================================================
  // PLAYER IMAGE
  // =====================================================

  onPlayerImageSelected(
    event: Event
  ): void {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (
      !file.type.startsWith(
        'image/'
      )
    ) {

      alert(
        'Please select an image file.'
      );

      return;

    }


    if (
      file.size >
      2 * 1024 * 1024
    ) {

      alert(
        'Please select an image smaller than 2 MB.'
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      const image =
        reader.result as string;


      this.playerImage =
        image;


      localStorage.setItem(
        'friendshipPlayerImage',
        image
      );

    };


    reader.readAsDataURL(file);

  }


  // =====================================================
  // SAVE PLAYER NAME
  // =====================================================

  savePlayerName(): void {

    const name =
      this.playerName.trim();


    if (!name) {

      alert(
        'Please enter your name'
      );

      return;

    }


    this.playerName = name;


    localStorage.setItem(
      'friendshipPlayerName',
      name
    );


    this.showNameInput = false;

  }


  // =====================================================
  // CHANGE PLAYER NAME
  // =====================================================

  changePlayerName(): void {

    this.showNameInput = true;

  }


  // =====================================================
  // GENERATE RANDOM NUMBERS
  // =====================================================

  generateRandomNumbers(): void {

    this.markedNumbers.clear();

    this.player1MarkedNumbers.clear();

    this.player2MarkedNumbers.clear();


    this.player1LatestNumber = null;

    this.player2LatestNumber = null;

    this.lastActionMessage = '';


    this.completedRows.clear();

    this.completedColumns.clear();


    this.diagonal1Completed =
      false;

    this.diagonal2Completed =
      false;


    this.completedLineKeys.clear();

    this.completedLineCount = 0;

    this.showCongratulations = false;

    this.inputNumber = null;


    this.numbers =
      Array.from(
        { length: 100 },
        (_, i) => i + 1
      );


    // Random shuffle

    for (
      let i = this.numbers.length - 1;
      i > 0;
      i--
    ) {

      const j =
        Math.floor(
          Math.random() *
          (i + 1)
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


  // =====================================================
  // MARK NUMBER
  // =====================================================

  async markNumber(): Promise<void> {

    if (
      this.inputNumber === null ||
      this.inputNumber < 1 ||
      this.inputNumber > 100
    ) {

      alert(
        'Enter a number between 1 and 100'
      );

      return;

    }


    const number =
      this.inputNumber;


    // Do not allow number already
    // selected by either player

    if (
      this.player1MarkedNumbers.has(
        number
      ) ||
      this.player2MarkedNumbers.has(
        number
      )
    ) {

      alert(
        `Number ${number} is already selected`
      );

      return;

    }


    await this.selectPlayerNumber(
      number
    );


    this.inputNumber = null;

  }


  // =====================================================
  // SELECT PLAYER NUMBER
  // =====================================================

  private async selectPlayerNumber(
    number: number
  ): Promise<void> {

    // ================================================
    // PLAYER 1
    // ================================================

    if (
      this.playerRole === 'player1'
    ) {

      this.player1MarkedNumbers.add(
        number
      );


      this.player1LatestNumber =
        number;


      this.lastActionMessage =
        `You chose ${number}`;

    }


    // ================================================
    // PLAYER 2
    // ================================================

    else {

      this.player2MarkedNumbers.add(
        number
      );


      this.player2LatestNumber =
        number;


      this.lastActionMessage =
        `You chose ${number}`;

    }


    // ================================================
    // EXISTING markedNumbers
    // ================================================

    this.markedNumbers =
      new Set<number>([
        ...this.player1MarkedNumbers,
        ...this.player2MarkedNumbers
      ]);


    // ================================================
    // EXISTING GAME LOGIC
    // ================================================

    this.checkCompletedLines();


    // ================================================
    // FIREBASE
    // ================================================

    if (!this.gameId) {

      return;

    }


    try {

      await this.gameService.updateGame(
        this.gameId,
        {

          player1MarkedNumbers:
            Array.from(
              this.player1MarkedNumbers
            ),

          player2MarkedNumbers:
            Array.from(
              this.player2MarkedNumbers
            ),

          player1LatestNumber:
            this.player1LatestNumber,

          player2LatestNumber:
            this.player2LatestNumber

        }
      );


    } catch (error) {

      console.error(
        'Firebase action sync error:',
        error
      );

    }

  }


  // =====================================================
  // TOGGLE NUMBER
  // =====================================================

// =====================================================
// TOGGLE NUMBER
// =====================================================

async toggleNumber(number: number): Promise<void> {

  // =========================
  // PLAYER 1
  // =========================

  if (this.playerRole === 'player1') {

    if (this.player1MarkedNumbers.has(number)) {

      // Already selected -> UNMARK
      this.player1MarkedNumbers.delete(number);

      this.lastActionMessage =
        `You unmarked ${number}`;

    } else {

      // Not selected -> MARK
      this.player1MarkedNumbers.add(number);

      this.player1LatestNumber = number;

      this.lastActionMessage =
        `You chose ${number}`;
    }

  }


  // =========================
  // PLAYER 2
  // =========================

  else {

    if (this.player2MarkedNumbers.has(number)) {

      // Already selected -> UNMARK
      this.player2MarkedNumbers.delete(number);

      this.lastActionMessage =
        `You unmarked ${number}`;

    } else {

      // Not selected -> MARK
      this.player2MarkedNumbers.add(number);

      this.player2LatestNumber = number;

      this.lastActionMessage =
        `You chose ${number}`;
    }
  }


  // =========================
  // UPDATE COMBINED NUMBERS
  // =========================

  this.markedNumbers =
    new Set<number>([
      ...this.player1MarkedNumbers,
      ...this.player2MarkedNumbers
    ]);


  // =========================
  // CHECK LINES
  // =========================

  this.checkCompletedLines();


  // =========================
  // SAVE FIREBASE
  // =========================

  if (!this.gameId) {
    return;
  }


  try {

    await this.gameService.updateGame(
      this.gameId,
      {

        player1MarkedNumbers:
          Array.from(
            this.player1MarkedNumbers
          ),

        player2MarkedNumbers:
          Array.from(
            this.player2MarkedNumbers
          ),

        player1LatestNumber:
          this.player1LatestNumber,

        player2LatestNumber:
          this.player2LatestNumber

      }
    );


    this.cdr.markForCheck();

  } catch (error) {

    console.error(
      'Firebase toggle error:',
      error
    );

  }
}


// =====================================================
// UNMARK NUMBER FROM INPUT
// =====================================================

async unmarkNumber(): Promise<void> {

  if (
    this.inputNumber === null ||
    this.inputNumber < 1 ||
    this.inputNumber > 100
  ) {

    alert(
      'Enter a number between 1 and 100'
    );

    return;
  }


  const number =
    this.inputNumber;


  // =========================
  // REMOVE ONLY CURRENT PLAYER
  // =========================

  if (this.playerRole === 'player1') {

    if (!this.player1MarkedNumbers.has(number)) {

      alert(
        `You have not marked ${number}`
      );

      return;
    }

    this.player1MarkedNumbers.delete(number);

    this.lastActionMessage =
      `You unmarked ${number}`;

  } else {

    if (!this.player2MarkedNumbers.has(number)) {

      alert(
        `You have not marked ${number}`
      );

      return;
    }

    this.player2MarkedNumbers.delete(number);

    this.lastActionMessage =
      `You unmarked ${number}`;
  }


  // =========================
  // UPDATE COMBINED SET
  // =========================

  this.markedNumbers =
    new Set<number>([
      ...this.player1MarkedNumbers,
      ...this.player2MarkedNumbers
    ]);


  this.checkCompletedLines();


  this.inputNumber = null;


  // =========================
  // FIREBASE
  // =========================

  if (!this.gameId) {
    return;
  }


  try {

    await this.gameService.updateGame(
      this.gameId,
      {

        player1MarkedNumbers:
          Array.from(
            this.player1MarkedNumbers
          ),

        player2MarkedNumbers:
          Array.from(
            this.player2MarkedNumbers
          ),

        player1LatestNumber:
          this.player1LatestNumber,

        player2LatestNumber:
          this.player2LatestNumber

      }
    );

    this.cdr.markForCheck();

  } catch (error) {

    console.error(
      'Firebase unmark error:',
      error
    );

  }
}


  // =====================================================
  // CHECK MARKED
  // =====================================================

  isMarked(
    number: number
  ): boolean {

    return this.markedNumbers.has(
      number
    );

  }


  // =====================================================
  // CHECK ROWS / COLUMNS / DIAGONALS
  // =====================================================

  checkCompletedLines(): void {

    this.completedRows.clear();

    this.completedColumns.clear();

    this.diagonal1Completed =
      false;

    this.diagonal2Completed =
      false;


    // ================================================
    // ROWS
    // ================================================

    for (
      let row = 0;
      row < 10;
      row++
    ) {

      let complete = true;


      for (
        let column = 0;
        column < 10;
        column++
      ) {

        const index =
          row * 10 + column;


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

        this.completedRows.add(
          row
        );


        this.addCompletedLine(
          `row-${row}`
        );

      }

    }


    // ================================================
    // COLUMNS
    // ================================================

    for (
      let column = 0;
      column < 10;
      column++
    ) {

      let complete = true;


      for (
        let row = 0;
        row < 10;
        row++
      ) {

        const index =
          row * 10 + column;


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

        this.completedColumns.add(
          column
        );


        this.addCompletedLine(
          `column-${column}`
        );

      }

    }


    // ================================================
    // DIAGONAL 1
    // ================================================

    let diagonal1 = true;


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      const index =
        i * 10 + i;


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

      this.diagonal1Completed =
        true;


      this.addCompletedLine(
        'diagonal-1'
      );

    }


    // ================================================
    // DIAGONAL 2
    // ================================================

    let diagonal2 = true;


    for (
      let i = 0;
      i < 10;
      i++
    ) {

      const index =
        i * 10 + (9 - i);


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

      this.diagonal2Completed =
        true;


      this.addCompletedLine(
        'diagonal-2'
      );

    }

  }


  // =====================================================
  // ADD COMPLETED LINE
  // =====================================================

  addCompletedLine(
    lineKey: string
  ): void {

    if (
      this.completedLineKeys.has(
        lineKey
      )
    ) {

      return;

    }


    this.completedLineKeys.add(
      lineKey
    );


    this.completedLineCount++;


    if (
      this.completedLineCount === 10
    ) {

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


      this.showCongratulations =
        true;

    }

  }


  // =====================================================
  // ROW
  // =====================================================

  getRow(
    index: number
  ): number {

    return Math.floor(
      index / 10
    );

  }


  // =====================================================
  // COLUMN
  // =====================================================

  getColumn(
    index: number
  ): number {

    return index % 10;

  }


  // =====================================================
  // COMPLETED LINE
  // =====================================================

  isLineCompleted(
    index: number
  ): boolean {

    const row =
      this.getRow(index);


    const column =
      this.getColumn(index);


    return (
      this.completedRows.has(row) ||
      this.completedColumns.has(column) ||
      this.isDiagonalCell(index)
    );

  }


  // =====================================================
  // DIAGONAL CELL
  // =====================================================

  isDiagonalCell(
    index: number
  ): boolean {

    const row =
      this.getRow(index);


    const column =
      this.getColumn(index);


    return (

      (
        this.diagonal1Completed &&
        row === column
      )

      ||

      (
        this.diagonal2Completed &&
        row + column === 9
      )

    );

  }


  // =====================================================
  // FRIENDSHIP LETTER
  // =====================================================

  isLetterCrossed(
    index: number
  ): boolean {

    return (
      index <
      this.completedLineCount
    );

  }


  // =====================================================
  // RESET
  // =====================================================

  resetGame(): void {

    this.generateRandomNumbers();

  }


  // =====================================================
  // AVATAR PICKER
  // =====================================================

  openAvatarPicker(): void {

    this.showAvatarPicker =
      !this.showAvatarPicker;

  }


  // =====================================================
  // SELECT AVATAR
  // =====================================================

  selectAvatar(
    emoji: string
  ): void {

    this.playerAvatar =
      emoji;


    localStorage.setItem(
      'friendshipPlayerAvatar',
      emoji
    );


    this.showAvatarPicker =
      false;

  }

// isLatestSelected(number: number): boolean {

//   return (
//     this.player1LatestNumber === number ||
//     this.player2LatestNumber === number
//   );

// }

isMyLatestNumber(number: number): boolean {

  if (this.playerRole === 'player1') {
    return this.player1LatestNumber === number;
  }

  if (this.playerRole === 'player2') {
    return this.player2LatestNumber === number;
  }

  return false;
}


isFriendLatestNumber(number: number): boolean {

  if (this.playerRole === 'player1') {
    return this.player2LatestNumber === number;
  }

  if (this.playerRole === 'player2') {
    return this.player1LatestNumber === number;
  }

  return false;
}
  
}