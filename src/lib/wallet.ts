import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { generateMnemonic } from "bip39"
import { Buffer } from 'buffer';

(window as any).Buffer = Buffer;

export function newWallet(): string {
  return generateMnemonic();
}

export function getWalletFromSeed(seed: string): Ed25519Keypair {
  return Ed25519Keypair.deriveKeypair(seed);
}

export function getWalletFromSecretKey(privateKey: Uint8Array): Ed25519Keypair {
  return Ed25519Keypair.fromSecretKey(privateKey);
}
