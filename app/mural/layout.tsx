import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Mural - SOMAR +Diretas",
  description: "Mural de fotos e informações do sistema SOMAR +Diretas",
}

export default function MuralLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
