"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { HardHat, Eye, EyeOff, Waves, Shield, Users, Crown } from "lucide-react"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    usuario: "",
    password: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Usuários completos para demonstração
  const usuarios = [
    {
      username: "admin",
      password: "admin123",
      name: "Administrador do Sistema",
      email: "admin@somar.com.br",
      cargo: "admin",
      permissions: ["read", "write", "delete", "manage", "users", "reports", "system"],
      avatar: "/placeholder.svg?height=40&width=40",
      isTestMode: true,
    },
    {
      username: "master",
      password: "master2024",
      name: "Master User",
      email: "master@somar.com.br",
      cargo: "master",
      permissions: ["read", "write", "delete", "manage", "users", "reports", "system", "admin"],
      avatar: "/placeholder.svg?height=40&width=40",
      isTestMode: true,
    },
    {
      username: "gerente01",
      password: "gerente123",
      name: "João Silva",
      email: "joao.silva@somar.com.br",
      cargo: "gerente",
      permissions: ["read", "write", "manage", "reports"],
      avatar: "/placeholder.svg?height=40&width=40",
      isTestMode: true,
    },
  ]

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    setTimeout(() => {
      const user = usuarios.find((u) => u.username === formData.usuario && u.password === formData.password)

      if (user) {
        localStorage.setItem("user", JSON.stringify(user))
        localStorage.setItem("isAuthenticated", "true")
        router.push("/dashboard")
      } else {
        setError("Usuário ou senha incorretos")
      }
      setLoading(false)
    }, 1000)
  }

  const fillCredentials = (username: string, password: string) => {
    setFormData({ usuario: username, password })
  }

  const demoUsers = [
    {
      username: "admin",
      password: "admin123",
      role: "Administrador",
      icon: Shield,
      color: "text-red-600",
      description: "Acesso total ao sistema",
    },
    {
      username: "master",
      password: "master2024",
      role: "Master",
      icon: Crown,
      color: "text-purple-600",
      description: "Super usuário",
    },
    {
      username: "gerente01",
      password: "gerente123",
      role: "Gerente",
      icon: Users,
      color: "text-blue-600",
      description: "Gestão de obras",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-red-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-48 h-48 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-36 h-36 bg-red-400 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-3 rounded-2xl shadow-lg">
              <HardHat className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-blue-800 bg-clip-text text-transparent">
            SOMAR +Diretas
          </h1>
          <p className="text-gray-600 text-sm mt-1">Sistema Completo de Obras Públicas</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Waves className="h-4 w-4 text-blue-500" />
            <span className="text-xs text-gray-500">Prefeitura de Maricá - RJ</span>
          </div>
        </div>

        {/* Formulário de Login */}
        <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">Acesso ao Sistema</CardTitle>
            <CardDescription className="text-center text-gray-600">
              Sistema Integrado de Gestão de Obras Públicas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="usuario" className="text-sm font-medium text-gray-700">
                  Usuário
                </Label>
                <Input
                  id="usuario"
                  type="text"
                  placeholder="Digite seu usuário"
                  value={formData.usuario}
                  onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                  className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Senha
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500 pr-10"
                    required
                    disabled={loading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200"
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Autenticando...
                  </div>
                ) : (
                  "Entrar no Sistema"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Usuários Demo */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">🎯 Demonstração - Clique para Testar</CardTitle>
            <CardDescription className="text-xs">Sistema completo com diferentes níveis de acesso</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoUsers.map((user) => {
              const IconComponent = user.icon
              return (
                <Button
                  key={user.username}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-xs p-3 h-auto"
                  onClick={() => fillCredentials(user.username, user.password)}
                  disabled={loading}
                >
                  <IconComponent className={`mr-3 h-4 w-4 ${user.color}`} />
                  <div className="text-left flex-1">
                    <div className="font-medium">{user.username}</div>
                    <div className="text-gray-500 text-xs">{user.description}</div>
                  </div>
                  <div className="text-gray-500 text-xs">{user.role}</div>
                </Button>
              )
            })}
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">🚀 Funcionalidades do Sistema</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Dashboard Interativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Gestão de Obras</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Mapa Interativo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Relatórios PDF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Controle de Usuários</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sistema de Permissões</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6 text-xs text-gray-500">
          <p>© 2024 SOMAR - Soluções em Obras e Meio Ambiente</p>
          <p>Sistema desenvolvido para a Prefeitura Municipal de Maricá - RJ</p>
        </div>
      </div>
    </div>
  )
}
