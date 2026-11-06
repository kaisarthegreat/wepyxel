<script>
  import { toolStore, setActiveTool } from '../../stores/toolStore';
  import { imageStore } from '../../stores/imageStore';
  import { 
    Crop, 
    RotateCw, 
    Scaling, 
    Sliders, 
    Sparkles, 
    Download 
  } from 'lucide-svelte';

  const tools = [
    { id: 'crop', label: 'Crop', icon: Crop },
    { id: 'rotate', label: 'Rotate & Flip', icon: RotateCw },
    { id: 'resize', label: 'Resize', icon: Scaling },
    { id: 'adjust', label: 'Adjust', icon: Sliders },
    { id: 'filters', label: 'Filters', icon: Sparkles },
    { id: 'export', label: 'Export', icon: Download }
  ];
</script>

<aside class="w-16 sm:w-20 bg-dark-900 border-r border-dark-800 flex flex-col items-center py-3 space-y-2 select-none z-10">
  {#each tools as tool}
    <button
      type="button"
      disabled={!$imageStore.hasImage && tool.id !== 'export'}
      class="w-12 h-12 sm:w-14 sm:h-14 flex flex-col items-center justify-center rounded-xl transition-all duration-150 relative group
        {$toolStore.activeTool === tool.id 
          ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30' 
          : 'text-slate-400 hover:text-slate-100 hover:bg-dark-800'}
        {!$imageStore.hasImage && tool.id !== 'export' ? 'opacity-40 cursor-not-allowed hover:bg-transparent hover:text-slate-400' : 'cursor-pointer'}"
      on:click={() => setActiveTool(tool.id)}
      title={tool.label}
      aria-label={tool.label}
    >
      <svelte:component this={tool.icon} size={20} />
      <span class="text-[10px] mt-1 font-medium tracking-tight truncate max-w-[48px]">{tool.label}</span>
      
      <!-- Tooltip -->
      <span class="absolute left-full ml-3 px-2 py-1 bg-dark-800 text-slate-200 text-xs rounded shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-50">
        {tool.label}
      </span>
    </button>
  {/each}
</aside>
