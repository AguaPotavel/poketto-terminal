<script lang="ts">
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  export let icon;
  export let isOpen: boolean = false;

  const openWindow = (id: number) => {
    dispatch("open", { id });
  };

  const startDrag = (event: MouseEvent, id: number) => {
    dispatch("drag", { event, id });
  };

  const onClose = (id: number) => {
    dispatch("close", { id });
  };
</script>

<div
  aria-hidden="true"
  class="desktop-icon absolute flex flex-col items-center cursor-pointer"
  style="left: {icon.x}px; top: {icon.y}px;"
  onmousedown={(e) => startDrag(e, icon.id)}
  ondblclick={() => openWindow(icon.id)}
>
  <div
    class="icon-container bg-gray-50/20 p-3 rounded-lg hover:bg-gray-400/30 transition-colors"
  >
    <svelte:component this={icon.component} class="w-10 h-10 text-black" />
  </div>
  <span class="text-black text-sm mt-1 px-2 py-1">{icon.name}</span>
</div>

<!-- {#if isOpen} -->
<!--   <div -->
<!--     class="fixed inset-0 flex items-center justify-center z-10" -->
<!--     onclick={(e) => onClose(icon.id)} -->
<!--     aria-hidden={true} -->
<!--   > -->
<!--     <div -->
<!--       class="bg-gray-100/90 backdrop-blur rounded-lg shadow-xl w-3/4 h-3/4 overflow-hidden" -->
<!--     > -->
<!--       <div -->
<!--         class="window-header bg-gray-50 p-2 flex justify-between items-center" -->
<!--       > -->
<!--         <h3 class="text-white font-medium"> -->
<!--           {icon.name || "Janela"} -->
<!--         </h3> -->
<!--         <button -->
<!--           class="text-black hover:bg-red-500 rounded px-2" -->
<!--           onclick={(e) => onClose(icon.id)}>×</button -->
<!--         > -->
<!--       </div> -->
<!---->
<!--       <div class="window-content p-4 h-[calc(100%-40px)] overflow-auto"> -->
<!--         <svelte:component this={icon.content} /> -->
<!--       </div> -->
<!--     </div> -->
<!--   </div> -->
<!-- {/if} -->

<style>
  .desktop-icon {
    transition: transform 0.1s;
  }

  .desktop-icon:active {
    transform: scale(1.05);
  }
</style>
