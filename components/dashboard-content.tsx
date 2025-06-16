"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import {
  HardHat,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Search,
  TrendingUp,
  Activity,
  DollarSign,
  TestTube,
} from "lucide-react"
import Link from "next/link"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

interface DashboardContentProps {
  user: {
    name: string
    email: string
    cargo: string
    avatar: string
    isTestMode?: boolean
  }
}

export function DashboardContent({ user }: DashboardContentProps) {
  const [filtroDistrito, setFiltroDistrito] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")

  // Dados mockados
  const estatisticas = {
    totalObras: 156,
    obrasAndamento: 89,
    obrasConcluidas: 45,
    obrasAtrasadas: 22,
    funcionariosAtivos: 234,
    materialGasto: 1250000,
    orcamentoTotal: 15000000,
    eficiencia: 87,
  }

  const distritos = [
    { nome: "Centro", obras: 23, andamento: 15, concluidas: 8, latitude: -22.9068, longitude: -43.1729 },
    { nome: "Inoã", obras: 18, andamento: 12, concluidas: 6, latitude: -22.9408, longitude: -42.9306 },
    { nome: "Itaipuaçu", obras: 31, andamento: 19, concluidas: 12, latitude: -22.9403, longitude: -42.8444 },
    { nome: "Ponta Negra", obras: 15, andamento: 9, concluidas: 6, latitude: -22.9778, longitude: -42.7447 },
    { nome: "São José do Imbassaí", obras: 22, andamento: 14, concluidas: 8, latitude: -22.8667, longitude: -42.8333 },
    { nome: "Guaratiba", obras: 19, andamento: 11, concluidas: 8, latitude: -22.9458, longitude: -42.7942 },
    { nome: "Cordeirinho", obras: 28, andamento: 9, concluidas: 5, latitude: -22.9575, longitude: -42.7619 },
  ]

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
      prioridade: "Alta",
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
      prioridade: "Média",
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
      prioridade: "Alta",
    },
    {
      id: "OS-2024-004",
      titulo: "Instalação Iluminação LED",
      distrito: "Ponta Negra",
      status: "Concluída",
      progresso: 100,
      encarregado: "Ana Costa",
      dataInicio: "2024-01-05",
      previsaoTermino: "2024-02-15",
      prioridade: "Baixa",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Concluída":
        return "bg-green-100 text-green-800 border-green-200"
      case "Atrasada":
        return "bg-red-100 text-red-800 border-red-200"
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  return (
    <SidebarInset className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-blue-100/50">
        <div className="flex h-16 items-center gap-4 px-6">
          <SidebarTrigger className="text-blue-600 hover:bg-blue-50" />
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-semibold text-gray-800">
                {getGreeting()}, {user.name.split(" ")[0]}!
              </h1>
              {user.isTestMode && (
                <Badge variant="outline" className="border-red-300 text-red-600">
                  <TestTube className="h-3 w-3 mr-1" />
                  Modo Teste
                </Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">Bem-vindo ao sistema +Diretas da SOMAR</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800 capitalize">{user.cargo}</p>
              <p className="text-xs text-gray-500">Maricá - RJ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-6">
        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Total de Obras</CardTitle>
              <HardHat className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.totalObras}</div>
              <p className="text-xs opacity-80 flex items-center gap-1 mt-1">
                <TrendingUp className="h-3 w-3" />
                +12% este mês
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Em Andamento</CardTitle>
              <Activity className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.obrasAndamento}</div>
              <p className="text-xs opacity-80">
                {Math.round((estatisticas.obrasAndamento / estatisticas.totalObras) * 100)}% do total
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-700 to-blue-800 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Funcionários</CardTitle>
              <Users className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{estatisticas.funcionariosAtivos}</div>
              <p className="text-xs opacity-80">Ativos no sistema</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-800 to-blue-900 text-white border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium opacity-90">Orçamento</CardTitle>
              <DollarSign className="h-5 w-5 opacity-80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">R$ {(estatisticas.orcamentoTotal / 1000000).toFixed(1)}M</div>
              <p className="text-xs opacity-80">
                {Math.round((estatisticas.materialGasto / estatisticas.orcamentoTotal) * 100)}% utilizado
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="obras" className="space-y-6">
          <TabsList className="bg-white border border-blue-100">
            <TabsTrigger value="obras" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Obras por Distrito
            </TabsTrigger>
            <TabsTrigger value="lista" className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700">
              Lista de Obras
            </TabsTrigger>
            <TabsTrigger
              value="relatorios"
              className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              Relatórios
            </TabsTrigger>
          </TabsList>

          <TabsContent value="obras" className="space-y-6">
            {/* Obras por Distrito */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Obras por Distrito</CardTitle>
                <CardDescription className="text-blue-600">
                  Distribuição das obras pelos distritos de Maricá
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {distritos.map((distrito) => (
                    <Card
                      key={distrito.nome}
                      className="hover:shadow-lg transition-all duration-200 border-blue-100 hover:border-blue-200"
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg text-blue-800">{distrito.nome}</CardTitle>
                          <MapPin className="h-5 w-5 text-red-500" />
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Total de obras:</span>
                          <span className="font-semibold text-gray-800">{distrito.obras}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Em andamento:</span>
                          <span className="text-blue-600 font-semibold">{distrito.andamento}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Concluídas:</span>
                          <span className="text-green-600 font-semibold">{distrito.concluidas}</span>
                        </div>
                        <Link href={`/obras?distrito=${distrito.nome.toLowerCase()}`}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full mt-3 border-blue-200 text-blue-700 hover:bg-blue-50"
                          >
                            Ver Obras
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Mapa */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Localização das Obras</CardTitle>
                <CardDescription className="text-blue-600">
                  Mapa interativo com a localização de cada obra
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="h-[500px] w-full rounded-lg overflow-hidden border border-blue-100">
                  <Map markers={distritos} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lista" className="space-y-6">
            {/* Filtros */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por OS, título ou encarregado..."
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                        className="pl-10 border-blue-200 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
                    <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Distritos</SelectItem>
                      {distritos.map((distrito) => (
                        <SelectItem key={distrito.nome} value={distrito.nome.toLowerCase()}>
                          {distrito.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-full md:w-48 border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="andamento">Em Andamento</SelectItem>
                      <SelectItem value="concluida">Concluída</SelectItem>
                      <SelectItem value="atrasada">Atrasada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Obras */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Obras Recentes</CardTitle>
                <CardDescription className="text-blue-600">Lista das obras mais recentes do sistema</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {obrasRecentes.map((obra) => (
                    <div
                      key={obra.id}
                      className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50/50 transition-colors"
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg text-gray-800">{obra.titulo}</h3>
                            <Badge variant="outline" className="border-blue-200 text-blue-700">
                              {obra.id}
                            </Badge>
                            <Badge className={getStatusColor(obra.status)}>
                              {getStatusIcon(obra.status)}
                              <span className="ml-1">{obra.status}</span>
                            </Badge>
                            <Badge className={getPrioridadeColor(obra.prioridade)}>{obra.prioridade}</Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-red-500" />
                              {obra.distrito}
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-blue-500" />
                              {obra.encarregado}
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-green-500" />
                              {obra.dataInicio} - {obra.previsaoTermino}
                            </div>
                          </div>
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-sm mb-2">
                              <span className="text-gray-600">Progresso</span>
                              <span className="font-semibold text-gray-800">{obra.progresso}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-gradient-to-r from-blue-500 to-red-500 h-3 rounded-full transition-all duration-300"
                                style={{ width: `${obra.progresso}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/obras/${obra.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-blue-200 text-blue-700 hover:bg-blue-50"
                            >
                              Ver Detalhes
                            </Button>
                          </Link>
                          <Link href={`/obras/${obra.id}/editar`}>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-blue-600 to-red-600 hover:from-blue-700 hover:to-red-700"
                            >
                              Editar
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="relatorios" className="space-y-6">
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-red-50 border-b border-blue-100">
                <CardTitle className="text-blue-800">Relatórios e Análises</CardTitle>
                <CardDescription className="text-blue-600">Visualize dados e métricas das obras</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Obras por Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Em Andamento</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-3">
                              <div className="bg-blue-500 h-3 rounded-full" style={{ width: "57%" }} />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-8">89</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Concluídas</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-3">
                              <div className="bg-green-500 h-3 rounded-full" style={{ width: "29%" }} />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-8">45</span>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Atrasadas</span>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-3">
                              <div className="bg-red-500 h-3 rounded-full" style={{ width: "14%" }} />
                            </div>
                            <span className="text-sm font-semibold text-gray-800 w-8">22</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border-blue-100">
                    <CardHeader>
                      <CardTitle className="text-lg text-blue-800">Gastos por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Material de Construção</span>
                          <span className="text-sm font-semibold text-gray-800">R$ 750k</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Mão de Obra</span>
                          <span className="text-sm font-semibold text-gray-800">R$ 320k</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">Equipamentos</span>
                          <span className="text-sm font-semibold text-gray-800">R$ 180k</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </SidebarInset>
  )
}
