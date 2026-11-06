<script>
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { setActiveTool } from '../../stores/toolStore';
  import { RotateCcw, RotateCw, FlipHorizontal, FlipVertical, X } from 'lucide-svelte';

  function handleRotate(deg) {
    canvasManager.rotate(deg);
  }

  function handleFlip(dir) {
    canvasManager.flip(dir);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Rotate & Flip</h3>
    <button 
      class="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-dark-800"
      on:click={() => setActiveTool(null)}
      title="Close"
    >
      <X size={18} />
    </button>
  </div>

  <div class="space-y-4">
    <div>
      <span class="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Rotation</span>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="flex items-center justify-center space-x-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl transition duration-150 font-medium text-sm"
          on:click={() => handleRotate(-90)}
        >
          <RotateCcw size={18} class="text-brand-500" />
          <span>90° Left</span>
        </button>

        <button
          type="button"
          class="flex items-center justify-center space-x-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl transition duration-150 font-medium text-sm"
          on:click={() => handleRotate(90)}
        >
          <RotateCw size={18} class="text-brand-500" />
          <span>90° Right</span>
        </button>
      </div>
    </div>

    <div>
      <span class="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Flip</span>
      <div class="grid grid-cols-2 gap-3">
        <button
          type="button"
          class="flex items-center justify-center space-x-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl transition duration-150 font-medium text-sm"
          on:click={() => handleFlip('horizontal')}
        >
          <FlipHorizontal size={18} class="text-brand-500" />
          <span>Horizontal</span>
        </button>

        <button
          type="button"
          class="flex items-center justify-center space-x-2 py-3 px-4 bg-dark-800 hover:bg-dark-700 text-slate-200 rounded-xl transition duration-150 font-medium text-sm"
          on:click={() => handleFlip('vertical')}
        >
          <FlipVertical size={18} class="text-brand-500" />
          <span>Vertical</span>
        </button>
      </div>
    </div>
  </div>
</div>
