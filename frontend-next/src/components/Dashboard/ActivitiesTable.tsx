import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useMockData from "@/hooks/useMockData"

export default function ActivitiesTable() {
  const { data, isLoading } = useMockData()

  if (isLoading || !data) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b">
              <tr className="text-muted-foreground">
                <th className="py-2 pr-4">Date</th>
                <th className="py-2 pr-4">Steps</th>
                <th className="py-2 pr-4">Resting HR</th>
                <th className="py-2">Sleep</th>
              </tr>
            </thead>
            <tbody>
              {data.weekly.map(entry => (
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
      </CardContent>
    </Card>
  )
}
