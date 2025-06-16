import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Funcionários - SOMAR +Diretas",
  description: "Gerenciamento de funcionários do sistema SOMAR +Diretas",
}

export default function FuncionariosLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
