<script lang="ts">
  import { createEventDispatcher, onMount } from "svelte";
  import { Maximize2, Minimize2 } from "lucide-svelte";

  const dispatch = createEventDispatcher();

  export let title: string = "Janela";
  export let position = { x: 100, y: 100 };
  export let size = { width: "55%", height: "55%" };
  export let isMaximized: boolean = false;
  export let zIndex: number = 10;

  let windowElement: HTMLDivElement;
  let headerElement: HTMLDivElement;
  let isDragging: boolean = false;
  let dragOffset = { x: 0, y: 0 };
  let previousSize = { ...size };
  let previousPosition = { ...position };

  function startDrag(event: MouseEvent) {
    if (isMaximized) return;

    isDragging = true;
    dragOffset.x = event.clientX - position.x;
    dragOffset.y = event.clientY - position.y;

    dispatch("focus");
    event.preventDefault();
  }

  function onDrag(event: MouseEvent) {
    if (!isDragging) return;

    position.x = event.clientX - dragOffset.x;
    position.y = event.clientY - dragOffset.y;

    // Evitar que a janela saia da tela
    if (position.x < 0) position.x = 0;
    if (position.y < 0) position.y = 0;

    const maxX = window.innerWidth - windowElement.offsetWidth;
    const maxY = window.innerHeight - windowElement.offsetHeight;

    if (position.x > maxX) position.x = maxX;
    if (position.y > maxY) position.y = maxY;

    position = { ...position }; // Força atualização do Svelte
  }

  function stopDrag() {
    isDragging = false;
  }

  function toggleMaximize() {
    if (isMaximized) {
      // Restaurar tamanho e posição anteriores
      size = { ...previousSize };
      position = { ...previousPosition };
    } else {
      // Salvar tamanho e posição atuais
      previousSize = { ...size };
      previousPosition = { ...position };

      // Maximizar
      position = { x: 0, y: 0 };
      size = { width: "100%", height: "100%" };
    }

    isMaximized = !isMaximized;
    dispatch("resize", { isMaximized });
  }

  function close() {
    dispatch("close");
  }

  function handleWindowClick() {
    dispatch("focus");
  }

  onMount(() => {
    const onMouseMove = (e: MouseEvent) => onDrag(e);
    const onMouseUp = () => stopDrag();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });
</script>

<div
  bind:this={windowElement}
  aria-hidden="true"
  class="window-container absolute rounded-lg shadow-2xl overflow-hidden transition-shadow"
  class:maximized={isMaximized}
  style="
    left: {position.x}px;
    top: {position.y}px;
    width: {isMaximized ? '100%' : size.width};
    height: {isMaximized ? '100%' : size.height};
    z-index: {zIndex};
  "
  on:click={handleWindowClick}
>
  <div
    aria-hidden="true"
    bind:this={headerElement}
    class="window-header bg-gray-50/90 backdrop-blur-lg p-2 flex justify-between items-center cursor-move select-none"
    on:mousedown={startDrag}
  >
    <h3 class="text-black font-medium truncate p-2">{title}</h3>
    <div class="flex items-center space-x-1 p-2">
      <button
        class="text-black hover:bg-gray-200/90 w-8 h-8 flex items-center justify-center rounded p-1"
        on:click={toggleMaximize}
        title={isMaximized ? "Restaurar" : "Maximizar"}
      >
        {#if isMaximized}
          <Minimize2 class="w-4 h-4" />
        {:else}
          <Maximize2 class="w-4 h-4" />
        {/if}
      </button>
      <button
        class="text-black hover:bg-red-500 w-8 rounded p-1"
        on:click={close}
        title="Fechar">×</button
      >
    </div>
  </div>

  <div
    class="window-content bg-gray-50/90 backdrop-blur backdrop:blur h-[calc(100%-40px)] p-4 overflow-auto"
  >
    <slot></slot>
  </div>
</div>

<style>
  .window-container {
    transition:
      width 0.2s,
      height 0.2s;
  }

  .maximized {
    border-radius: 0;
  }

  .window-header {
    height: 40px;
  }
</style>
