<script>
  import { imageStore } from '../../stores/imageStore';
  import { setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { X, Lock, Unlock, Check } from 'lucide-svelte';

  let mode = 'pixels'; // 'pixels' | 'percent'
  let width = $imageStore.width || 800;
  let height = $imageStore.height || 600;
  let percent = 100;
  let lockAspectRatio = true;

  $: aspectRatio = ($imageStore.width && $imageStore.height) 
    ? $imageStore.width / $imageStore.height 
    : 1;

  function onWidthChange(val) {
    width = Math.max(1, Math.round(val));
    if (lockAspectRatio) {
      height = Math.max(1, Math.round(width / aspectRatio));
    }
  }

  function onHeightChange(val) {
    height = Math.max(1, Math.round(val));
    if (lockAspectRatio) {
      width = Math.max(1, Math.round(height * aspectRatio));
    }
  }

  function onPercentChange(val) {
    percent = Math.max(1, Math.min(val, 500));
    width = Math.round(($imageStore.width * percent) / 100);
    height = Math.round(($imageStore.height * percent) / 100);
  }

  async function handleApply() {
    await canvasManager.resize(width, height);
    setActiveTool(null);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6 overflow-y-auto">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Resize Image</h3>
    <button 
      class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800"
      on:click={() => setActiveTool(null)}
      title="Close"
    >
      <X size={18} />
    </button>
  </div>

  <!-- Unit selector -->
  <div class="flex bg-dark-800 p-1 rounded-xl">
    <button
      type="button"
      class="flex-1 py-1.5 text-xs font-medium rounded-lg transition duration-150 {mode === 'pixels' ? 'bg-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
      on:click={() => mode = 'pixels'}
    >
      Pixels
    </button>
    <button
      type="button"
      class="flex-1 py-1.5 text-xs font-medium rounded-lg transition duration-150 {mode === 'percent' ? 'bg-dark-700 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}"
      on:click={() => mode = 'percent'}
    >
      Percentage
    </button>
  </div>

  {#if mode === 'pixels'}
    <div class="space-y-4">
      <div>
        <label for="resize-w" class="text-xs text-slate-400 block mb-1 font-medium">Width (px)</label>
        <input
          id="resize-w"
          type="number"
          min="1"
          max="10000"
          bind:value={width}
          on:input={(e) => onWidthChange(e.target.value)}
          class="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      <div>
        <label for="resize-h" class="text-xs text-slate-400 block mb-1 font-medium">Height (px)</label>
        <input
          id="resize-h"
          type="number"
          min="1"
          max="10000"
          bind:value={height}
          on:input={(e) => onHeightChange(e.target.value)}
          class="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-brand-500"
        />
      </div>

      <button
        type="button"
        class="flex items-center space-x-2 text-xs font-medium text-slate-300 hover:text-white"
        on:click={() => lockAspectRatio = !lockAspectRatio}
      >
        {#if lockAspectRatio}
          <Lock size={15} class="text-brand-500" />
          <span>Maintain aspect ratio</span>
        {:else}
          <Unlock size={15} class="text-slate-500" />
          <span>Aspect ratio unlocked</span>
        {/if}
      </button>
    </div>
  {:else}
    <div class="space-y-4">
      <div>
        <div class="flex justify-between text-xs font-medium mb-1.5">
          <span class="text-slate-300">Scale</span>
          <span class="text-slate-400 font-mono">{percent}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="200"
          bind:value={percent}
          on:input={(e) => onPercentChange(parseInt(e.target.value, 10))}
          class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      <div class="grid grid-cols-4 gap-2 pt-2">
        {#each [25, 50, 75, 100] as p}
          <button
            type="button"
            class="py-1.5 bg-dark-800 hover:bg-dark-700 text-xs text-slate-300 rounded-lg"
            on:click={() => onPercentChange(p)}
          >
            {p}%
          </button>
        {/each}
      </div>

      <div class="text-xs text-slate-400 pt-2">
        New dimensions: <span class="text-slate-200 font-mono">{width} × {height} px</span>
      </div>
    </div>
  {/if}

  <div class="pt-4 border-t border-dark-800 mt-auto">
    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium text-sm transition duration-150 shadow-md shadow-brand-600/20"
      on:click={handleApply}
    >
      <Check size={16} />
      <span>Apply Resize</span>
    </button>
  </div>
</div>
