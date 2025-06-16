import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Relatórios - SOMAR +Diretas",
  description: "Relatórios do sistema SOMAR +Diretas",
}

export default function RelatoriosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
