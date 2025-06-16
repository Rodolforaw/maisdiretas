import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Administração - SOMAR +Diretas",
  description: "Painel administrativo do sistema SOMAR +Diretas",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
