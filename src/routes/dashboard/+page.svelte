<script lang="ts">
  import { onMount } from "svelte";
  import { getWallets } from "../../lib/db.ts";
  import {
    Folder,
    Send,
    Wallet,
    Settings,
    Terminal,
    Globe,
  } from "lucide-svelte";
  import DraggableWindow from "./_components/draggable-window.svelte";

  import DesktopIcon from "./_components/desktop-icon.svelte";
  import Portfolio from "./_components/portfolio.svelte";

  let wallets: any = [];
  let fetchingWallets: boolean = false;
  let draggingIcon: number | null = null;
  let openWindows: {id: number, position: {x: number, y: number}, size: {width: string, height: string}, isMaximized: boolean, zIndex: number}[] = $state([]);
  let draggingWindow: boolean = false;
  let nextZIndex: number = 10;

  let icons = [
    {
      id: 1,
      name: "Carteiras",
      x: 20,
      y: 20,
      component: Wallet,
      content: Portfolio,
    },
    { id: 2, name: "Enviar", x: 120, y: 20, component: Send, content: Portfolio },
    // { id: 3, name: "Arquivos", x: 20, y: 120, component: Folder },
    // { id: 4, name: "Configurações", x: 120, y: 120, component: Settings },
    // { id: 5, name: "Terminal", x: 20, y: 220, component: Terminal },
    // { id: 6, name: "Navegador", x: 120, y: 220, component: Globe },
  ];

  let activeWindow: number | null = null;

  function handleIconDrag(event) {
    const { id, event: dragEvent } = event.detail;
    const icon = icons.find(icon => icon.id === id);
    if (icon) {
      const startX = icon.x;
      const startY = icon.y;

      const onMouseMove = (moveEvent) => {
        icon.x = startX + (moveEvent.clientX - dragEvent.clientX);
        icon.y = startY + (moveEvent.clientY - dragEvent.clientY);
        icons = [...icons]; // Força atualização do Svelte
      };

      const onMouseUp = () => {
        window.removeEventListener('mousemove', onMouseMove);
        window.removeEventListener('mouseup', onMouseUp);
      };

      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
  }

  function handleIconOpen(event) {
    const { id } = event.detail;

    // Verifica se a janela já está aberta
    const existingWindow = openWindows.find(w => w.id === id);
    if (existingWindow) {
      // Traz a janela para frente
      bringWindowToFront(id);
      return;
    }

    // Posiciona a janela próxima ao ícone clicado
    const icon = icons.find(icon => icon.id === id);
    if (icon) {
      openWindows = [...openWindows, {
        id,
        position: { x: icon.x + 50, y: icon.y + 50 },
        size: { width: "55%", height: "55%" },
        isMaximized: false,
        zIndex: nextZIndex++
      }]
    }
  }

  function handleWindowClose(id) {
    openWindows = openWindows.filter(w => w.id !== id)
  }

  function bringWindowToFront(id) {
    const windowIndex = openWindows.findIndex(w => w.id === id);
    if (windowIndex !== -1) {
      const updatedWindows = [...openWindows];
      updatedWindows[windowIndex].zIndex = nextZIndex++;
      openWindows = updatedWindows;
    }
  }

  onMount(async () => {
    fetchingWallets = true;
    wallets = await getWallets();
    fetchingWallets = false;
  });
</script>

<svelte:head>
  <title>Dashboard</title>
</svelte:head>

<div
  aria-hidden="true"
  class="w-full h-screen bg-gray-50 overflow-hidden relative"
>
  <!-- Icons -->
  <div class="desktop w-full h-full p-4">
    {#each icons as icon (icon.id)}
      <DesktopIcon
        {icon}
        isOpen={openWindows.some(w => w.id === icon.id)}
        on:open={(e) => handleIconOpen(e)}
        on:drag={(e) => handleIconDrag(e)}
      />
    {/each}
  </div>


  <!-- windows  -->
  {#each openWindows as window (window.id)}
    <DraggableWindow
      title={icons.find(i => i.id === window.id)?.name || "Janela"}
      position={window.position}
      size={window.size}
      isMaximized={window.isMaximized}
      zIndex={window.zIndex}
      on:close={() => handleWindowClose(window.id)}
      on:focus={() => bringWindowToFront(window.id)}
      on:resize={(e) => {
        const index = openWindows.findIndex(w => w.id === window.id);
        if (index !== -1) {
          openWindows[index].isMaximized = e.detail.isMaximized;
          openWindows = [...openWindows];
        }
      }}
    >
      {#if icons.find(i => i.id === window.id)?.content}
        <svelte:component this={icons.find(i => i.id === window.id)?.content}  />
      {:else}
        <div class="text-white p-4">
          <h2 class="text-xl">
            {icons.find(i => i.id === window.id)?.name || "Aplicativo"}
          </h2>
          <p class="mt-4">Esta funcionalidade ainda está em desenvolvimento.</p>
        </div>
      {/if}
    </DraggableWindow>
  {/each}

  <!-- task bar -->
   <div class="taskbar fixed bottom-0 left-0 right-0 h-12 bg-gray-800/80 backdrop-blur-sm flex items-center px-4 z-50">
    <div class="start-button mr-4">
      <button class="bg-blue-500 hover:bg-blue-600 p-2 rounded-full">
        <Wallet class="w-6 h-6 text-white" />
      </button>
    </div>
    <div class="flex space-x-2">
      {#each icons as icon (icon.id)}
        <button 
          class="p-2 rounded hover:bg-white/20 transition-colors {openWindows.some(w => w.id === icon.id) ? 'bg-white/20' : ''}"
          on:click={() => handleIconOpen({detail: {id: icon.id}})}
        >
          <svelte:component this={icon.component} class="w-6 h-6 text-white" />
        </button>
      {/each}
    </div>
    <div class="ml-auto text-white">
      {new Date().toLocaleTimeString()}
    </div>
  </div>
</div>
