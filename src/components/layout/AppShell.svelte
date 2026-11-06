<script>
  import Toolbar from './Toolbar.svelte';
  import StatusBar from './StatusBar.svelte';
  import EditorCanvas from '../canvas/EditorCanvas.svelte';
  import CropPanel from '../panels/CropPanel.svelte';
  import RotatePanel from '../panels/RotatePanel.svelte';
  import ResizePanel from '../panels/ResizePanel.svelte';
  import AdjustmentsPanel from '../panels/AdjustmentsPanel.svelte';
  import FiltersPanel from '../panels/FiltersPanel.svelte';
  import ExportPanel from '../panels/ExportPanel.svelte';

  import { imageStore } from '../../stores/imageStore';
  import { toolStore, setActiveTool } from '../../stores/toolStore';
  import { historyStore } from '../../stores/historyStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { Undo2, Redo2, FolderOpen, Download } from 'lucide-svelte';

  let editorCanvasRef;

  function handleFileOpen() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        canvasManager.loadImage(file, file.name);
      }
    };
    input.click();
  }

  function handleApplyCrop() {
    if (editorCanvasRef) {
      editorCanvasRef.applyActiveCrop();
    }
  }
</script>

<div class="flex flex-col h-screen w-screen overflow-hidden bg-dark-950 font-sans">
  <!-- Top Navigation Header -->
  <header class="h-14 bg-dark-900 border-b border-dark-800 px-4 flex items-center justify-between select-none z-20">
    <div class="flex items-center space-x-6">
      <!-- Brand Logo -->
      <div class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-brand-500 flex items-center justify-center shadow-md shadow-brand-600/30">
          <svg class="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="M21 15l-5-5L5 21" />
          </svg>
        </div>
        <div class="flex flex-col">
          <span class="text-sm font-bold tracking-tight text-white leading-tight">WePyxel</span>
          <span class="text-[9px] text-slate-400 font-medium tracking-wide">IMAGE EDITOR PWA</span>
        </div>
      </div>

      <!-- File Open -->
      <button
        type="button"
        class="flex items-center space-x-2 py-1.5 px-3 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl text-xs font-medium transition duration-150"
        on:click={handleFileOpen}
        title="Open Image (Ctrl+O)"
      >
        <FolderOpen size={15} class="text-brand-400" />
        <span>Open</span>
      </button>

      <!-- History controls -->
      <div class="flex items-center space-x-1 border-l border-dark-800 pl-4">
        <button
          type="button"
          disabled={!$historyStore.canUndo}
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          on:click={() => canvasManager.undo()}
          title="Undo (Ctrl+Z)"
          aria-label="Undo"
        >
          <Undo2 size={18} />
        </button>

        <button
          type="button"
          disabled={!$historyStore.canRedo}
          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-dark-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
          on:click={() => canvasManager.redo()}
          title="Redo (Ctrl+Shift+Z or Ctrl+Y)"
          aria-label="Redo"
        >
          <Redo2 size={18} />
        </button>
      </div>
    </div>

    <!-- Quick Export Button -->
    <div class="flex items-center space-x-3">
      <button
        type="button"
        disabled={!$imageStore.hasImage}
        class="flex items-center space-x-2 py-1.5 px-3.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 transition duration-150"
        on:click={() => setActiveTool('export')}
        title="Export image"
      >
        <Download size={15} />
        <span>Export</span>
      </button>
    </div>
  </header>

  <!-- Main Workspace Area -->
  <div class="flex flex-1 overflow-hidden relative">
    <Toolbar />

    <!-- Center Canvas Work Area -->
    <main class="flex-1 h-full overflow-hidden relative flex">
      <EditorCanvas bind:this={editorCanvasRef} />
    </main>

    <!-- Right Side Panel (Visible when a tool is selected) -->
    {#if $toolStore.activeTool}
      <aside class="w-80 bg-dark-900 border-l border-dark-800 flex flex-col h-full z-10 transition-all duration-200">
        {#if $toolStore.activeTool === 'crop'}
          <CropPanel applyCropCallback={handleApplyCrop} />
        {:else if $toolStore.activeTool === 'rotate'}
          <RotatePanel />
        {:else if $toolStore.activeTool === 'resize'}
          <ResizePanel />
        {:else if $toolStore.activeTool === 'adjust'}
          <AdjustmentsPanel />
        {:else if $toolStore.activeTool === 'filters'}
          <FiltersPanel />
        {:else if $toolStore.activeTool === 'export'}
          <ExportPanel />
        {/if}
      </aside>
    {/if}
  </div>

  <!-- Bottom Status Bar -->
  <StatusBar />
</div>
