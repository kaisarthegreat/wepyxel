import { writable } from 'svelte/store';

export const historyStore = writable({
  canUndo: false,
  canRedo: false,
  stackSize: 0,
  currentIndex: -1
});

export function updateHistoryState(canUndo, canRedo, stackSize, currentIndex) {
  historyStore.set({
    canUndo,
    canRedo,
    stackSize,
    currentIndex
  });
}
