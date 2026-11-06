<script>
  import { imageStore } from '../../stores/imageStore';
  import { setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { X, Download } from 'lucide-svelte';

  let format = 'image/png';
  let quality = 90;
  let estimatedSize = '';

  const formats = [
    { id: 'image/png', label: 'PNG', ext: 'png', lossy: false },
    { id: 'image/jpeg', label: 'JPEG', ext: 'jpg', lossy: true },
    { id: 'image/webp', label: 'WebP', ext: 'webp', lossy: true }
  ];

  $: activeExt = formats.find(f => f.id === format)?.ext || 'png';
  $: isLossy = formats.find(f => f.id === format)?.lossy;

  function updateEstimate() {
    if (!$imageStore.width || !$imageStore.height) return;
    const pixels = $imageStore.width * $imageStore.height;
    let bytes = 0;
    if (format === 'image/png') {
      bytes = pixels * 1.5;
    } else if (format === 'image/jpeg') {
      bytes = (pixels * 0.25) * (quality / 100);
    } else {
      bytes = (pixels * 0.18) * (quality / 100);
    }
    const mb = bytes / (1024 * 1024);
    estimatedSize = mb > 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
  }

  $: format, quality, updateEstimate();

  async function handleDownload() {
    const blob = await canvasManager.exportBlob(format, quality / 100);
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const baseName = $imageStore.fileName || 'image';
    a.download = `${baseName}-edited.${activeExt}`;
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
</script>

<div class="p-5 flex flex-col h-full space-y-6 overflow-y-auto">
  <div class="flex items-center justify-between pb-3 border-b border-dark-800">
    <h3 class="text-sm font-semibold uppercase tracking-wider text-slate-200">Export & Save</h3>
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
      <span class="text-xs text-slate-400 uppercase tracking-wider block mb-2 font-medium">Format</span>
      <div class="grid grid-cols-3 gap-2">
        {#each formats as f}
          <button
            type="button"
            class="py-2.5 px-3 rounded-xl border text-center text-xs font-semibold transition duration-150
              {format === f.id
                ? 'border-brand-500 bg-brand-500/10 text-white'
                : 'border-dark-800 bg-dark-850 hover:bg-dark-800 text-slate-300'}"
            on:click={() => format = f.id}
          >
            {f.label}
          </button>
        {/each}
      </div>
    </div>

    {#if isLossy}
      <div class="space-y-1.5 pt-2">
        <div class="flex justify-between text-xs font-medium">
          <span class="text-slate-300">Quality</span>
          <span class="text-slate-400 font-mono">{quality}%</span>
        </div>
        <input
          type="range"
          min="10"
          max="100"
          bind:value={quality}
          class="w-full accent-brand-500 bg-dark-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
      </div>
    {/if}

    <div class="bg-dark-850 p-3.5 rounded-xl border border-dark-800 space-y-2 text-xs">
      <div class="flex justify-between text-slate-400">
        <span>Output Dimensions</span>
        <span class="text-slate-200 font-mono">{$imageStore.width} × {$imageStore.height} px</span>
      </div>
      <div class="flex justify-between text-slate-400">
        <span>Estimated Size</span>
        <span class="text-slate-200 font-mono">~{estimatedSize}</span>
      </div>
      <div class="flex justify-between text-slate-400">
        <span>Processing</span>
        <span class="text-brand-400">100% Client-side</span>
      </div>
    </div>
  </div>

  <div class="pt-4 border-t border-dark-800 mt-auto">
    <button
      type="button"
      class="w-full flex items-center justify-center space-x-2 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-xl font-medium text-sm transition duration-150 shadow-lg shadow-brand-600/30"
      on:click={handleDownload}
    >
      <Download size={18} />
      <span>Download Image</span>
    </button>
  </div>
</div>
