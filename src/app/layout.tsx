import './globals.css'
import ClientProvider from '@/providers/ClientProvider'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <main className="flex min-h-screen mx-auto w-full lg:max-w-screen-lg p-2 md:p-3 lg:p-4">
          <ClientProvider>{children}</ClientProvider>
        </main>
      </body>
    </html>
  )
}
