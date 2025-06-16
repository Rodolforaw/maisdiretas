import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cadastro - SOMAR +Diretas",
  description: "Cadastro de usuários do sistema SOMAR +Diretas",
}

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
