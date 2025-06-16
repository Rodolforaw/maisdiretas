import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Obras - SOMAR +Diretas",
  description: "Gerenciamento de obras do sistema SOMAR +Diretas",
}

export default function ObrasLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
