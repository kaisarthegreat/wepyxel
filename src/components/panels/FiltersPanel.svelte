<script>
  import { PRESET_FILTERS } from '../../lib/filters/presetFilters';
  import { toolStore, setActiveFilter, setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { X, Check, RotateCcw } from 'lucide-svelte';

  function selectFilter(filterId) {
    setActiveFilter(filterId);
    canvasManager.previewFilters(filterId, $toolStore.adjustments);
  }

  function handleApply() {
    canvasManager.applyFilters();
    setActiveFilter('original');
    setActiveTool(null);
  }

  function handleCancel() {
    canvasManager.resetFiltersPreview();
    setActiveFilter('original');
    setActiveTool(null);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6 overflow-y-auto">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Preset Filters</h3>
    <button 
      class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800"
      on:click={handleCancel}
      title="Close"
    >
      <X size={18} />
    </button>
  </div>

  <div class="grid grid-cols-2 gap-3">
    {#each PRESET_FILTERS as filter}
      <button
        type="button"
        class="flex flex-col items-center justify-center p-3 rounded-xl border text-center transition duration-150
          {$toolStore.activeFilter === filter.id 
            ? 'border-brand-500 bg-brand-500/10 text-white font-medium shadow-sm shadow-brand-500/20' 
            : 'border-dark-800 bg-dark-850 hover:bg-dark-800 text-slate-300'}"
        on:click={() => selectFilter(filter.id)}
      >
        <span class="text-sm font-medium">{filter.name}</span>
      </button>
    {/each}
  </div>

  <div class="pt-4 border-t border-dark-800 flex flex-col space-y-2.5 mt-auto">
    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium text-sm transition duration-150 shadow-md shadow-brand-600/20"
      on:click={handleApply}
    >
      <Check size={16} />
      <span>Apply Filter</span>
    </button>

    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl font-medium text-xs transition duration-150"
      on:click={() => selectFilter('original')}
    >
      <RotateCcw size={14} />
      <span>Reset to Original</span>
    </button>
  </div>
</div>
