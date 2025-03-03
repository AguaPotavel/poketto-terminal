<script lang="ts">
  import { onMount } from "svelte";
  import { getWallets } from "../lib/db.ts";
  import { newWallet as n, getWalletFromSecretKey } from "../lib/wallet";
  import Seed from "./_components/seed.svelte";
  import type { Keypair } from "@mysten/sui/cryptography";
  import { SendHorizontal } from "lucide-svelte";
  import { goto } from "$app/navigation";

  let wallets: any = [];
  let fetchingWallets: boolean = false;
  let mnemonic: string = "";

  let newWallet = async () => {
    mnemonic = n();
  };

  function parseWallet(wallet: string): string {
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  }

  function normalizeWallet(wallet: any): Keypair {
    const { keypair } = wallet;
    const walletKey = getWalletFromSecretKey(keypair.secretKey);
    return walletKey;
  }

  onMount(async () => {
    fetchingWallets = true;
    wallets = await getWallets();
    console.log(wallets);
    fetchingWallets = false;
  });
</script>

<main class="w-full h-full">
  {#if wallets.length === 0 && fetchingWallets}
    <p>Loading...</p>
  {:else if wallets.length === 0 && !mnemonic}
    <div class="w-full h-full grid items-center justify-center">
      <div class="w-auto p-4 grid items-center">
        <h1 class="mb-4">Looks like you don't have any wallets configured</h1>
        <button class="btn btn-primary" onclick={newWallet}
          >Create wallet</button
        >
        <a href="/dashboard" class="btn btn-secondary mt-2">Ir para Dashboard</a
        >
      </div>
    </div>
  {:else if mnemonic !== ""}
    <div class="w-full h-full grid items-center justify-center">
      <Seed {mnemonic} />
    </div>
  {:else}
    <div
      class="flex flex-col gap-2 self-center h-full items-center justify-center"
    >
      <h1 class="text-2xl font-bold">Your wallets</h1>
      {#each wallets as wallet}
        <button onclick={() => goto("/dashboard")} class="btn btn-primary"
          >{parseWallet(normalizeWallet(wallet).getPublicKey().toSuiAddress())}

          <SendHorizontal class="w-6 h-6" />
        </button>
      {/each}
    </div>
  {/if}
</main>

