import { imageStore, setImageMeta, setProcessing } from '../../stores/imageStore';
import { commandStack } from '../history/CommandStack';
import { getFilterString } from '../filters/presetFilters';
import pica from 'pica';

let picaInstance = null;
function getPica() {
  if (!picaInstance) {
    try {
      picaInstance = typeof pica === 'function' ? pica() : (pica?.default ? pica.default() : null);
    } catch (e) {
      console.warn('Pica initialization fallback:', e);
    }
  }
  return picaInstance;
}

class CanvasManager {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.container = null;
    this.currentImage = null; // HTMLImageElement
    this.isCropping = false;
    this.cropRect = null; // { x, y, width, height }
    this.scale = 1;
    this.pan = { x: 0, y: 0 };
    this.isPanning = false;
    this.startPan = { x: 0, y: 0 };
    this.filterString = 'none';
  }

  init(canvasEl, containerEl) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext('2d', { willReadFrequently: true });
    this.container = containerEl;
    this.setupEventListeners();
  }

  setupEventListeners() {
    if (!this.container) return;

    // Zoom on wheel with Ctrl or normal wheel
    this.container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;
      this.setZoom(this.scale * zoomFactor);
    }, { passive: false });

    // Pan with mouse drag if middle button or Space key pressed
    this.container.addEventListener('mousedown', (e) => {
      if (e.button === 1 || e.spaceKey) {
        this.isPanning = true;
        this.startPan = { x: e.clientX - this.pan.x, y: e.clientY - this.pan.y };
      }
    });

    window.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.pan = {
          x: e.clientX - this.startPan.x,
          y: e.clientY - this.startPan.y
        };
        this.applyTransform();
      }
    });

    window.addEventListener('mouseup', () => {
      this.isPanning = false;
    });
  }

  async loadImage(source, fileName = 'image.png') {
    setProcessing(true, 'Loading image...');
    try {
      let dataUrl;
      let fileSize = 0;
      let fileType = 'image/png';

      if (source instanceof File || source instanceof Blob) {
        fileSize = source.size;
        fileType = source.type || 'image/png';
        dataUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(source);
        });
      } else if (typeof source === 'string') {
        dataUrl = source;
      }

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.crossOrigin = 'anonymous';
        img.src = dataUrl;
      });

      this.currentImage = img;
      this.canvas.width = img.naturalWidth || img.width;
      this.canvas.height = img.naturalHeight || img.height;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.filter = 'none';
      this.ctx.drawImage(img, 0, 0);

      this.filterString = 'none';
      this.resetPanAndZoom();

      setImageMeta({
        fileName: fileName.replace(/\.[^/.]+$/, ''),
        fileSize,
        fileType,
        width: this.canvas.width,
        height: this.canvas.height,
        originalWidth: this.canvas.width,
        originalHeight: this.canvas.height,
        zoom: this.scale
      });

      // Clear history and push initial state
      commandStack.clear();
      this.saveSnapshot(true);
      return true;
    } catch (err) {
      console.error('Failed to load image:', err);
      throw err;
    } finally {
      setProcessing(false);
    }
  }

  saveSnapshot(initial = false) {
    if (!this.canvas) return;
    const dataUrl = this.canvas.toDataURL('image/png');
    commandStack.push({
      dataUrl,
      width: this.canvas.width,
      height: this.canvas.height
    });
  }

  async restoreState(state) {
    if (!state || !state.dataUrl) return;
    setProcessing(true, 'Restoring state...');
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = state.dataUrl;
      });

      this.currentImage = img;
      this.canvas.width = state.width;
      this.canvas.height = state.height;

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.filter = 'none';
      this.ctx.drawImage(img, 0, 0);

      imageStore.update(s => ({
        ...s,
        width: this.canvas.width,
        height: this.canvas.height
      }));

      this.resetPanAndZoom();
    } finally {
      setProcessing(false);
    }
  }

  undo() {
    const currentState = {
      dataUrl: this.canvas.toDataURL('image/png'),
      width: this.canvas.width,
      height: this.canvas.height
    };
    const targetState = commandStack.undo(currentState);
    if (targetState) {
      this.restoreState(targetState);
    }
  }

  redo() {
    const currentState = {
      dataUrl: this.canvas.toDataURL('image/png'),
      width: this.canvas.width,
      height: this.canvas.height
    };
    const targetState = commandStack.redo(currentState);
    if (targetState) {
      this.restoreState(targetState);
    }
  }

  // Transformations
  rotate(degrees) {
    if (!this.canvas) return;
    this.saveSnapshot();

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');

    const rad = (degrees * Math.PI) / 180;
    const isQuarterTurn = Math.abs(degrees) % 180 !== 0;

    tempCanvas.width = isQuarterTurn ? this.canvas.height : this.canvas.width;
    tempCanvas.height = isQuarterTurn ? this.canvas.width : this.canvas.height;

    tempCtx.translate(tempCanvas.width / 2, tempCanvas.height / 2);
    tempCtx.rotate(rad);
    tempCtx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);

    this.canvas.width = tempCanvas.width;
    this.canvas.height = tempCanvas.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);

    imageStore.update(s => ({
      ...s,
      width: this.canvas.width,
      height: this.canvas.height
    }));
    this.resetPanAndZoom();
  }

  flip(direction) {
    if (!this.canvas) return;
    this.saveSnapshot();

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.save();
    if (direction === 'horizontal') {
      tempCtx.translate(this.canvas.width, 0);
      tempCtx.scale(-1, 1);
    } else {
      tempCtx.translate(0, this.canvas.height);
      tempCtx.scale(1, -1);
    }
    tempCtx.drawImage(this.canvas, 0, 0);
    tempCtx.restore();

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  async resize(newWidth, newHeight) {
    if (!this.canvas) return;
    setProcessing(true, 'Resampling image...');
    try {
      this.saveSnapshot();

      const targetCanvas = document.createElement('canvas');
      targetCanvas.width = newWidth;
      targetCanvas.height = newHeight;

      // High-quality Lanczos3 downsampling/upsampling via Pica
      const resizer = getPica();
      if (resizer) {
        await resizer.resize(this.canvas, targetCanvas, {
          unsharpAmount: 80,
          unsharpRadius: 0.6,
          unsharpThreshold: 2
        });
      } else {
        const tCtx = targetCanvas.getContext('2d');
        tCtx.imageSmoothingEnabled = true;
        tCtx.imageSmoothingQuality = 'high';
        tCtx.drawImage(this.canvas, 0, 0, newWidth, newHeight);
      }

      this.canvas.width = newWidth;
      this.canvas.height = newHeight;
      this.ctx.clearRect(0, 0, newWidth, newHeight);
      this.ctx.drawImage(targetCanvas, 0, 0);

      imageStore.update(s => ({
        ...s,
        width: newWidth,
        height: newHeight
      }));
      this.resetPanAndZoom();
    } finally {
      setProcessing(false);
    }
  }

  crop(cropBox) {
    // cropBox: { x, y, width, height } in canvas pixel coordinates
    if (!this.canvas || !cropBox || cropBox.width <= 0 || cropBox.height <= 0) return;
    this.saveSnapshot();

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = Math.round(cropBox.width);
    tempCanvas.height = Math.round(cropBox.height);
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.drawImage(
      this.canvas,
      Math.round(cropBox.x),
      Math.round(cropBox.y),
      Math.round(cropBox.width),
      Math.round(cropBox.height),
      0,
      0,
      tempCanvas.width,
      tempCanvas.height
    );

    this.canvas.width = tempCanvas.width;
    this.canvas.height = tempCanvas.height;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);

    imageStore.update(s => ({
      ...s,
      width: this.canvas.width,
      height: this.canvas.height
    }));
    this.resetPanAndZoom();
  }

  // Filters & Adjustments preview & commit
  previewFilters(filterId, adjustments) {
    if (!this.canvas) return;
    const filterStr = getFilterString(filterId, adjustments);
    this.canvas.style.filter = filterStr;
    this.filterString = filterStr;
  }

  applyFilters() {
    if (!this.canvas || this.filterString === 'none') return;
    this.saveSnapshot();

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = this.canvas.width;
    tempCanvas.height = this.canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    tempCtx.filter = this.filterString;
    tempCtx.drawImage(this.canvas, 0, 0);

    this.canvas.style.filter = 'none';
    this.filterString = 'none';

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.drawImage(tempCanvas, 0, 0);
  }

  resetFiltersPreview() {
    if (this.canvas) {
      this.canvas.style.filter = 'none';
      this.filterString = 'none';
    }
  }

  // Export
  async exportBlob(format = 'image/png', quality = 0.92) {
    if (!this.canvas) return null;

    // Make sure pending filter preview is baked into exported data if desired
    let sourceCanvas = this.canvas;
    if (this.filterString && this.filterString !== 'none') {
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = this.canvas.width;
      tempCanvas.height = this.canvas.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.filter = this.filterString;
      tempCtx.drawImage(this.canvas, 0, 0);
      sourceCanvas = tempCanvas;
    }

    return new Promise((resolve) => {
      sourceCanvas.toBlob((blob) => {
        resolve(blob);
      }, format, quality);
    });
  }

  // Viewport / Zoom & Pan
  setZoom(newScale) {
    const clampedScale = Math.min(Math.max(newScale, 0.05), 10);
    this.scale = clampedScale;
    this.applyTransform();
    imageStore.update(s => ({ ...s, zoom: clampedScale }));
  }

  resetPanAndZoom() {
    if (!this.canvas || !this.container) return;
    const containerW = this.container.clientWidth;
    const containerH = this.container.clientHeight;

    const scaleX = (containerW - 64) / this.canvas.width;
    const scaleY = (containerH - 64) / this.canvas.height;
    const fitScale = Math.min(scaleX, scaleY, 1);

    this.scale = Math.max(fitScale, 0.1);
    this.pan = { x: 0, y: 0 };
    this.applyTransform();
    imageStore.update(s => ({ ...s, zoom: this.scale }));
  }

  applyTransform() {
    if (!this.canvas) return;
    this.canvas.style.transform = `translate(${this.pan.x}px, ${this.pan.y}px) scale(${this.scale})`;
  }
}

export const canvasManager = new CanvasManager();
