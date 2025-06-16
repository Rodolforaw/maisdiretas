"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCheck, Clock, Calendar, MapPin, CheckCircle, XCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const registrosPonto = [
  {
    id: 1,
    funcionario: "João Silva",
    obra: "OS-2024-001",
    data: "2024-01-20",
    entrada: "07:00",
    saidaAlmoco: "12:00",
    voltaAlmoco: "13:00",
    saida: "17:00",
    horasTrabalhadas: 8,
    localizacao: "Rua das Flores, Centro",
    status: "Completo",
    observacoes: "",
  },
  {
    id: 2,
    funcionario: "Maria Santos",
    obra: "OS-2024-002",
    data: "2024-01-20",
    entrada: "07:30",
    saidaAlmoco: "12:30",
    voltaAlmoco: "13:30",
    saida: null,
    horasTrabalhadas: 0,
    localizacao: "Av. Central, Inoã",
    status: "Em Andamento",
    observacoes: "",
  },
  {
    id: 3,
    funcionario: "Carlos Oliveira",
    obra: "OS-2024-003",
    data: "2024-01-20",
    entrada: "06:45",
    saidaAlmoco: "11:45",
    voltaAlmoco: "12:45",
    saida: "16:45",
    horasTrabalhadas: 8,
    localizacao: "Rua da Escola, Itaipuaçu",
    status: "Completo",
    observacoes: "Hora extra autorizada",
  },
  {
    id: 4,
    funcionario: "Ana Costa",
    obra: "OS-2024-004",
    data: "2024-01-19",
    entrada: "08:00",
    saidaAlmoco: null,
    voltaAlmoco: null,
    saida: "14:00",
    horasTrabalhadas: 6,
    localizacao: "Av. Beira Mar, Ponta Negra",
    status: "Incompleto",
    observacoes: "Saída antecipada por motivo médico",
  },
]

export default function PontoPage() {
  const [user, setUser] = useState<any>(null)
  const [dataFiltro, setDataFiltro] = useState(new Date().toISOString().split("T")[0])
  const [obraFiltro, setObraFiltro] = useState("todas")
  const [statusFiltro, setStatusFiltro] = useState("todos")
  const [novoRegistro, setNovoRegistro] = useState({
    funcionario: "",
    obra: "",
    tipo: "entrada",
    observacoes: "",
  })
  const [localizacaoAtual, setLocalizacaoAtual] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))

    // Obter localização atual
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocalizacaoAtual({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Erro ao obter localização:", error)
        },
      )
    }
  }, [router])

  const registrarPonto = () => {
    const agora = new Date()
    const hora = agora.toTimeString().slice(0, 5)

    console.log("Registrando ponto:", {
      ...novoRegistro,
      hora,
      localizacao: localizacaoAtual,
      timestamp: agora.toISOString(),
    })

    alert(`Ponto registrado com sucesso! ${novoRegistro.tipo} às ${hora}`)
    setNovoRegistro({
      funcionario: "",
      obra: "",
      tipo: "entrada",
      observacoes: "",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Incompleto":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completo":
        return <CheckCircle className="w-4 h-4" />
      case "Em Andamento":
        return <Clock className="w-4 h-4" />
      case "Incompleto":
        return <XCircle className="w-4 h-4" />
      default:
        return <AlertTriangle className="w-4 h-4" />
    }
  }

  const calcularHorasExtras = (horasTrabalhadas: number) => {
    return horasTrabalhadas > 8 ? horasTrabalhadas - 8 : 0
  }

  const estatisticas = {
    totalRegistros: registrosPonto.length,
    completos: registrosPonto.filter((r) => r.status === "Completo").length,
    emAndamento: registrosPonto.filter((r) => r.status === "Em Andamento").length,
    incompletos: registrosPonto.filter((r) => r.status === "Incompleto").length,
    horasExtras: registrosPonto.reduce((acc, r) => acc + calcularHorasExtras(r.horasTrabalhadas), 0),
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
                  <UserCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Controle de Ponto</h1>
                  <p className="text-sm text-gray-600">Registro de entrada e saída dos funcionários</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.totalRegistros}</div>
                  <div className="text-sm opacity-90">Total Hoje</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.completos}</div>
                  <div className="text-sm opacity-90">Completos</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.emAndamento}</div>
                  <div className="text-sm opacity-90">Em Andamento</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.incompletos}</div>
                  <div className="text-sm opacity-90">Incompletos</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.horasExtras}</div>
                  <div className="text-sm opacity-90">Horas Extras</div>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue={user.cargo === "encarregado" ? "registrar" : "consultar"} className="space-y-6">
              <TabsList className="bg-white border border-blue-100">
                {user.cargo === "encarregado" && (
                  <TabsTrigger
                    value="registrar"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    Registrar Ponto
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="consultar"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Consultar Registros
                </TabsTrigger>
                <TabsTrigger
                  value="relatorio"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Relatório de Horas
                </TabsTrigger>
              </TabsList>

              {/* Registrar Ponto - Apenas Encarregado */}
              {user.cargo === "encarregado" && (
                <TabsContent value="registrar" className="space-y-6">
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800 flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Registrar Ponto Eletrônico
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Registre entrada, saída para almoço e saída final
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      {/* Hora Atual */}
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-blue-800 mb-2">
                            {new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                          </div>
                          <div className="text-blue-600">
                            {new Date().toLocaleDateString("pt-BR", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          {localizacaoAtual && (
                            <div className="flex items-center justify-center gap-2 mt-3 text-sm text-blue-600">
                              <MapPin className="w-4 h-4" />
                              <span>Localização confirmada</span>
                            </div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="funcionario">Funcionário *</Label>
                          <Select
                            value={novoRegistro.funcionario}
                            onValueChange={(value) => setNovoRegistro({ ...novoRegistro, funcionario: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione o funcionário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="joao-silva">João Silva</SelectItem>
                              <SelectItem value="maria-santos">Maria Santos</SelectItem>
                              <SelectItem value="carlos-oliveira">Carlos Oliveira</SelectItem>
                              <SelectItem value="ana-costa">Ana Costa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="obra">Obra *</Label>
                          <Select
                            value={novoRegistro.obra}
                            onValueChange={(value) => setNovoRegistro({ ...novoRegistro, obra: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione a obra" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OS-2024-001">OS-2024-001 - Pavimentação Rua das Flores</SelectItem>
                              <SelectItem value="OS-2024-002">OS-2024-002 - Construção Praça da Juventude</SelectItem>
                              <SelectItem value="OS-2024-003">OS-2024-003 - Reforma Escola Municipal</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="tipo">Tipo de Registro *</Label>
                        <Select
                          value={novoRegistro.tipo}
                          onValueChange={(value) => setNovoRegistro({ ...novoRegistro, tipo: value })}
                        >
                          <SelectTrigger className="border-blue-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="entrada">🟢 Entrada</SelectItem>
                            <SelectItem value="saida-almoco">🟡 Saída para Almoço</SelectItem>
                            <SelectItem value="volta-almoco">🟡 Volta do Almoço</SelectItem>
                            <SelectItem value="saida">🔴 Saída Final</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Input
                          id="observacoes"
                          value={novoRegistro.observacoes}
                          onChange={(e) => setNovoRegistro({ ...novoRegistro, observacoes: e.target.value })}
                          placeholder="Observações sobre o registro (opcional)"
                          className="border-blue-200"
                        />
                      </div>

                      <div className="flex justify-center">
                        <Button
                          onClick={registrarPonto}
                          disabled={!novoRegistro.funcionario || !novoRegistro.obra}
                          className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                        >
                          <UserCheck className="h-5 w-5 mr-2" />
                          Registrar Ponto
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Consultar Registros */}
              <TabsContent value="consultar" className="space-y-6">
                {/* Filtros */}
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Filtros</CardTitle>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="data">Data</Label>
                        <Input
                          id="data"
                          type="date"
                          value={dataFiltro}
                          onChange={(e) => setDataFiltro(e.target.value)}
                          className="border-blue-200"
                        />
                      </div>
                      <div>
                        <Label htmlFor="obra-filtro">Obra</Label>
                        <Select value={obraFiltro} onValueChange={setObraFiltro}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Todas as obras" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas as Obras</SelectItem>
                            <SelectItem value="OS-2024-001">OS-2024-001</SelectItem>
                            <SelectItem value="OS-2024-002">OS-2024-002</SelectItem>
                            <SelectItem value="OS-2024-003">OS-2024-003</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status-filtro">Status</Label>
                        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Todos os status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="completo">Completo</SelectItem>
                            <SelectItem value="em-andamento">Em Andamento</SelectItem>
                            <SelectItem value="incompleto">Incompleto</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Lista de Registros */}
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Registros de Ponto</CardTitle>
                    <CardDescription className="text-blue-600">
                      Histórico de registros de entrada e saída
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {registrosPonto.map((registro) => (
                        <Card key={registro.id} className="border-blue-100 hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3 flex-wrap">
                                  <h3 className="font-semibold text-lg text-gray-800">{registro.funcionario}</h3>
                                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                                    {registro.obra}
                                  </Badge>
                                  <Badge className={getStatusColor(registro.status)}>
                                    {getStatusIcon(registro.status)}
                                    <span className="ml-1">{registro.status}</span>
                                  </Badge>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                                  <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-blue-500" />
                                    <span>{registro.data}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-green-500" />
                                    <span>Entrada: {registro.entrada}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-orange-500" />
                                    <span>
                                      Almoço: {registro.saidaAlmoco || "--"} / {registro.voltaAlmoco || "--"}
                                    </span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-red-500" />
                                    <span>Saída: {registro.saida || "Em andamento"}</span>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                  <div className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-blue-500" />
                                    <span className="text-gray-600">{registro.localizacao}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">
                                      Horas trabalhadas:
                                      <span className="font-semibold text-gray-800 ml-1">
                                        {registro.horasTrabalhadas}h
                                      </span>
                                      {calcularHorasExtras(registro.horasTrabalhadas) > 0 && (
                                        <span className="text-orange-600 ml-2">
                                          (+{calcularHorasExtras(registro.horasTrabalhadas)}h extras)
                                        </span>
                                      )}
                                    </span>
                                  </div>
                                </div>

                                {registro.observacoes && (
                                  <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                                    <span className="text-sm text-yellow-800">
                                      <strong>Observação:</strong> {registro.observacoes}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Relatório de Horas */}
              <TabsContent value="relatorio" className="space-y-6">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Relatório de Horas Trabalhadas</CardTitle>
                    <CardDescription className="text-blue-600">Resumo mensal de horas por funcionário</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">João Silva</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Horas Normais:</span>
                              <span className="font-semibold">160h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horas Extras:</span>
                              <span className="font-semibold text-orange-600">12h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Faltas:</span>
                              <span className="font-semibold text-red-600">0h</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total:</span>
                              <span>172h</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">Maria Santos</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Horas Normais:</span>
                              <span className="font-semibold">152h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horas Extras:</span>
                              <span className="font-semibold text-orange-600">8h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Faltas:</span>
                              <span className="font-semibold text-red-600">8h</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total:</span>
                              <span>160h</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardContent className="p-6">
                          <h3 className="font-semibold text-gray-800 mb-4">Carlos Oliveira</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Horas Normais:</span>
                              <span className="font-semibold">168h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Horas Extras:</span>
                              <span className="font-semibold text-orange-600">16h</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Faltas:</span>
                              <span className="font-semibold text-red-600">0h</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between font-bold">
                              <span>Total:</span>
                              <span>184h</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Calendar className="h-4 w-4 mr-2" />
                        Exportar Relatório Mensal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
