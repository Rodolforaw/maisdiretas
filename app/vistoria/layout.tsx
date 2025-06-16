import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Vistoria - SOMAR +Diretas",
  description: "Vistoria de obras do sistema SOMAR +Diretas",
}

export default function VistoriaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
