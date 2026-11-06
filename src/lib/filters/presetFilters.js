/**
 * Preset filter definitions with canvas CSS filter / pixel formulas
 */
export const PRESET_FILTERS = [
  { id: 'original', name: 'Original', filter: 'none' },
  { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(100%)' },
  { id: 'sepia', name: 'Sepia', filter: 'sepia(85%) contrast(105%)' },
  { id: 'vintage', name: 'Vintage', filter: 'sepia(40%) contrast(120%) brightness(95%) hue-rotate(-15deg)' },
  { id: 'vivid', name: 'Vivid', filter: 'saturate(160%) contrast(115%)' },
  { id: 'cool', name: 'Cool', filter: 'hue-rotate(25deg) saturate(110%) brightness(102%)' },
  { id: 'warm', name: 'Warm', filter: 'sepia(25%) saturate(135%) brightness(105%)' },
  { id: 'fade', name: 'Fade', filter: 'contrast(85%) brightness(110%) saturate(85%)' }
];

export function getFilterString(filterId, adjustments = {}) {
  const parts = [];

  // 1. Base preset filter
  const preset = PRESET_FILTERS.find(f => f.id === filterId);
  if (preset && preset.filter !== 'none') {
    parts.push(preset.filter);
  }

  // 2. Adjustments
  const { brightness = 0, contrast = 0, saturation = 0, blur = 0 } = adjustments;

  if (brightness !== 0) {
    // -100 to 100 maps to 0% to 200%
    parts.push(`brightness(${100 + brightness}%)`);
  }
  if (contrast !== 0) {
    parts.push(`contrast(${100 + contrast}%)`);
  }
  if (saturation !== 0) {
    parts.push(`saturate(${100 + saturation}%)`);
  }
  if (blur > 0) {
    parts.push(`blur(${blur}px)`);
  }

  return parts.length > 0 ? parts.join(' ') : 'none';
}
