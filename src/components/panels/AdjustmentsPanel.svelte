<script>
  import { toolStore, updateAdjustment, resetAdjustments, setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { X, RotateCcw, Check } from 'lucide-svelte';

  $: {
    // Whenever adjustments change, trigger preview in canvasManager
    canvasManager.previewFilters($toolStore.activeFilter, $toolStore.adjustments);
  }

  function handleReset() {
    resetAdjustments();
    canvasManager.previewFilters($toolStore.activeFilter, $toolStore.adjustments);
  }

  function handleApply() {
    canvasManager.applyFilters();
    resetAdjustments();
    setActiveTool(null);
  }

  function handleCancel() {
    canvasManager.resetFiltersPreview();
    resetAdjustments();
    setActiveTool(null);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6 overflow-y-auto">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Adjustments</h3>
    <button 
      class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800"
      on:click={handleCancel}
      title="Close"
    >
      <X size={18} />
    </button>
  </div>

  <div class="space-y-5">
    <!-- Brightness -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs font-medium">
        <span class="text-slate-300">Brightness</span>
        <span class="text-slate-400 font-mono">{$toolStore.adjustments.brightness > 0 ? '+' : ''}{$toolStore.adjustments.brightness}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        value={$toolStore.adjustments.brightness}
        on:input={(e) => updateAdjustment('brightness', parseInt(e.target.value, 10))}
        class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <!-- Contrast -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs font-medium">
        <span class="text-slate-300">Contrast</span>
        <span class="text-slate-400 font-mono">{$toolStore.adjustments.contrast > 0 ? '+' : ''}{$toolStore.adjustments.contrast}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        value={$toolStore.adjustments.contrast}
        on:input={(e) => updateAdjustment('contrast', parseInt(e.target.value, 10))}
        class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <!-- Saturation -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs font-medium">
        <span class="text-slate-300">Saturation</span>
        <span class="text-slate-400 font-mono">{$toolStore.adjustments.saturation > 0 ? '+' : ''}{$toolStore.adjustments.saturation}</span>
      </div>
      <input
        type="range"
        min="-100"
        max="100"
        value={$toolStore.adjustments.saturation}
        on:input={(e) => updateAdjustment('saturation', parseInt(e.target.value, 10))}
        class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>

    <!-- Blur -->
    <div class="space-y-1.5">
      <div class="flex justify-between text-xs font-medium">
        <span class="text-slate-300">Gaussian Blur</span>
        <span class="text-slate-400 font-mono">{$toolStore.adjustments.blur}px</span>
      </div>
      <input
        type="range"
        min="0"
        max="20"
        value={$toolStore.adjustments.blur}
        on:input={(e) => updateAdjustment('blur', parseInt(e.target.value, 10))}
        class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
      />
    </div>
  </div>

  <div class="pt-4 border-t border-dark-800 flex flex-col space-y-2.5 mt-auto">
    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium text-sm transition duration-150 shadow-md shadow-brand-600/20"
      on:click={handleApply}
    >
      <Check size={16} />
      <span>Apply Adjustments</span>
    </button>

    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-2 bg-dark-800 hover:bg-dark-700 text-slate-300 rounded-xl font-medium text-xs transition duration-150"
      on:click={handleReset}
    >
      <RotateCcw size={14} />
      <span>Reset Sliders</span>
    </button>
  </div>
</div>
