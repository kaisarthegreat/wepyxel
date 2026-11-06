<script>
  import { onMount } from 'svelte';
  import { imageStore } from '../../stores/imageStore';
  import { toolStore, setActiveTool } from '../../stores/toolStore';
  import { canvasManager } from '../../lib/canvas/fabricWrapper';
  import { Upload, Image as ImageIcon, ZoomIn, ZoomOut, Maximize2 } from 'lucide-svelte';

  let canvasEl;
  let containerEl;
  let fileInput;
  let isDragging = false;

  // Crop overlay state
  let cropBox = { x: 50, y: 50, width: 200, height: 200 };
  let isDraggingCrop = false;
  let dragMode = null; // 'move' | 'nw' | 'ne' | 'se' | 'sw'
  let dragStart = { x: 0, y: 0 };
  let initialCrop = { ...cropBox };

  onMount(() => {
    if (canvasEl && containerEl) {
      canvasManager.init(canvasEl, containerEl);
    }

    // Global keyboard shortcuts
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          canvasManager.redo();
        } else {
          canvasManager.undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        canvasManager.redo();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        fileInput?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // When crop tool becomes active, initialize cropBox to 80% of canvas
  $: if ($toolStore.activeTool === 'crop' && canvasEl) {
    initCropBox();
  }

  function initCropBox() {
    if (!canvasEl) return;
    const w = canvasEl.width;
    const h = canvasEl.height;
    const cropW = Math.round(w * 0.8);
    let cropH = Math.round(h * 0.8);

    if ($toolStore.cropRatio === '1:1') {
      const min = Math.min(cropW, cropH);
      cropBox = { x: (w - min) / 2, y: (h - min) / 2, width: min, height: min };
    } else if ($toolStore.cropRatio === '16:9') {
      cropH = Math.round((cropW * 9) / 16);
      cropBox = { x: (w - cropW) / 2, y: (h - cropH) / 2, width: cropW, height: cropH };
    } else if ($toolStore.cropRatio === '4:3') {
      cropH = Math.round((cropW * 3) / 4);
      cropBox = { x: (w - cropW) / 2, y: (h - cropH) / 2, width: cropW, height: cropH };
    } else if ($toolStore.cropRatio === '3:2') {
      cropH = Math.round((cropW * 2) / 3);
      cropBox = { x: (w - cropW) / 2, y: (h - cropH) / 2, width: cropW, height: cropH };
    } else {
      cropBox = { x: (w - cropW) / 2, y: (h - cropH) / 2, width: cropW, height: cropH };
    }
  }

  export function applyActiveCrop() {
    canvasManager.crop(cropBox);
    setActiveTool(null);
  }

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (file) {
      canvasManager.loadImage(file, file.name);
    }
  }

  function handleDrop(e) {
    e.preventDefault();
    isDragging = false;
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) {
      canvasManager.loadImage(file, file.name);
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    isDragging = true;
  }

  function handleDragLeave() {
    isDragging = false;
  }

  // Crop drag interactions
  function onCropMouseDown(e, mode) {
    e.stopPropagation();
    isDraggingCrop = true;
    dragMode = mode;
    dragStart = { x: e.clientX, y: e.clientY };
    initialCrop = { ...cropBox };

    const onMouseMove = (moveEvent) => {
      if (!isDraggingCrop || !canvasManager.scale) return;
      const dx = (moveEvent.clientX - dragStart.x) / canvasManager.scale;
      const dy = (moveEvent.clientY - dragStart.y) / canvasManager.scale;

      if (dragMode === 'move') {
        const maxX = canvasEl.width - initialCrop.width;
        const maxY = canvasEl.height - initialCrop.height;
        cropBox.x = Math.max(0, Math.min(initialCrop.x + dx, maxX));
        cropBox.y = Math.max(0, Math.min(initialCrop.y + dy, maxY));
      } else if (dragMode === 'se') {
        let newW = Math.max(20, initialCrop.width + dx);
        let newH = Math.max(20, initialCrop.height + dy);
        cropBox.width = Math.min(newW, canvasEl.width - cropBox.x);
        cropBox.height = Math.min(newH, canvasEl.height - cropBox.y);
      }
    };

    const onMouseUp = () => {
      isDraggingCrop = false;
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  }
</script>

<div 
  bind:this={containerEl}
  class="relative flex-1 h-full w-full overflow-hidden flex items-center justify-center canvas-checkerboard select-none"
  on:drop={handleDrop}
  on:dragover={handleDragOver}
  on:dragleave={handleDragLeave}
  role="region"
  aria-label="Canvas Workspace"
>
  <input
    bind:this={fileInput}
    type="file"
    accept="image/*"
    class="hidden"
    on:change={handleFileSelect}
  />

  {#if !$imageStore.hasImage}
    <!-- Empty state drop zone -->
    <div 
      class="max-w-md w-full mx-4 p-8 border-2 border-dashed rounded-3xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200
        {isDragging 
          ? 'border-brand-500 bg-brand-500/10 scale-102' 
          : 'border-dark-700 bg-dark-900/80 hover:border-slate-500 hover:bg-dark-850'}"
      on:click={() => fileInput.click()}
      on:keydown={(e) => e.key === 'Enter' && fileInput.click()}
      tabindex="0"
      role="button"
    >
      <div class="w-16 h-16 rounded-2xl bg-brand-500/10 text-brand-400 flex items-center justify-center mb-4">
        <Upload size={32} />
      </div>
      <h3 class="text-lg font-semibold text-white mb-1">Open or drop an image</h3>
      <p class="text-xs text-slate-400 mb-5">Supports PNG, JPG, WebP, SVG, BMP • 100% Client-side</p>
      <button
        type="button"
        class="px-5 py-2.5 bg-brand-600 hover:bg-brand-500 text-white rounded-xl text-xs font-semibold shadow-md shadow-brand-600/30 transition duration-150"
      >
        Choose File
      </button>
    </div>
  {/if}

  <!-- The HTML5 Canvas -->
  <div class="relative origin-center" class:hidden={!$imageStore.hasImage}>
    <canvas 
      bind:this={canvasEl}
      class="rounded-sm shadow-2xl transition-transform duration-75 origin-center block"
    ></canvas>

    <!-- Interactive Crop Overlay -->
    {#if $toolStore.activeTool === 'crop'}
      <div 
        class="absolute border-2 border-brand-400 bg-brand-400/15 cursor-move"
        style="
          left: {cropBox.x * canvasManager.scale}px;
          top: {cropBox.y * canvasManager.scale}px;
          width: {cropBox.width * canvasManager.scale}px;
          height: {cropBox.height * canvasManager.scale}px;
        "
        on:mousedown={(e) => onCropMouseDown(e, 'move')}
        role="button"
        tabindex="0"
        aria-label="Crop Box"
      >
        <!-- Resize handle SE -->
        <div 
          class="absolute -right-2 -bottom-2 w-4 h-4 bg-white border-2 border-brand-500 rounded-full cursor-se-resize shadow"
          on:mousedown={(e) => onCropMouseDown(e, 'se')}
          role="slider"
          tabindex="0"
          aria-label="Resize Crop Corner"
        ></div>
      </div>
    {/if}
  </div>

  <!-- Zoom & Viewport floating controls -->
  {#if $imageStore.hasImage}
    <div class="absolute bottom-4 right-4 flex items-center space-x-1 bg-dark-900/90 backdrop-blur border border-dark-800 p-1.5 rounded-2xl shadow-xl z-20">
      <button 
        type="button"
        class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-dark-800 transition"
        on:click={() => canvasManager.setZoom(canvasManager.scale * 0.85)}
        title="Zoom Out"
      >
        <ZoomOut size={16} />
      </button>

      <span class="text-xs font-mono text-slate-300 px-2 min-w-[48px] text-center">
        {Math.round($imageStore.zoom * 100)}%
      </span>

      <button 
        type="button"
        class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-dark-800 transition"
        on:click={() => canvasManager.setZoom(canvasManager.scale * 1.15)}
        title="Zoom In"
      >
        <ZoomIn size={16} />
      </button>

      <div class="w-px h-4 bg-dark-700 mx-1"></div>

      <button 
        type="button"
        class="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-dark-800 transition"
        on:click={() => canvasManager.resetPanAndZoom()}
        title="Fit to Screen"
      >
        <Maximize2 size={16} />
      </button>
    </div>
  {/if}
</div>
