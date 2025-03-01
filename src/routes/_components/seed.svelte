<script lang="ts">
  import { onMount } from "svelte";
  import { getWallets, addWallet } from "$lib/db.ts";
  import { getWalletFromSeed } from "$lib/wallet";
  import { ClipboardCopy } from "lucide-svelte";

  let wallets: any = [];

  export let mnemonic: string;

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
  };

  const storeWallet = async () => {
    const wallet = getWalletFromSeed(mnemonic);

    // TODO: made encrypt to store in db with user password

    await addWallet(wallet);

    window.location.href = "/";
  };
</script>

<div
  class="card border-2 border-base-300 p-4 flex-col gap-2 items-center justify-center"
>
  <div class="p-4 rounded-2xl grid grid-cols-2 min-w-[200px]">
    {#each mnemonic.split(" ") as word, index}
      <span>{index + 1}</span>
      <span class="grid space-x-0">{word}</span>
    {/each}
  </div>

  <div class="w-auto flex gap-2">
    <button class="btn btn-primary" on:click={storeWallet}>Confirm</button>
    <button class="btn btn-base-200" on:click={copyMnemonic}>
      <ClipboardCopy />
    </button>
  </div>
</div>
