import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { ThemeProvider } from '../components/theme-provider'
import ErrorBoundary from "../components/ErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme="zinc">
      <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
    </ThemeProvider>
  )
}
