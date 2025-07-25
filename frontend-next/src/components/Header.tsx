import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="flex size-8 items-center justify-center rounded-full bg-[var(--muted)] text-sm font-medium text-[var(--muted-foreground)]">
          A
        </span>
        <h1 className="text-xl font-semibold md:text-2xl">Garmin Dashboard</h1>
      </div>
      <Button
        variant="ghost"
        size="sm"
        aria-label="Settings"
        className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2"
      >
        <Settings className="size-5" aria-hidden="true" />
        <span className="sr-only sm:not-sr-only">Settings</span>
      </Button>
    </header>
  )
}
