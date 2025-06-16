import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ordens de Serviço - SOMAR +Diretas",
  description: "Gerenciamento de ordens de serviço do sistema SOMAR +Diretas",
}

export default function OrdensLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
