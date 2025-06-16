"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, HardHat, Eye, Navigation } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"
import Link from "next/link"

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

const obras = [
  {
    id: "OS-2024-001",
    titulo: "Pavimentação Rua das Flores",
    distrito: "Centro",
    status: "Em Andamento",
    progresso: 75,
    latitude: -22.9068,
    longitude: -43.1729,
    encarregado: "João Silva",
  },
  {
    id: "OS-2024-002",
    titulo: "Construção Praça da Juventude",
    distrito: "Inoã",
    status: "Em Andamento",
    progresso: 45,
    latitude: -22.9408,
    longitude: -42.9306,
    encarregado: "Maria Santos",
  },
  {
    id: "OS-2024-003",
    titulo: "Reforma Escola Municipal",
    distrito: "Itaipuaçu",
    status: "Atrasada",
    progresso: 30,
    latitude: -22.9403,
    longitude: -42.8444,
    encarregado: "Carlos Oliveira",
  },
  {
    id: "OS-2024-004",
    titulo: "Instalação Iluminação LED",
    distrito: "Ponta Negra",
    status: "Concluída",
    progresso: 100,
    latitude: -22.9778,
    longitude: -42.7447,
    encarregado: "Ana Costa",
  },
  {
    id: "OS-2024-005",
    titulo: "Construção Ponte Pedonal",
    distrito: "São José do Imbassaí",
    status: "Planejada",
    progresso: 0,
    latitude: -22.8667,
    longitude: -42.8333,
    encarregado: "Pedro Ferreira",
  },
]

export default function MapaPage() {
  const [user, setUser] = useState<any>(null)
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [filtroDistrito, setFiltroDistrito] = useState("todos")
  const [obrasFiltradas, setObrasFiltradas] = useState(obras)
  const [obraSelecionada, setObraSelecionada] = useState<any>(null)
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

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((obra) => obra.status.toLowerCase().replace(" ", "-") === filtroStatus)
    }

    if (filtroDistrito !== "todos") {
      filtered = filtered.filter((obra) => obra.distrito.toLowerCase() === filtroDistrito)
    }

    setObrasFiltradas(filtered)
  }, [filtroStatus, filtroDistrito])

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

  const estatisticas = {
    total: obrasFiltradas.length,
    andamento: obrasFiltradas.filter((o) => o.status === "Em Andamento").length,
    concluidas: obrasFiltradas.filter((o) => o.status === "Concluída").length,
    atrasadas: obrasFiltradas.filter((o) => o.status === "Atrasada").length,
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
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Mapa de Obras</h1>
                  <p className="text-sm text-gray-600">Visualização geográfica de todas as obras</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                  <div className="text-sm opacity-90">Total no Mapa</div>
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
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Mapa */}
              <div className="lg:col-span-2">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Navigation className="h-5 w-5" />
                          Mapa Interativo
                        </CardTitle>
                        <CardDescription className="text-blue-600">
                          Clique nos marcadores para ver detalhes das obras
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                          <SelectTrigger className="w-40 border-blue-200">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="em-andamento">Em Andamento</SelectItem>
                            <SelectItem value="concluída">Concluída</SelectItem>
                            <SelectItem value="atrasada">Atrasada</SelectItem>
                            <SelectItem value="planejada">Planejada</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
                          <SelectTrigger className="w-40 border-blue-200">
                            <SelectValue placeholder="Distrito" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="centro">Centro</SelectItem>
                            <SelectItem value="inoã">Inoã</SelectItem>
                            <SelectItem value="itaipuaçu">Itaipuaçu</SelectItem>
                            <SelectItem value="ponta negra">Ponta Negra</SelectItem>
                            <SelectItem value="são josé do imbassaí">São José do Imbassaí</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="h-[600px] w-full">
                      <Map
                        markers={obrasFiltradas.map((obra) => ({
                          nome: `${obra.titulo} - ${obra.distrito}`,
                          latitude: obra.latitude,
                          longitude: obra.longitude,
                          status: obra.status,
                        }))}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lista de Obras */}
              <div>
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <HardHat className="h-5 w-5" />
                      Obras no Mapa
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      {obrasFiltradas.length} obras encontradas
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 max-h-[600px] overflow-y-auto">
                    <div className="space-y-3">
                      {obrasFiltradas.map((obra) => (
                        <Card
                          key={obra.id}
                          className={`border-blue-100 hover:shadow-md transition-all cursor-pointer ${
                            obraSelecionada?.id === obra.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
                          }`}
                          onClick={() => setObraSelecionada(obra)}
                        >
                          <CardContent className="p-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                                  {obra.id}
                                </Badge>
                                <Badge className={`text-xs ${getStatusColor(obra.status)}`}>{obra.status}</Badge>
                              </div>
                              <h4 className="font-semibold text-sm text-gray-800 line-clamp-2">{obra.titulo}</h4>
                              <div className="text-xs text-gray-600 space-y-1">
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  {obra.distrito}
                                </div>
                                <div>Encarregado: {obra.encarregado}</div>
                                <div>Progresso: {obra.progresso}%</div>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full"
                                  style={{ width: `${obra.progresso}%` }}
                                />
                              </div>
                              <Link href={`/obras/${obra.id}`}>
                                <Button size="sm" variant="outline" className="w-full text-xs border-blue-200">
                                  <Eye className="w-3 h-3 mr-1" />
                                  Ver Detalhes
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {obrasFiltradas.length === 0 && (
                      <div className="text-center py-8">
                        <MapPin className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">Nenhuma obra encontrada com os filtros aplicados</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Legenda */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">Legenda</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"
                        fill="#3b82f6"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="text-sm">Em Andamento</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"
                        fill="#22c55e"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="text-sm">Concluída</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"
                        fill="#ef4444"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="text-sm">Atrasada</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <svg width="24" height="24" viewBox="0 0 24 24">
                      <path
                        d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"
                        fill="#eab308"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"
                        fill="#eab308"
                        stroke="white"
                        strokeWidth="1"
                      />
                      <path
                        d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"
                        fill="#eab308"
                        stroke="white"
                        strokeWidth="1"
                      />
                    </svg>
                    <span className="text-sm">Planejada</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
