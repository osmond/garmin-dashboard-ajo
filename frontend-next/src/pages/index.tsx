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
import Header from '@/components/Header'

export default function HomePage() {
  return (
    <main className="p-6 md:p-10 max-w-screen-lg mx-auto space-y-6">
      <Header />
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="flex flex-wrap gap-2">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="map">Map</TabsTrigger>
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
        <TabsContent value="insights">
          <InsightsChart />
        </TabsContent>
        <TabsContent value="goals">
          <GoalsRing />
        </TabsContent>
        <TabsContent value="map">
          <MapView />
        </TabsContent>
      </Tabs>
    </main>
  )
}
