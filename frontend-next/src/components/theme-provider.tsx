'use client'

import { ThemeProvider as NextThemesProvider } from 'next-themes'
import type { ThemeProviderProps } from 'next-themes/dist/types'

interface Props extends ThemeProviderProps {
  theme?: string
}

export function ThemeProvider({ children, theme, ...props }: Props) {
  return (
    <NextThemesProvider defaultTheme={theme} attribute="class" {...props}>
      {children}
    </NextThemesProvider>
  )
}
