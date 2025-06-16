import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Materiais - SOMAR +Diretas",
  description: "Gerenciamento de materiais do sistema SOMAR +Diretas",
}

export default function MateriaisLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
