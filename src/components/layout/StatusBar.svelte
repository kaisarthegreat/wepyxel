<script>
  import { imageStore } from '../../stores/imageStore';

  function formatBytes(bytes) {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  }
</script>

<footer class="h-8 bg-dark-900 border-t border-dark-800 px-4 flex items-center justify-between text-xs text-slate-400 select-none">
  <div class="flex items-center space-x-4">
    {#if $imageStore.hasImage}
      <span class="font-medium text-slate-200 truncate max-w-[200px]" title={$imageStore.fileName}>
        {$imageStore.fileName}
      </span>
      <span class="text-slate-500">|</span>
      <span>{$imageStore.width} × {$imageStore.height} px</span>
      <span class="text-slate-500 hidden sm:inline">|</span>
      <span class="hidden sm:inline">{formatBytes($imageStore.fileSize)}</span>
    {:else}
      <span>No image loaded</span>
    {/if}
  </div>

  <div class="flex items-center space-x-4">
    {#if $imageStore.isProcessing}
      <div class="flex items-center space-x-2 text-brand-500 animate-pulse">
        <svg class="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
        </svg>
        <span>{$imageStore.processingMessage || 'Processing...'}</span>
      </div>
    {/if}
    {#if $imageStore.hasImage}
      <span class="font-mono text-slate-400">{Math.round($imageStore.zoom * 100)}%</span>
    {/if}
  </div>
</footer>
