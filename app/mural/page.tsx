"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Upload, Search, Download, Calendar, MapPin, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const fotosObras = [
  {
    id: 1,
    titulo: "Pavimentação Rua das Flores - Início",
    obra: "OS-25000001",
    distrito: "Centro",
    data: "2025-01-15",
    autor: "João Silva",
    descricao: "Início dos trabalhos de pavimentação na Rua das Flores",
    url: "/placeholder.svg?height=300&width=400",
    status: "Em Andamento",
  },
  {
    id: 2,
    titulo: "Construção Praça da Juventude - Fundação",
    obra: "OS-25000002",
    distrito: "Inoã",
    data: "2025-01-14",
    autor: "Maria Santos",
    descricao: "Execução da fundação da nova praça",
    url: "/placeholder.svg?height=300&width=400",
    status: "Em Andamento",
  },
  {
    id: 3,
    titulo: "Reforma Escola Municipal - Antes",
    obra: "OS-25000003",
    distrito: "Itaipuaçu",
    data: "2025-01-13",
    autor: "Carlos Oliveira",
    descricao: "Estado inicial da escola antes da reforma",
    url: "/placeholder.svg?height=300&width=400",
    status: "Planejada",
  },
  {
    id: 4,
    titulo: "Iluminação LED - Instalação",
    obra: "OS-25000004",
    distrito: "Ponta Negra",
    data: "2025-01-12",
    autor: "Ana Costa",
    descricao: "Instalação dos novos postes de LED",
    url: "/placeholder.svg?height=300&width=400",
    status: "Concluída",
  },
  {
    id: 5,
    titulo: "Ponte Pedonal - Estrutura",
    obra: "OS-25000005",
    distrito: "São José do Imbassaí",
    data: "2025-01-11",
    autor: "Pedro Ferreira",
    descricao: "Montagem da estrutura metálica da ponte",
    url: "/placeholder.svg?height=300&width=400",
    status: "Em Andamento",
  },
  {
    id: 6,
    titulo: "Drenagem Av. Litorânea - Progresso",
    obra: "OS-25000006",
    distrito: "Centro",
    data: "2025-01-10",
    autor: "João Silva",
    descricao: "Avanço dos trabalhos de drenagem",
    url: "/placeholder.svg?height=300&width=400",
    status: "Em Andamento",
  },
]

export default function MuralPage() {
  const [user, setUser] = useState<any>(null)
  const [fotos, setFotos] = useState(fotosObras)
  const [filtroDistrito, setFiltroDistrito] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [busca, setBusca] = useState("")
  const [fotoSelecionada, setFotoSelecionada] = useState<any>(null)
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
    let fotosFiltradas = fotosObras

    if (filtroDistrito !== "todos") {
      fotosFiltradas = fotosFiltradas.filter((foto) => foto.distrito === filtroDistrito)
    }

    if (filtroStatus !== "todos") {
      fotosFiltradas = fotosFiltradas.filter((foto) => foto.status === filtroStatus)
    }

    if (busca) {
      fotosFiltradas = fotosFiltradas.filter(
        (foto) =>
          foto.titulo.toLowerCase().includes(busca.toLowerCase()) ||
          foto.obra.toLowerCase().includes(busca.toLowerCase()) ||
          foto.descricao.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    setFotos(fotosFiltradas)
  }, [filtroDistrito, filtroStatus, busca])

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

  const handleUploadFoto = () => {
    // Simular upload de foto
    const novaFoto = {
      id: fotos.length + 1,
      titulo: "Nova Foto da Obra",
      obra: "OS-25000007",
      distrito: "Centro",
      data: new Date().toISOString().split("T")[0],
      autor: user?.name || "Usuário",
      descricao: "Foto adicionada pelo usuário",
      url: "/placeholder.svg?height=300&width=400",
      status: "Em Andamento",
    }
    setFotos([novaFoto, ...fotos])
  }

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-blue-100/50">
        <AppSidebar user={user} />
        <SidebarInset className="flex-1">
          {/* Header */}
          <header className="sticky top-0 z-10 bg-blue-700 text-white border-b">
            <div className="flex h-14 items-center gap-4 px-6">
              <SidebarTrigger className="text-white hover:bg-blue-600" />
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Camera className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-medium">Mural de Acompanhamento</h1>
                  <p className="text-sm text-blue-100">Registro fotográfico das obras</p>
                </div>
              </div>
              <div className="ml-auto">
                <Button onClick={handleUploadFoto} className="bg-blue-600 hover:bg-blue-500">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Foto
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            {/* Filtros e Busca */}
            <div className="mb-6 space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar por título, obra ou descrição..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 border-blue-200"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
                    <SelectTrigger className="w-40 border-blue-200">
                      <SelectValue placeholder="Distrito" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Distritos</SelectItem>
                      <SelectItem value="Centro">Centro</SelectItem>
                      <SelectItem value="Inoã">Inoã</SelectItem>
                      <SelectItem value="Itaipuaçu">Itaipuaçu</SelectItem>
                      <SelectItem value="Ponta Negra">Ponta Negra</SelectItem>
                      <SelectItem value="São José do Imbassaí">São José do Imbassaí</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="w-40 border-blue-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="Em Andamento">Em Andamento</SelectItem>
                      <SelectItem value="Concluída">Concluída</SelectItem>
                      <SelectItem value="Atrasada">Atrasada</SelectItem>
                      <SelectItem value="Planejada">Planejada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Estatísticas */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{fotos.length}</div>
                    <div className="text-sm opacity-90">Total de Fotos</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{fotos.filter((f) => f.status === "Em Andamento").length}</div>
                    <div className="text-sm opacity-90">Em Andamento</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{fotos.filter((f) => f.status === "Concluída").length}</div>
                    <div className="text-sm opacity-90">Concluídas</div>
                  </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{fotos.filter((f) => f.status === "Planejada").length}</div>
                    <div className="text-sm opacity-90">Planejadas</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Grid de Fotos */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {fotos.map((foto) => (
                <Card
                  key={foto.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer border-blue-100"
                  onClick={() => setFotoSelecionada(foto)}
                >
                  <div className="relative">
                    <img src={foto.url || "/placeholder.svg"} alt={foto.titulo} className="w-full h-48 object-cover" />
                    <div className="absolute top-2 right-2">
                      <Badge className={`text-xs ${getStatusColor(foto.status)}`}>{foto.status}</Badge>
                    </div>
                    <div className="absolute bottom-2 left-2">
                      <Badge variant="outline" className="text-xs bg-white/90 border-blue-200">
                        {foto.obra}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-sm text-gray-800 mb-2 line-clamp-2">{foto.titulo}</h3>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {foto.distrito}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(foto.data).toLocaleDateString("pt-BR")}
                      </div>
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {foto.autor}
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{foto.descricao}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {fotos.length === 0 && (
              <div className="text-center py-12">
                <Camera className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">Nenhuma foto encontrada</h3>
                <p className="text-gray-500 mb-4">Tente ajustar os filtros ou adicione novas fotos</p>
                <Button onClick={handleUploadFoto} className="bg-blue-600 hover:bg-blue-700">
                  <Upload className="h-4 w-4 mr-2" />
                  Adicionar Primeira Foto
                </Button>
              </div>
            )}

            {/* Modal de Visualização */}
            {fotoSelecionada && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold text-gray-800">{fotoSelecionada.titulo}</h2>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="border-blue-200">
                          <Download className="h-4 w-4 mr-1" />
                          Baixar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFotoSelecionada(null)}
                          className="border-blue-200"
                        >
                          Fechar
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <img
                          src={fotoSelecionada.url || "/placeholder.svg"}
                          alt={fotoSelecionada.titulo}
                          className="w-full rounded-lg border border-blue-200"
                        />
                      </div>

                      <div className="space-y-4">
                        <div>
                          <h3 className="font-medium text-gray-800 mb-2">Informações da Foto</h3>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Obra:</span>
                              <Badge variant="outline" className="border-blue-200">
                                {fotoSelecionada.obra}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Status:</span>
                              <Badge className={`text-xs ${getStatusColor(fotoSelecionada.status)}`}>
                                {fotoSelecionada.status}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Distrito:</span>
                              <span>{fotoSelecionada.distrito}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Data:</span>
                              <span>{new Date(fotoSelecionada.data).toLocaleDateString("pt-BR")}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Autor:</span>
                              <span>{fotoSelecionada.autor}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="font-medium text-gray-800 mb-2">Descrição</h3>
                          <p className="text-sm text-gray-600">{fotoSelecionada.descricao}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
