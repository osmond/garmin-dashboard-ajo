import { useEffect, useState } from 'react';

export default function AjoDashboard() {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/summary')
      .then(res => res.json())
      .then(data => setSummary(data))
      .catch(err => console.error('API error:', err));
  }, []);

  if (!summary) return <p>Loading...</p>;

  return (
    <div className="p-6 font-sans">
      <h1 className="text-2xl font-bold mb-4">Andy’s Garmin Summary</h1>
      <ul className="space-y-2">
        <li>Steps: {summary.steps}</li>
        <li>Resting HR: {summary.restingHr}</li>
        <li>VO2 Max: {summary.vo2max}</li>
        <li>Sleep Hours: {summary.sleep_hours}</li>
      </ul>
    </div>
  );
}
