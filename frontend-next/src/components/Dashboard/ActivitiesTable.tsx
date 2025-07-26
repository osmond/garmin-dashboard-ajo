import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import Spinner from '@/components/Spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import useDashboardData from '@/hooks/useDashboardData'

export default function ActivitiesTable() {
  const { data, isLoading, error } = useDashboardData()

  if (isLoading) return <Spinner />
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Failed to load dashboard data: {error}. Ensure your Garmin session is
          valid.
        </AlertDescription>
      </Alert>
    )
  }
  if (!data) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activities</CardTitle>
      </CardHeader>
      <CardContent>
        {data.activities.length === 0 ? (
          <>No activities yet</>
        ) : (
          <>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b">
                  <tr className="text-[var(--muted-foreground)]">
                    <th className="py-2 pr-4">Date</th>
                    <th className="py-2 pr-4">Steps</th>
                    <th className="py-2 pr-4">Resting HR</th>
                    <th className="py-2">Sleep</th>
                  </tr>
                </thead>
                <tbody>
                  {data.activities.map((entry) => (
                    <tr key={entry.time} className="border-b last:border-b-0">
                      <td className="py-2 pr-4">
                        {new Date(entry.time).toLocaleDateString()}
                      </td>
                      <td className="py-2 pr-4">{entry.steps}</td>
                      <td className="py-2 pr-4">{entry.resting_hr}</td>
                      <td className="py-2">{entry.sleep_hours} hrs</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="space-y-2 sm:hidden">
              {data.activities.map((entry) => (
                <div
                  key={entry.time}
                  className="flex flex-col gap-1 rounded border p-2 text-sm"
                >
                  <div className="font-medium">
                    {new Date(entry.time).toLocaleDateString()}
                  </div>
                  <div className="flex justify-between">
                    <span>Steps: {entry.steps}</span>
                    <span>HR: {entry.resting_hr}</span>
                  </div>
                  <div>Sleep: {entry.sleep_hours} hrs</div>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
