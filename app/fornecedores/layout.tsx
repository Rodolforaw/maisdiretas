import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Fornecedores - SOMAR +Diretas",
  description: "Gerenciamento de fornecedores do sistema SOMAR +Diretas",
}

export default function FornecedoresLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
