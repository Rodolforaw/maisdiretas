import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Diário - SOMAR +Diretas",
  description: "Diário de obras do sistema SOMAR +Diretas",
}

export default function DiarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
