import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Maquinário - SOMAR +Diretas",
  description: "Gerenciamento de maquinário do sistema SOMAR +Diretas",
}

export default function MaquinarioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
