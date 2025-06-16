"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermissions?: string[]
  requiredRole?: string
  fallback?: React.ReactNode
}

export function PermissionGuard({ children, requiredPermissions = [], requiredRole, fallback }: PermissionGuardProps) {
  const [user, setUser] = useState(null)
  const [hasPermission, setHasPermission] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")

    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    setUser(parsedUser)

    // Verificar permissões
    let hasRequiredPermissions = true

    if (requiredPermissions.length > 0) {
      hasRequiredPermissions = requiredPermissions.every((permission) => parsedUser.permissions?.includes(permission))
    }

    if (requiredRole) {
      hasRequiredPermissions = hasRequiredPermissions && parsedUser.cargo === requiredRole
    }

    setHasPermission(hasRequiredPermissions)
    setLoading(false)
  }, [requiredPermissions, requiredRole, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!hasPermission) {
    if (fallback) {
      return <>{fallback}</>
    }

    return (
      <div className="container mx-auto p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-700">
            <strong>Acesso Negado</strong>
            <br />
            Você não tem permissão para acessar esta página.
            {requiredPermissions.length > 0 && (
              <div className="mt-2">
                <span className="text-sm">Permissões necessárias: {requiredPermissions.join(", ")}</span>
              </div>
            )}
            {requiredRole && (
              <div className="mt-1">
                <span className="text-sm">Cargo necessário: {requiredRole}</span>
              </div>
            )}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return <>{children}</>
}

// Hook para verificar permissões
export function usePermissions() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const hasPermission = (permission: string) => {
    return user?.permissions?.includes(permission) || false
  }

  const hasRole = (role: string) => {
    return user?.cargo === role
  }

  const hasAnyPermission = (permissions: string[]) => {
    return permissions.some((permission) => hasPermission(permission))
  }

  const hasAllPermissions = (permissions: string[]) => {
    return permissions.every((permission) => hasPermission(permission))
  }

  return {
    user,
    hasPermission,
    hasRole,
    hasAnyPermission,
    hasAllPermissions,
  }
}
