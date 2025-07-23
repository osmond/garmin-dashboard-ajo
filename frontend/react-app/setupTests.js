/* global global */
import { expect } from 'vitest';
global.expect = expect;
await import('@testing-library/jest-dom');
