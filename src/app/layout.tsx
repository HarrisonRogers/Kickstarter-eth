import { ThemeProvider } from '@/components/theme-provider'
import './globals.css'
import { Navbar } from '@/components/Navbar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex mx-auto w-full lg:max-w-screen-lg mt-20 p-2 md:p-3 lg:p-4 pt-16">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  )
}
