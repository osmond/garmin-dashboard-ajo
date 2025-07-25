import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="size-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium text-muted-foreground">
          A
        </span>
        <h1 className="text-xl font-semibold md:text-2xl">Garmin Dashboard</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Settings"
        className="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 flex items-center gap-2"
      >
        <Settings className="size-5" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Settings</span>
      </Button>
    </header>
  )
}
