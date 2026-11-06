import { writable } from 'svelte/store';

export const toolStore = writable({
  activeTool: null, // 'crop' | 'rotate' | 'resize' | 'adjust' | 'filters' | 'export'
  cropRatio: 'free', // 'free' | '1:1' | '16:9' | '4:3' | '3:2'
  adjustments: {
    brightness: 0, // -100 to 100
    contrast: 0,   // -100 to 100
    saturation: 0, // -100 to 100
    blur: 0,       // 0 to 20
    sharpen: 0     // 0 to 100
  },
  activeFilter: 'original'
});

export function setActiveTool(tool) {
  toolStore.update(s => ({
    ...s,
    activeTool: s.activeTool === tool ? null : tool
  }));
}

export function setCropRatio(ratio) {
  toolStore.update(s => ({ ...s, cropRatio: ratio }));
}

export function updateAdjustment(name, value) {
  toolStore.update(s => ({
    ...s,
    adjustments: {
      ...s.adjustments,
      [name]: value
    }
  }));
}

export function resetAdjustments() {
  toolStore.update(s => ({
    ...s,
    adjustments: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpen: 0
    }
  }));
}

export function setActiveFilter(filterName) {
  toolStore.update(s => ({ ...s, activeFilter: filterName }));
}
