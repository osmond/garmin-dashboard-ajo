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
      <Button variant="ghost" size="icon" aria-label="Settings">
        <Settings className="size-5" />
      </Button>
    </header>
  )
}
