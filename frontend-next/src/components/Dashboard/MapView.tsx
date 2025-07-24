import Image from "next/image"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import useMockData from "@/hooks/useMockData"

export default function MapView() {
  const { data, isLoading } = useMockData()

  if (isLoading || !data) return null

  const latest = data.weekly[0]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Map View</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2">
        <Image src="/globe.svg" alt="Map" width={120} height={120} />
        {latest && (
          <p className="text-sm text-muted-foreground">
            Showing data for {new Date(latest.time).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}
