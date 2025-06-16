import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mapa - SOMAR +Diretas",
  description: "Mapa interativo de obras do sistema SOMAR +Diretas",
}

export default function MapaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
