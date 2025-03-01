// src/lib/db.js
import { openDB } from 'idb';

const dbPromise = openDB('poketto', 1, {
  upgrade(db) {
    db.createObjectStore('wallets', { keyPath: 'id', autoIncrement: true });
  },
});

export async function addWallet(wallet: any) {
  const db = await dbPromise;
  await db.add('wallets', wallet);
}

export async function getWallets() {
  const db = await dbPromise;
  return await db.getAll('wallets');
}
