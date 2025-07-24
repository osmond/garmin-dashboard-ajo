import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs'
import OverviewCard from '@/components/Dashboard/OverviewCard'
import GoalsRing from '@/components/Dashboard/GoalsRing'
import MapView from '@/components/Dashboard/MapView'
import InsightsChart from '@/components/Dashboard/InsightsChart'
import ActivitiesTable from '@/components/Dashboard/ActivitiesTable'

export default function HomePage() {
  return (
    <main className="p-6 md:p-10 max-w-screen-lg mx-auto space-y-6">
      <h1 className="text-2xl font-semibold">Garmin Dashboard</h1>
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="md:col-span-1 lg:col-span-1">
              <OverviewCard />
            </div>
            <div className="md:col-span-1 lg:col-span-1">
              <GoalsRing />
            </div>
            <div className="md:col-span-2 lg:col-span-1">
              <MapView />
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <InsightsChart />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="activities">
          <ActivitiesTable />
        </TabsContent>
      </Tabs>
    </main>
  )
}
