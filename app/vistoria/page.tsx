"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapIcon, Camera, FileText, Calendar, MapPin, Ruler, Calculator, Save, Eye, Plus, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

const obras = [
  {
    id: "OS-2024-001",
    titulo: "Pavimentação Rua das Flores",
    distrito: "Centro",
    latitude: -22.9068,
    longitude: -43.1729,
  },
  {
    id: "OS-2024-002",
    titulo: "Construção Praça da Juventude",
    distrito: "Inoã",
    latitude: -22.9408,
    longitude: -42.9306,
  },
  {
    id: "OS-2024-003",
    titulo: "Reforma Escola Municipal",
    distrito: "Itaipuaçu",
    latitude: -22.9403,
    longitude: -42.8444,
  },
]

const vistorias = [
  {
    id: 1,
    obra: "OS-2024-001",
    data: "2024-01-15",
    equipe: "Equipe Alpha",
    status: "Concluída",
    progresso: 75,
    area: "1.200 m²",
    producao: "Pavimentação asfáltica de 800m² concluída. Sinalização 60% concluída.",
    observacoes: "Qualidade do serviço excelente. Cronograma dentro do prazo.",
  },
  {
    id: 2,
    obra: "OS-2024-002",
    data: "2024-01-14",
    equipe: "Equipe Beta",
    status: "Em Andamento",
    progresso: 45,
    area: "2.500 m²",
    producao: "Fundação 100% concluída. Estrutura 45% concluída.",
    observacoes: "Pequeno atraso devido às chuvas da semana passada.",
  },
]

export default function VistoriaPage() {
  const [user, setUser] = useState<any>(null)
  const [novaVistoria, setNovaVistoria] = useState({
    obra: "",
    data: new Date().toISOString().split("T")[0],
    equipe: "",
    progresso: "",
    area: "",
    producao: "",
    observacoes: "",
    coordenadas: { lat: "", lng: "" },
    fotos: [] as any[],
    medicoes: [] as any[],
  })
  const [selectedObra, setSelectedObra] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const salvarVistoria = () => {
    console.log("Vistoria salva:", novaVistoria)
    alert("Vistoria salva com sucesso!")
    setNovaVistoria({
      obra: "",
      data: new Date().toISOString().split("T")[0],
      equipe: "",
      progresso: "",
      area: "",
      producao: "",
      observacoes: "",
      coordenadas: { lat: "", lng: "" },
      fotos: [],
      medicoes: [],
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Concluída":
        return "bg-green-100 text-green-800 border-green-200"
      case "Em Andamento":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
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
                  <MapIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Vistoria e Produção</h1>
                  <p className="text-sm text-gray-600">Área de mapeamento e controle de produção das obras</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            <Tabs defaultValue="nova" className="space-y-6">
              <TabsList className="bg-blue-50 border border-blue-200">
                <TabsTrigger value="nova" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Nova Vistoria
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                >
                  Histórico
                </TabsTrigger>
                <TabsTrigger value="mapa" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Mapa de Produção
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nova">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <MapIcon className="h-5 w-5" />
                      Nova Vistoria de Produção
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Registre o progresso e produção das obras com precisão
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="obra">Obra *</Label>
                        <Select
                          value={novaVistoria.obra}
                          onValueChange={(value) => {
                            const obra = obras.find((o) => o.id === value)
                            setSelectedObra(obra)
                            setNovaVistoria({ ...novaVistoria, obra: value })
                          }}
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-500">
                            <SelectValue placeholder="Selecione a obra" />
                          </SelectTrigger>
                          <SelectContent>
                            {obras.map((obra) => (
                              <SelectItem key={obra.id} value={obra.id}>
                                {obra.titulo} - {obra.distrito}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="data">Data da Vistoria *</Label>
                        <Input
                          id="data"
                          type="date"
                          value={novaVistoria.data}
                          onChange={(e) => setNovaVistoria({ ...novaVistoria, data: e.target.value })}
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="equipe">Equipe de Vistoria *</Label>
                        <Select
                          value={novaVistoria.equipe}
                          onValueChange={(value) => setNovaVistoria({ ...novaVistoria, equipe: value })}
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-500">
                            <SelectValue placeholder="Selecione a equipe" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="alpha">Equipe Alpha</SelectItem>
                            <SelectItem value="beta">Equipe Beta</SelectItem>
                            <SelectItem value="gamma">Equipe Gamma</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="progresso">Progresso Atual (%)</Label>
                        <Input
                          id="progresso"
                          type="number"
                          min="0"
                          max="100"
                          value={novaVistoria.progresso}
                          onChange={(e) => setNovaVistoria({ ...novaVistoria, progresso: e.target.value })}
                          placeholder="Ex: 75"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <Label htmlFor="area">Área Vistoriada</Label>
                        <Input
                          id="area"
                          value={novaVistoria.area}
                          onChange={(e) => setNovaVistoria({ ...novaVistoria, area: e.target.value })}
                          placeholder="Ex: 1.200 m²"
                          className="border-blue-200 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="producao">Produção Realizada *</Label>
                      <Textarea
                        id="producao"
                        value={novaVistoria.producao}
                        onChange={(e) => setNovaVistoria({ ...novaVistoria, producao: e.target.value })}
                        placeholder="Descreva detalhadamente a produção realizada até a data da vistoria..."
                        rows={4}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    {selectedObra && (
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                            <MapPin className="h-5 w-5" />
                            Localização da Obra
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <Label htmlFor="latitude">Latitude</Label>
                              <Input
                                id="latitude"
                                value={novaVistoria.coordenadas.lat || selectedObra.latitude}
                                onChange={(e) =>
                                  setNovaVistoria({
                                    ...novaVistoria,
                                    coordenadas: { ...novaVistoria.coordenadas, lat: e.target.value },
                                  })
                                }
                                className="border-blue-200"
                              />
                            </div>
                            <div>
                              <Label htmlFor="longitude">Longitude</Label>
                              <Input
                                id="longitude"
                                value={novaVistoria.coordenadas.lng || selectedObra.longitude}
                                onChange={(e) =>
                                  setNovaVistoria({
                                    ...novaVistoria,
                                    coordenadas: { ...novaVistoria.coordenadas, lng: e.target.value },
                                  })
                                }
                                className="border-blue-200"
                              />
                            </div>
                          </div>
                          <div className="h-64 rounded-lg overflow-hidden border border-blue-200">
                            <Map
                              markers={[
                                {
                                  nome: selectedObra.titulo,
                                  latitude: selectedObra.latitude,
                                  longitude: selectedObra.longitude,
                                },
                              ]}
                            />
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            Registro Fotográfico
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="border-2 border-dashed border-blue-300 rounded-lg p-6 text-center">
                            <Camera className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                            <p className="text-blue-600 mb-2">Adicione fotos da vistoria</p>
                            <Button variant="outline" className="border-blue-300 text-blue-600">
                              Selecionar Fotos
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card className="border-blue-200">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-800 flex items-center gap-2">
                            <Ruler className="h-5 w-5" />
                            Medições
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input placeholder="Tipo de medição" className="border-blue-200" />
                              <Input placeholder="Valor" className="border-blue-200" />
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="text-sm text-blue-600">Ex: Comprimento pavimentado: 150m</div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div>
                      <Label htmlFor="observacoes">Observações</Label>
                      <Textarea
                        id="observacoes"
                        value={novaVistoria.observacoes}
                        onChange={(e) => setNovaVistoria({ ...novaVistoria, observacoes: e.target.value })}
                        placeholder="Observações sobre qualidade, cronograma, problemas identificados..."
                        rows={3}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="border-blue-300 text-blue-600">
                        <Eye className="h-4 w-4 mr-2" />
                        Visualizar
                      </Button>
                      <Button onClick={salvarVistoria} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4 mr-2" />
                        Salvar Vistoria
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="historico">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Histórico de Vistorias</CardTitle>
                    <CardDescription className="text-blue-600">Consulte todas as vistorias realizadas</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="flex gap-4 mb-6">
                      <div className="flex-1">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por obra, equipe ou data..."
                            className="pl-10 border-blue-200 focus:border-blue-500"
                          />
                        </div>
                      </div>
                      <Select>
                        <SelectTrigger className="w-48 border-blue-200">
                          <SelectValue placeholder="Filtrar por status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todas">Todas</SelectItem>
                          <SelectItem value="concluida">Concluídas</SelectItem>
                          <SelectItem value="andamento">Em Andamento</SelectItem>
                          <SelectItem value="pendente">Pendentes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-4">
                      {vistorias.map((vistoria) => (
                        <div
                          key={vistoria.id}
                          className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={getStatusColor(vistoria.status)}>{vistoria.status}</Badge>
                                <Badge className="bg-blue-100 text-blue-800">{vistoria.obra}</Badge>
                              </div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-2">
                                Vistoria #{vistoria.id} - {obras.find((o) => o.id === vistoria.obra)?.titulo}
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                                <div className="flex items-center gap-2">
                                  <Calendar className="w-4 h-4 text-blue-500" />
                                  {vistoria.data}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calculator className="w-4 h-4 text-blue-500" />
                                  Progresso: {vistoria.progresso}%
                                </div>
                                <div className="flex items-center gap-2">
                                  <Ruler className="w-4 h-4 text-blue-500" />
                                  Área: {vistoria.area}
                                </div>
                              </div>
                              <p className="text-gray-700 mb-2">
                                <strong>Produção:</strong> {vistoria.producao}
                              </p>
                              {vistoria.observacoes && (
                                <p className="text-gray-600 text-sm">
                                  <strong>Observações:</strong> {vistoria.observacoes}
                                </p>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="mapa">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Mapa de Produção
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Visualize a localização e progresso de todas as obras
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="h-[600px] w-full rounded-lg overflow-hidden border border-blue-200">
                      <Map
                        markers={obras.map((obra) => ({
                          nome: `${obra.titulo} - ${obra.distrito}`,
                          latitude: obra.latitude,
                          longitude: obra.longitude,
                        }))}
                      />
                    </div>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-800">{obras.length}</div>
                          <div className="text-sm text-blue-600">Obras Mapeadas</div>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-800">{vistorias.length}</div>
                          <div className="text-sm text-blue-600">Vistorias Realizadas</div>
                        </CardContent>
                      </Card>
                      <Card className="border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4 text-center">
                          <div className="text-2xl font-bold text-blue-800">
                            {Math.round(vistorias.reduce((acc, v) => acc + v.progresso, 0) / vistorias.length)}%
                          </div>
                          <div className="text-sm text-blue-600">Progresso Médio</div>
                        </CardContent>
                      </Card>
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
