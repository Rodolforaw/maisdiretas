import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Ponto - SOMAR +Diretas",
  description: "Registro de ponto do sistema SOMAR +Diretas",
}

export default function PontoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
