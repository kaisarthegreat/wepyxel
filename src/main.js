import './app.css';
import App from './App.svelte';
import { registerSW } from 'virtual:pwa-register';

// Auto-register service worker for offline support
registerSW({
  immediate: true,
  onNeedRefresh() {
    console.log('[WePyxel] App update available');
  },
  onOfflineReady() {
    console.log('[WePyxel] App ready to work offline');
  }
});

const app = new App({
  target: document.getElementById('app')
});

export default app;
