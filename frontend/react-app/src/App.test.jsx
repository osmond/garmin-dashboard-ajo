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
      intensity_minutes: 30,
      training_load: 500,
      body_battery: 80,
      stepsChart: { labels: ['00:00'], datasets: [{ data: [100] }] },
    };
    const weekly = [{ time: '2024-01-01', steps: 100 }];
    global.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(summary),
        text: () => Promise.resolve('')
      })
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(weekly),
        text: () => Promise.resolve('')
      });
    render(<App />);
    await screen.findByText('500');
  });

  it('shows error message if fetch fails', async () => {
    global.fetch = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve([]),
        text: () => Promise.resolve('')
      })

    render(<App />)
    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('fail')
  })
});
