import { Service } from '@angular/core';
import { Injectable, inject } from '@angular/core';

import {
  Firestore,
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot
} from '@angular/fire/firestore';

@Service()
export class Dotmaster {

Player: 'player1' | 'player2' = 'player1';

 private firestore = inject(Firestore);

  async testFirebase(): Promise<void> {

    console.log('🔥 Firebase test started');

    const testRef = doc(
      this.firestore,
      'games',
      'TEST123'
    );

    await setDoc(testRef, {

      player1Name: 'Test Player 1',

      player2Name: 'Test Player 2',

      player1Score: 0,

      player2Score: 0,

      status: 'waiting',

      createdAt: new Date()

    });

    console.log(
      '✅ Firebase test document created'
    );
  }
//   private convertLinesToObject(
//   lines: (Player | null)[][]
// ): Record<string, Player | null> {

//   const result: Record<string, Player | null> = {};

//   lines.forEach((row, r) => {

//     row.forEach((value, c) => {

//       result[`${r}_${c}`] = value;

//     });

//   });

//   return result;
// }
}