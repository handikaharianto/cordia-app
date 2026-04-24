function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="mx-auto max-w-7xl py-20">
      <div>{children}</div>
    </main>
  )
}

export default RootLayout
