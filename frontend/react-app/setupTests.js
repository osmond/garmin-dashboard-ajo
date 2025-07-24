/* global global */
import { expect } from 'vitest';
global.expect = expect;
await import('@testing-library/jest-dom');

// Polyfill for recharts ResponsiveContainer
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
