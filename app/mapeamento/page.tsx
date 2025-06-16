"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Truck, Plus, Search, Edit, Trash2, Calendar, MapPin, AlertTriangle, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const maquinario = [
  {
    id: 1,
    nome: "Escavadeira CAT 320",
    tipo: "Escavadeira",
    modelo: "320D",
    ano: 2020,
    placa: "ABC-1234",
    status: "Em Uso",
    obraAtual: "OS-2024-001",
    operador: "Carlos Silva",
    horasTrabalho: 1250,
    proximaManutencao: "2024-02-15",
    combustivel: "Diesel",
    capacidade: "20 ton",
  },
  {
    id: 2,
    nome: "Rolo Compactador Dynapac",
    tipo: "Compactador",
    modelo: "CA250D",
    ano: 2019,
    placa: "DEF-5678",
    status: "Disponível",
    obraAtual: null,
    operador: null,
    horasTrabalho: 890,
    proximaManutencao: "2024-01-30",
    combustivel: "Diesel",
    capacidade: "12 ton",
  },
  {
    id: 3,
    nome: "Caminhão Basculante Mercedes",
    tipo: "Transporte",
    modelo: "Atego 2426",
    ano: 2021,
    placa: "GHI-9012",
    status: "Em Uso",
    obraAtual: "OS-2024-002",
    operador: "João Santos",
    horasTrabalho: 2100,
    proximaManutencao: "2024-02-20",
    combustivel: "Diesel",
    capacidade: "15 m³",
  },
  {
    id: 4,
    nome: "Retroescavadeira JCB",
    tipo: "Retroescavadeira",
    modelo: "3CX",
    ano: 2018,
    placa: "JKL-3456",
    status: "Manutenção",
    obraAtual: null,
    operador: null,
    horasTrabalho: 3200,
    proximaManutencao: "2024-01-25",
    combustivel: "Diesel",
    capacidade: "8 ton",
  },
  {
    id: 5,
    nome: "Motoniveladora Volvo",
    tipo: "Motoniveladora",
    modelo: "G930C",
    ano: 2022,
    placa: "MNO-7890",
    status: "Disponível",
    obraAtual: null,
    operador: null,
    horasTrabalho: 450,
    proximaManutencao: "2024-03-10",
    combustivel: "Diesel",
    capacidade: "14 ton",
  },
]

export default function MaquinarioPage() {
  const [user, setUser] = useState<any>(null)
  const [busca, setBusca] = useState("")
  const [filtroTipo, setFiltroTipo] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [maquinarioFiltrado, setMaquinarioFiltrado] = useState(maquinario)
  const [novaMaquina, setNovaMaquina] = useState({
    nome: "",
    tipo: "",
    modelo: "",
    ano: "",
    placa: "",
    combustivel: "",
    capacidade: "",
  })
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
    let filtered = maquinario

    if (busca) {
      filtered = filtered.filter(
        (maq) =>
          maq.nome.toLowerCase().includes(busca.toLowerCase()) ||
          maq.tipo.toLowerCase().includes(busca.toLowerCase()) ||
          maq.placa.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    if (filtroTipo !== "todos") {
      filtered = filtered.filter((maq) => maq.tipo.toLowerCase() === filtroTipo)
    }

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((maq) => maq.status.toLowerCase().replace(" ", "-") === filtroStatus)
    }

    setMaquinarioFiltrado(filtered)
  }, [busca, filtroTipo, filtroStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800 border-green-200"
      case "Em Uso":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Manutenção":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inativo":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Disponível":
        return <CheckCircle className="w-4 h-4" />
      case "Em Uso":
        return <Truck className="w-4 h-4" />
      case "Manutenção":
        return <AlertTriangle className="w-4 h-4" />
      default:
        return null
    }
  }

  const adicionarMaquina = () => {
    console.log("Nova máquina:", novaMaquina)
    alert("Máquina adicionada com sucesso!")
    setNovaMaquina({
      nome: "",
      tipo: "",
      modelo: "",
      ano: "",
      placa: "",
      combustivel: "",
      capacidade: "",
    })
  }

  const estatisticas = {
    total: maquinario.length,
    disponiveis: maquinario.filter((m) => m.status === "Disponível").length,
    emUso: maquinario.filter((m) => m.status === "Em Uso").length,
    manutencao: maquinario.filter((m) => m.status === "Manutenção").length,
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
                  <Truck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Controle de Maquinário</h1>
                  <p className="text-sm text-gray-600">Gestão de equipamentos e veículos</p>
                </div>
              </div>
              {(user.cargo === "admin" || user.cargo === "gerente") && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Nova Máquina
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Adicionar Nova Máquina</DialogTitle>
                      <DialogDescription>Cadastre uma nova máquina no sistema</DialogDescription>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome/Identificação *</Label>
                        <Input
                          id="nome"
                          value={novaMaquina.nome}
                          onChange={(e) => setNovaMaquina({ ...novaMaquina, nome: e.target.value })}
                          placeholder="Ex: Escavadeira CAT 320"
                          className="border-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tipo">Tipo *</Label>
                        <Select
                          value={novaMaquina.tipo}
                          onValueChange={(value) => setNovaMaquina({ ...novaMaquina, tipo: value })}
                        >
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Tipo de máquina" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="escavadeira">Escavadeira</SelectItem>
                            <SelectItem value="retroescavadeira">Retroescavadeira</SelectItem>
                            <SelectItem value="compactador">Compactador</SelectItem>
                            <SelectItem value="motoniveladora">Motoniveladora</SelectItem>
                            <SelectItem value="transporte">Transporte</SelectItem>
                            <SelectItem value="betoneira">Betoneira</SelectItem>
                            <SelectItem value="guindaste">Guindaste</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="modelo">Modelo</Label>
                        <Input
                          id="modelo"
                          value={novaMaquina.modelo}
                          onChange={(e) => setNovaMaquina({ ...novaMaquina, modelo: e.target.value })}
                          placeholder="Modelo da máquina"
                          className="border-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="ano">Ano</Label>
                        <Input
                          id="ano"
                          type="number"
                          value={novaMaquina.ano}
                          onChange={(e) => setNovaMaquina({ ...novaMaquina, ano: e.target.value })}
                          placeholder="2024"
                          className="border-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="placa">Placa</Label>
                        <Input
                          id="placa"
                          value={novaMaquina.placa}
                          onChange={(e) => setNovaMaquina({ ...novaMaquina, placa: e.target.value })}
                          placeholder="ABC-1234"
                          className="border-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="combustivel">Combustível</Label>
                        <Select
                          value={novaMaquina.combustivel}
                          onValueChange={(value) => setNovaMaquina({ ...novaMaquina, combustivel: value })}
                        >
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Tipo de combustível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diesel">Diesel</SelectItem>
                            <SelectItem value="gasolina">Gasolina</SelectItem>
                            <SelectItem value="eletrico">Elétrico</SelectItem>
                            <SelectItem value="hibrido">Híbrido</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="capacidade">Capacidade</Label>
                        <Input
                          id="capacidade"
                          value={novaMaquina.capacidade}
                          onChange={(e) => setNovaMaquina({ ...novaMaquina, capacidade: e.target.value })}
                          placeholder="Ex: 20 ton, 15 m³"
                          className="border-blue-200"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <Button variant="outline" className="border-blue-200">
                        Cancelar
                      </Button>
                      <Button onClick={adicionarMaquina} className="bg-blue-600 hover:bg-blue-700">
                        Adicionar Máquina
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.total}</div>
                  <div className="text-sm opacity-90">Total</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.disponiveis}</div>
                  <div className="text-sm opacity-90">Disponíveis</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.emUso}</div>
                  <div className="text-sm opacity-90">Em Uso</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.manutencao}</div>
                  <div className="text-sm opacity-90">Manutenção</div>
                </CardContent>
              </Card>
            </div>

            {/* Filtros */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">Filtros</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar máquinas..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Tipos</SelectItem>
                      <SelectItem value="escavadeira">Escavadeira</SelectItem>
                      <SelectItem value="retroescavadeira">Retroescavadeira</SelectItem>
                      <SelectItem value="compactador">Compactador</SelectItem>
                      <SelectItem value="motoniveladora">Motoniveladora</SelectItem>
                      <SelectItem value="transporte">Transporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="disponível">Disponível</SelectItem>
                      <SelectItem value="em-uso">Em Uso</SelectItem>
                      <SelectItem value="manutenção">Manutenção</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBusca("")
                      setFiltroTipo("todos")
                      setFiltroStatus("todos")
                    }}
                    className="border-blue-200 text-blue-600"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Maquinário */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">
                  Maquinário ({maquinarioFiltrado.length} de {maquinario.length})
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Controle completo de equipamentos e veículos
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {maquinarioFiltrado.map((maquina) => (
                    <Card key={maquina.id} className="border-blue-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-semibold text-lg text-gray-800">{maquina.nome}</h3>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {maquina.tipo}
                              </Badge>
                              <Badge className={getStatusColor(maquina.status)}>
                                {getStatusIcon(maquina.status)}
                                <span className="ml-1">{maquina.status}</span>
                              </Badge>
                              {maquina.obraAtual && (
                                <Badge className="bg-green-100 text-green-800">{maquina.obraAtual}</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                              <div>
                                <span className="text-gray-500">Modelo:</span>
                                <span className="font-semibold text-gray-800 ml-1">{maquina.modelo}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Ano:</span>
                                <span className="font-semibold text-gray-800 ml-1">{maquina.ano}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Placa:</span>
                                <span className="font-semibold text-gray-800 ml-1">{maquina.placa}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Capacidade:</span>
                                <span className="font-semibold text-gray-800 ml-1">{maquina.capacidade}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-600">
                                  Próxima manutenção: <span className="font-semibold">{maquina.proximaManutencao}</span>
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Horas trabalhadas: <span className="font-semibold">{maquina.horasTrabalho}h</span>
                                </span>
                              </div>
                              <div>
                                <span className="text-gray-600">
                                  Combustível: <span className="font-semibold">{maquina.combustivel}</span>
                                </span>
                              </div>
                            </div>

                            {maquina.operador && (
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-green-500" />
                                <span className="text-gray-600">
                                  Operador atual:{" "}
                                  <span className="font-semibold text-green-600">{maquina.operador}</span>
                                </span>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 lg:w-32">
                            <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600">
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            {(user.cargo === "admin" || user.cargo === "gerente") && (
                              <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remover
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {maquinarioFiltrado.length === 0 && (
                  <div className="text-center py-12">
                    <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhuma máquina encontrada</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou adicionar uma nova máquina.</p>
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
