"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Building2,
  Users,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  FileText,
  Settings,
  LogOut,
} from "lucide-react"

export default function SomarDiretas() {
  const [currentPage, setCurrentPage] = useState("login")
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (currentPage === "login") {
      router.push("/login")
    }
  }, [currentPage, router])

  // Dados mockados para demonstração
  const estatisticas = {
    totalObras: 156,
    obrasAndamento: 89,
    obrasConcluidas: 45,
    obrasAtrasadas: 22,
    funcionariosAtivos: 234,
    materialGasto: 1250000,
  }

  const obrasRecentes = [
    {
      id: "OS-2024-001",
      titulo: "Pavimentação Rua das Flores",
      distrito: "Centro",
      status: "Em Andamento",
      progresso: 75,
      encarregado: "João Silva",
      dataInicio: "2024-01-15",
      previsaoTermino: "2024-03-20",
    },
    {
      id: "OS-2024-002",
      titulo: "Construção Praça da Juventude",
      distrito: "Inoã",
      status: "Em Andamento",
      progresso: 45,
      encarregado: "Maria Santos",
      dataInicio: "2024-02-01",
      previsaoTermino: "2024-05-15",
    },
    {
      id: "OS-2024-003",
      titulo: "Reforma Escola Municipal",
      distrito: "Itaipuaçu",
      status: "Atrasada",
      progresso: 30,
      encarregado: "Carlos Oliveira",
      dataInicio: "2024-01-10",
      previsaoTermino: "2024-02-28",
    },
  ]

  const handleLogin = (username: string, password: string) => {
    if (
      (username === "admin" && password === "admin123") ||
      (username === "master" && password === "master2024") ||
      (username === "gerente01" && password === "gerente123")
    ) {
      setUser({
        username,
        cargo: username === "admin" ? "Administrador" : username === "master" ? "Master" : "Gerente",
      })
      setCurrentPage("dashboard")
    } else {
      alert("Credenciais inválidas!")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800"
      case "Concluída":
        return "bg-green-100 text-green-800"
      case "Atrasada":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return <Clock className="w-4 h-4" />
      case "Concluída":
        return <CheckCircle className="w-4 h-4" />
      case "Atrasada":
        return <AlertCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  // Página de Login
  if (currentPage === "login") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Building2 className="h-12 w-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">SOMAR +Diretas</CardTitle>
            <CardDescription>Sistema de Controle de Obras Públicas</CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target as HTMLFormElement)
                handleLogin(formData.get("username") as string, formData.get("password") as string)
              }}
              className="space-y-4"
            >
              <div>
                <Input name="username" placeholder="Usuário" required />
              </div>
              <div>
                <Input name="password" type="password" placeholder="Senha" required />
              </div>
              <Button type="submit" className="w-full">
                Entrar
              </Button>
            </form>
            <div className="mt-6 text-sm text-gray-600">
              <p className="font-semibold mb-2">Credenciais de demonstração:</p>
              <div className="space-y-1">
                <p>
                  <strong>Admin:</strong> admin / admin123
                </p>
                <p>
                  <strong>Master:</strong> master / master2024
                </p>
                <p>
                  <strong>Gerente:</strong> gerente01 / gerente123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dashboard Principal
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <h1 className="ml-3 text-2xl font-bold text-gray-900">SOMAR +Diretas</h1>
              <span className="ml-2 text-sm text-gray-500">Sistema de Controle de Obras</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Bem-vindo, {user?.cargo}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setUser(null)
                  setCurrentPage("login")
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "obras", label: "Obras", icon: Building2 },
              { id: "funcionarios", label: "Funcionários", icon: Users },
              { id: "relatorios", label: "Relatórios", icon: FileText },
              { id: "admin", label: "Administração", icon: Settings },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`flex items-center px-3 py-4 text-sm font-medium border-b-2 ${
                  currentPage === item.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <item.icon className="w-4 h-4 mr-2" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Content */}
        {currentPage === "dashboard" && (
          <div className="space-y-8">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Obras</CardTitle>
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.totalObras}</div>
                  <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.obrasAndamento}</div>
                  <p className="text-xs text-muted-foreground">57% do total de obras</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Funcionários Ativos</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{estatisticas.funcionariosAtivos}</div>
                  <p className="text-xs text-muted-foreground">Distribuídos em {estatisticas.obrasAndamento} obras</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Material Gasto</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">R$ {(estatisticas.materialGasto / 1000).toFixed(0)}k</div>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Obras */}
            <Card>
              <CardHeader>
                <CardTitle>Obras Recentes</CardTitle>
                <CardDescription>Lista das obras mais recentes do sistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {obrasRecentes.map((obra) => (
                    <div key={obra.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{obra.titulo}</h3>
                            <Badge variant="outline">{obra.id}</Badge>
                            <Badge className={getStatusColor(obra.status)}>
                              {getStatusIcon(obra.status)}
                              <span className="ml-1">{obra.status}</span>
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              {obra.distrito}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4" />
                              {obra.encarregado}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              {obra.dataInicio} - {obra.previsaoTermino}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progresso</span>
                              <span>{obra.progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all"
                                style={{ width: `${obra.progresso}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            Ver Detalhes
                          </Button>
                          <Button size="sm">Editar</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Outras páginas */}
        {currentPage !== "dashboard" && (
          <Card>
            <CardHeader>
              <CardTitle>
                {currentPage === "obras" && "Gestão de Obras"}
                {currentPage === "funcionarios" && "Gestão de Funcionários"}
                {currentPage === "relatorios" && "Relatórios e Analytics"}
                {currentPage === "admin" && "Painel Administrativo"}
              </CardTitle>
              <CardDescription>
                {currentPage === "obras" && "Controle completo de todas as obras em andamento"}
                {currentPage === "funcionarios" && "Gestão de equipes e recursos humanos"}
                {currentPage === "relatorios" && "Relatórios detalhados e métricas de performance"}
                {currentPage === "admin" && "Configurações do sistema e gestão de usuários"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🚧</div>
                <h3 className="text-lg font-semibold mb-2">Seção em Desenvolvimento</h3>
                <p className="text-gray-600">
                  Esta funcionalidade está sendo implementada e estará disponível em breve.
                </p>
                <Button className="mt-4" onClick={() => setCurrentPage("dashboard")}>
                  Voltar ao Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
