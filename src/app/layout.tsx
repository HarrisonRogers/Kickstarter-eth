import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import Container from '@/components/ui/container';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
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
          <Container className="items-center justify-center">
            {children}
          </Container>
        </ThemeProvider>
      </body>
    </html>
  );
}
