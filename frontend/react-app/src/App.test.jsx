import { render, screen } from '@testing-library/react';
import App from './App';
import { vi, describe, it, expect } from 'vitest';

vi.mock('react-chartjs-2', () => ({ Line: () => <div>Chart</div> }));

describe('App', () => {
  it('renders data from API', async () => {
    const summary = {
      steps: 100,
      resting_hr: 60,
      vo2max: 50,
      sleep_hours: 8,
      stepsChart: { labels: ['00:00'], datasets: [{ data: [100] }] },
    };
    global.fetch = vi.fn(() =>
      Promise.resolve({ json: () => Promise.resolve(summary) })
    );
    render(<App />);
    await screen.findByText('100');
  });
});
