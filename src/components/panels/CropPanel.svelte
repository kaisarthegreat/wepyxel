<script>
  import { toolStore, setCropRatio, setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { X, Check } from 'lucide-svelte';

  const ratios = [
    { id: 'free', label: 'Free' },
    { id: '1:1', label: '1:1 Square' },
    { id: '16:9', label: '16:9 Landscape' },
    { id: '4:3', label: '4:3 Standard' },
    { id: '3:2', label: '3:2 Classic' }
  ];

  export let applyCropCallback = () => {};

  function handleCancel() {
    setActiveTool(null);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6 overflow-y-auto">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Crop Tool</h3>
    <button 
      class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800"
      on:click={handleCancel}
      title="Close"
    >
      <X size={18} />
    </button>
  </div>

  <div>
    <span class="text-xs text-slate-400 uppercase tracking-wider block mb-3 font-medium">Aspect Ratio</span>
    <div class="grid grid-cols-1 gap-2">
      {#each ratios as r}
        <button
          type="button"
          class="flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm transition duration-150
            {$toolStore.cropRatio === r.id
              ? 'border-brand-500 bg-brand-500/10 text-white font-medium'
              : 'border-dark-800 bg-dark-850 hover:bg-dark-800 text-slate-300'}"
          on:click={() => setCropRatio(r.id)}
        >
          <span>{r.label}</span>
          {#if $toolStore.cropRatio === r.id}
            <div class="w-2 h-2 rounded-full bg-brand-500"></div>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <div class="text-xs text-slate-400 bg-dark-800/60 p-3 rounded-xl border border-dark-700/50">
    💡 Drag handles on the canvas to resize the crop area. Drag the center to reposition.
  </div>

  <div class="pt-4 border-t border-dark-800 flex flex-col space-y-2 mt-auto">
    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium text-sm transition duration-150 shadow-md shadow-brand-600/20"
      on:click={applyCropCallback}
    >
      <Check size={16} />
      <span>Apply Crop</span>
    </button>

    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl font-medium text-xs transition duration-150"
      on:click={handleCancel}
    >
      <span>Cancel</span>
    </button>
  </div>
</div>
