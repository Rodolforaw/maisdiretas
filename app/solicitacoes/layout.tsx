import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Solicitações - SOMAR +Diretas",
  description: "Gerenciamento de solicitações do sistema SOMAR +Diretas",
}

export default function SolicitacoesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
