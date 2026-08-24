import {
  Injectable
} from '@angular/core';

import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  onSnapshot
} from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class Friendshipgame {

  constructor(
    private firestore: Firestore
  ) {}


  // =====================================================
  // GENERATE GAME ID
  // =====================================================

  private generateGameId(): string {

    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';


    let result = '';


    for (
      let i = 0;
      i < 6;
      i++
    ) {

      result +=
        characters.charAt(
          Math.floor(
            Math.random() *
            characters.length
          )
        );

    }


    return result;

  }


  // =====================================================
  // CREATE GAME
  // =====================================================

  async createGame(
    player1Name: string,
    player1Avatar: string,
    player1Numbers: number[],
    player2Numbers: number[]
  ): Promise<string> {

    const gameId =
      this.generateGameId();


    const gameRef =
      doc(
        this.firestore,
        'games',
        gameId
      );


    await setDoc(
      gameRef,
      {

        gameId,

        player1Name,

        player1Avatar,


        player2Name: '',

        player2Avatar: '',


        // TWO DIFFERENT BOARDS

        player1Numbers:
          player1Numbers,

        player2Numbers:
          player2Numbers,


        // SELECTIONS

        player1MarkedNumbers: [],

        player2MarkedNumbers: [],


        createdAt:
          new Date()

      }
    );


    return gameId;

  }


  // =====================================================
  // GET GAME
  // =====================================================

  async getGame(
    gameId: string
  ): Promise<any | null> {

    const gameRef =
      doc(
        this.firestore,
        'games',
        gameId
      );


    const snapshot =
      await getDoc(
        gameRef
      );


    if (!snapshot.exists()) {

      return null;

    }


    return snapshot.data();

  }


  // =====================================================
  // PLAYER 2 JOIN
  // =====================================================

  async joinGame(
    gameId: string,
    player2Name: string,
    player2Avatar: string
  ): Promise<void> {

    const gameRef =
      doc(
        this.firestore,
        'games',
        gameId
      );


    await updateDoc(
      gameRef,
      {

        player2Name,

        player2Avatar

      }
    );

  }


  // =====================================================
  // UPDATE GAME
  // =====================================================

  async updateGame(
    gameId: string,
    data: any
  ): Promise<void> {

    const gameRef =
      doc(
        this.firestore,
        'games',
        gameId
      );


    await updateDoc(
      gameRef,
      data
    );

  }


  // =====================================================
  // REAL TIME LISTENER
  // =====================================================

  listenToGame(
    gameId: string,
    callback: (game: any) => void
  ): () => void {

    const gameRef =
      doc(
        this.firestore,
        'games',
        gameId
      );


    return onSnapshot(
      gameRef,
      (snapshot) => {

        if (
          snapshot.exists()
        ) {

          callback(
            snapshot.data()
          );

        }

        else {

          callback(null);

        }

      },

      (error) => {

        console.error(
          'Firebase listener error:',
          error
        );

      }
    );

  }

}