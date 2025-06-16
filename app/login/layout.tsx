import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login - SOMAR +Diretas",
  description: "Acesso ao sistema SOMAR +Diretas",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
