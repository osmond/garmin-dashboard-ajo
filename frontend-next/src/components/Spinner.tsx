import { LoaderCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Spinner({ className }: { className?: string }) {
  return (
    <LoaderCircle
      className={cn('size-5 animate-spin text-muted-foreground', className)}
    />
  )
}
