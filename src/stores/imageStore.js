import { writable } from 'svelte/store';

export const imageStore = writable({
  hasImage: false,
  fileName: '',
  fileSize: 0,
  fileType: 'image/png',
  width: 0,
  height: 0,
  originalWidth: 0,
  originalHeight: 0,
  zoom: 1,
  isProcessing: false,
  processingMessage: ''
});

export function setImageMeta(meta) {
  imageStore.update(s => ({
    ...s,
    hasImage: true,
    ...meta
  }));
}

export function setProcessing(isProcessing, message = '') {
  imageStore.update(s => ({
    ...s,
    isProcessing,
    processingMessage: message
  }));
}

export function resetImageStore() {
  imageStore.set({
    hasImage: false,
    fileName: '',
    fileSize: 0,
    fileType: 'image/png',
    width: 0,
    height: 0,
    originalWidth: 0,
    originalHeight: 0,
    zoom: 1,
    isProcessing: false,
    processingMessage: ''
  });
}
