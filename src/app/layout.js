import './globals.css'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} style={{ overflowX: 'hidden' }}>{children}</body>
    </html>
  )
}
