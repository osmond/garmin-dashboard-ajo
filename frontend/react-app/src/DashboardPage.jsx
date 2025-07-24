// src/pages/DashboardPage.jsx
import { useEffect, useState } from "react";
import CalendarPanel from "../CalendarPanel";
import InsightsPanel from "../InsightsPanel";
import ComparePanel from "../ComparePanel";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [weekly, setWeekly] = useState(null);
  const [history, setHistory] = useState(null);
  const [error, setError] = useState(null);

  const fetchAllData = () => {
    fetch("/api/summary")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setSummary)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });

    fetch("/api/weekly")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setWeekly)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });

    fetch("/api/history?days=30")
      .then(async (res) => {
        if (!res.ok) throw new Error(await res.text());
        return res.json();
      })
      .then(setHistory)
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });
  };

  useEffect(fetchAllData, []);

  return (
    <main className="p-6 max-w-screen-xl mx-auto text-foreground space-y-8 bg-background">
      <header>
        <h1 className="text-2xl font-semibold mb-4">Garmin Dashboard</h1>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
          </CardHeader>
          <CardContent>
            <CalendarPanel />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Key Metrics</CardTitle>
            <Button size="sm" variant="outline" onClick={fetchAllData}>
              Reload
            </Button>
          </CardHeader>
          <CardContent>
            {summary ? (
              <div className="text-sm space-y-1">
                <p><strong>Steps:</strong> {summary.steps}</p>
                <p><strong>Resting HR:</strong> {summary.restingHR}</p>
                <p><strong>Sleep:</strong> {summary.sleep?.toFixed(1)} hrs</p>
                <p><strong>VO₂ Max:</strong> {summary.vo2max}</p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Loading summary...</p>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <InsightsPanel history={history} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <ComparePanel weekly={weekly} />
          </CardContent>
        </Card>
      </section>

      {error && (
        <div className="text-sm text-destructive font-medium">
          Error loading data: {error}
        </div>
      )}
    </main>
  );
}
