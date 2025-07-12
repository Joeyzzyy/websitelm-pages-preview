import './globals.css'

export default function RootLayout({ children, keywords, robots }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} style={{ overflowX: 'hidden' }}>{children}</body>
    </html>
  )
}
