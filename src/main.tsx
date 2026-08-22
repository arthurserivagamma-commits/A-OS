import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Universal safety polyfills for typed array/buffer slice compatibility
if (typeof ArrayBuffer !== 'undefined' && !('subarray' in ArrayBuffer.prototype)) {
  (ArrayBuffer.prototype as any).subarray = function (begin?: number, end?: number) {
    return new Uint8Array(this).subarray(begin, end);
  };
}
if (!('subarray' in Array.prototype)) {
  (Array.prototype as any).subarray = function (begin?: number, end?: number) {
    return this.slice(begin, end);
  };
}
if (!('subarray' in String.prototype)) {
  (String.prototype as any).subarray = function (begin?: number, end?: number) {
    return this.slice(begin, end);
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

