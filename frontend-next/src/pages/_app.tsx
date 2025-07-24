import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { ThemeProvider } from '../components/theme-provider'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme="zinc">
      <Component {...pageProps} />
    </ThemeProvider>
  )
}
