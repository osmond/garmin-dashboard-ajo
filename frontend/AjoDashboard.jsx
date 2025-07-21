import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

export default function AjoDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('/api/summary')
      .then((res) => res.json())
      .then((data) => setSummary(data));
  }, []);

  if (!summary) return <div className="p-6">Loading Andy's stats...</div>;

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Andy’s Dashboard</h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Daily Summary</h2>
        <ul className="space-y-1 text-gray-700 dark:text-gray-200">
          <li>Steps: {summary.steps}</li>
          <li>Resting HR: {summary.resting_hr} bpm</li>
          <li>VO₂ Max: {summary.vo2max} ml/kg/min</li>
          <li>Sleep: {summary.sleep_hours} hrs</li>
        </ul>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
        <h2 className="text-xl font-semibold mb-2">Steps (Last 7 Days)</h2>
        <Line data={summary.stepsChart} />
      </div>
    </div>
  );
}
