"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { HardHat, MapPin, Calendar, Users, Search, Filter, Plus, Eye, Edit, BarChart3 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

const obras = [
  {
    id: "OS-2024-001",
    titulo: "Pavimentação Rua das Flores",
    distrito: "Centro",
    endereco: "Rua das Flores, 100 - Centro, Maricá/RJ",
    status: "Em Andamento",
    progresso: 75,
    encarregado: "João Silva",
    dataInicio: "2024-01-15",
    previsaoTermino: "2024-03-20",
    orcamento: 850000,
    gastoAtual: 637500,
    prioridade: "Alta",
  },
  {
    id: "OS-2024-002",
    titulo: "Construção Praça da Juventude",
    distrito: "Inoã",
    endereco: "Av. Central, 500 - Inoã, Maricá/RJ",
    status: "Em Andamento",
    progresso: 45,
    encarregado: "Maria Santos",
    dataInicio: "2024-02-01",
    previsaoTermino: "2024-05-15",
    orcamento: 1200000,
    gastoAtual: 540000,
    prioridade: "Média",
  },
  {
    id: "OS-2024-003",
    titulo: "Reforma Escola Municipal",
    distrito: "Itaipuaçu",
    endereco: "Rua da Escola, 25 - Itaipuaçu, Maricá/RJ",
    status: "Atrasada",
    progresso: 30,
    encarregado: "Carlos Oliveira",
    dataInicio: "2024-01-10",
    previsaoTermino: "2024-02-28",
    orcamento: 650000,
    gastoAtual: 195000,
    prioridade: "Alta",
  },
  {
    id: "OS-2024-004",
    titulo: "Instalação Iluminação LED",
    distrito: "Ponta Negra",
    endereco: "Av. Beira Mar - Ponta Negra, Maricá/RJ",
    status: "Concluída",
    progresso: 100,
    encarregado: "Ana Costa",
    dataInicio: "2024-01-05",
    previsaoTermino: "2024-02-15",
    orcamento: 320000,
    gastoAtual: 315000,
    prioridade: "Baixa",
  },
  {
    id: "OS-2024-005",
    titulo: "Construção Ponte Pedonal",
    distrito: "São José do Imbassaí",
    endereco: "Estrada do Imbassaí - São José, Maricá/RJ",
    status: "Planejada",
    progresso: 0,
    encarregado: "Pedro Ferreira",
    dataInicio: "2024-03-01",
    previsaoTermino: "2024-06-30",
    orcamento: 980000,
    gastoAtual: 0,
    prioridade: "Média",
  },
]

export default function ObrasPage() {
  const [user, setUser] = useState<any>(null)
  const [filtroDistrito, setFiltroDistrito] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroPrioridade, setFiltroPrioridade] = useState("todos")
  const [busca, setBusca] = useState("")
  const [obrasFiltradas, setObrasFiltradas] = useState(obras)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    let filtered = obras

    if (busca) {
      filtered = filtered.filter(
        (obra) =>
          obra.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          obra.id.toLowerCase().includes(busca.toLowerCase()) ||
          obra.encarregado.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    if (filtroDistrito !== "todos") {
      filtered = filtered.filter((obra) => obra.distrito.toLowerCase() === filtroDistrito)
    }

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((obra) => obra.status.toLowerCase().replace(" ", "-") === filtroStatus)
    }

    if (filtroPrioridade !== "todos") {
      filtered = filtered.filter((obra) => obra.prioridade.toLowerCase() === filtroPrioridade)
    }

    setObrasFiltradas(filtered)
  }, [busca, filtroDistrito, filtroStatus, filtroPrioridade])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Concluída":
        return "bg-green-100 text-green-800 border-green-200"
      case "Atrasada":
        return "bg-red-100 text-red-800 border-red-200"
      case "Planejada":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPrioridadeColor = (prioridade: string) => {
    switch (prioridade) {
      case "Alta":
        return "bg-red-100 text-red-800"
      case "Média":
        return "bg-yellow-100 text-yellow-800"
      case "Baixa":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const estatisticas = {
    total: obras.length,
    andamento: obras.filter((o) => o.status === "Em Andamento").length,
    concluidas: obras.filter((o) => o.status === "Concluída").length,
    atrasadas: obras.filter((o) => o.status === "Atrasada").length,
    planejadas: obras.filter((o) => o.status === "Planejada").length,
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-100/50">
        <AppSidebar user={user} />
        <SidebarInset className="flex-1">
          <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-blue-100">
            <div className="flex h-16 items-center gap-4 px-6">
              <SidebarTrigger className="text-blue-600 hover:bg-blue-50" />
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <HardHat className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Gestão de Obras</h1>
                  <p className="text-sm text-gray-600">Controle e acompanhamento de todas as obras</p>
                </div>
              </div>
              <Link href="/obras/nova">
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Obra
                </Button>
              </Link>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                  <div className="text-sm opacity-90">Total</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.andamento}</div>
                  <div className="text-sm opacity-90">Em Andamento</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.concluidas}</div>
                  <div className="text-sm opacity-90">Concluídas</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.atrasadas}</div>
                  <div className="text-sm opacity-90">Atrasadas</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.planejadas}</div>
                  <div className="text-sm opacity-90">Planejadas</div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar obras..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Distritos</SelectItem>
                      <SelectItem value="centro">Centro</SelectItem>
                      <SelectItem value="inoã">Inoã</SelectItem>
                      <SelectItem value="itaipuaçu">Itaipuaçu</SelectItem>
                      <SelectItem value="ponta negra">Ponta Negra</SelectItem>
                      <SelectItem value="são josé do imbassaí">São José do Imbassaí</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="em-andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluída">Concluída</SelectItem>
                      <SelectItem value="atrasada">Atrasada</SelectItem>
                      <SelectItem value="planejada">Planejada</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroPrioridade} onValueChange={setFiltroPrioridade}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as Prioridades</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="média">Média</SelectItem>
                      <SelectItem value="baixa">Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBusca("")
                      setFiltroDistrito("todos")
                      setFiltroStatus("todos")
                      setFiltroPrioridade("todos")
                    }}
                    className="border-blue-200 text-blue-600"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Obras */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">
                  Obras ({obrasFiltradas.length} de {obras.length})
                </CardTitle>
                <CardDescription className="text-blue-600">Lista completa de todas as obras do sistema</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {obrasFiltradas.map((obra) => (
                    <Card key={obra.id} className="border-blue-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-semibold text-lg text-gray-800">{obra.titulo}</h3>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {obra.id}
                              </Badge>
                              <Badge className={getStatusColor(obra.status)}>{obra.status}</Badge>
                              <Badge className={getPrioridadeColor(obra.prioridade)}>{obra.prioridade}</Badge>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-blue-500" />
                                <span>{obra.distrito}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span>{obra.encarregado}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>{obra.dataInicio}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <BarChart3 className="w-4 h-4 text-blue-500" />
                                <span>R$ {obra.orcamento.toLocaleString()}</span>
                              </div>
                            </div>

                            <div className="mb-3">
                              <p className="text-sm text-gray-600 mb-2">{obra.endereco}</p>
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="text-gray-600">Progresso</span>
                                <span className="font-semibold text-gray-800">{obra.progresso}%</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-3">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300"
                                  style={{ width: `${obra.progresso}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-600">
                                Gasto: <span className="font-semibold">R$ {obra.gastoAtual.toLocaleString()}</span>
                              </span>
                              <span className="text-gray-600">
                                Saldo:{" "}
                                <span className="font-semibold text-green-600">
                                  R$ {(obra.orcamento - obra.gastoAtual).toLocaleString()}
                                </span>
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 lg:w-32">
                            <Link href={`/obras/${obra.id}`}>
                              <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600">
                                <Eye className="h-4 w-4 mr-2" />
                                Ver
                              </Button>
                            </Link>
                            <Link href={`/obras/${obra.id}/editar`}>
                              <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                                <Edit className="h-4 w-4 mr-2" />
                                Editar
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {obrasFiltradas.length === 0 && (
                  <div className="text-center py-12">
                    <HardHat className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma obra encontrada</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou criar uma nova obra.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
