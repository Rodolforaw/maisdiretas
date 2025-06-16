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
import { ClipboardList, Play, Pause, CheckCircle, XCircle, Clock, FileText, Send, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const obras = [
  { id: "OS-2024-001", titulo: "Pavimentação Rua das Flores", distrito: "Centro", status: "Em Andamento" },
  { id: "OS-2024-002", titulo: "Construção Praça da Juventude", distrito: "Inoã", status: "Paralisada" },
  { id: "OS-2024-003", titulo: "Reforma Escola Municipal", distrito: "Itaipuaçu", status: "Planejada" },
]

const solicitacoes = [
  {
    id: 1,
    obra: "OS-2024-001",
    tipo: "Execução",
    titulo: "Iniciar pavimentação do setor 2",
    descricao: "Solicito autorização para iniciar a pavimentação do setor 2 da Rua das Flores",
    status: "Pendente",
    data: "2024-01-15",
    prioridade: "Alta",
  },
  {
    id: 2,
    obra: "OS-2024-002",
    tipo: "Paralização",
    titulo: "Paralisar obra devido às chuvas",
    descricao: "Condições climáticas inadequadas impedem a continuidade dos trabalhos",
    status: "Aprovada",
    data: "2024-01-14",
    prioridade: "Alta",
  },
  {
    id: 3,
    obra: "OS-2024-003",
    tipo: "Abertura",
    titulo: "Solicitar abertura da obra",
    descricao: "Todos os recursos necessários estão disponíveis para iniciar a obra",
    status: "Em Análise",
    data: "2024-01-13",
    prioridade: "Média",
  },
]

export default function SolicitacoesPage() {
  const [user, setUser] = useState<any>(null)
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    obra: "",
    tipo: "",
    titulo: "",
    descricao: "",
    prioridade: "Média",
    anexos: [] as any[],
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

  const enviarSolicitacao = () => {
    console.log("Solicitação enviada:", novaSolicitacao)
    alert("Solicitação enviada com sucesso!")
    setNovaSolicitacao({
      obra: "",
      tipo: "",
      titulo: "",
      descricao: "",
      prioridade: "Média",
      anexos: [],
    })
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "Abertura":
        return <Play className="h-4 w-4" />
      case "Execução":
        return <Play className="h-4 w-4" />
      case "Paralização":
        return <Pause className="h-4 w-4" />
      case "Conclusão":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Em Análise":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Aprovada":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rejeitada":
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
                  <ClipboardList className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Solicitações</h1>
                  <p className="text-sm text-gray-600">
                    Gerencie solicitações de abertura, execução, paralisação e conclusão
                  </p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            <Tabs defaultValue="nova" className="space-y-6">
              <TabsList className="bg-blue-50 border border-blue-200">
                <TabsTrigger value="nova" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Nova Solicitação
                </TabsTrigger>
                <TabsTrigger value="minhas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Minhas Solicitações
                </TabsTrigger>
                <TabsTrigger value="todas" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
                  Todas as Solicitações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="nova">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800 flex items-center gap-2">
                      <ClipboardList className="h-5 w-5" />
                      Nova Solicitação
                    </CardTitle>
                    <CardDescription className="text-blue-600">
                      Solicite abertura, execução, paralisação ou conclusão de obras
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <Label htmlFor="obra">Obra *</Label>
                        <Select
                          value={novaSolicitacao.obra}
                          onValueChange={(value) => setNovaSolicitacao({ ...novaSolicitacao, obra: value })}
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
                        <Label htmlFor="tipo">Tipo de Solicitação *</Label>
                        <Select
                          value={novaSolicitacao.tipo}
                          onValueChange={(value) => setNovaSolicitacao({ ...novaSolicitacao, tipo: value })}
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-500">
                            <SelectValue placeholder="Selecione o tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Abertura">
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4" />
                                Abertura de Obra
                              </div>
                            </SelectItem>
                            <SelectItem value="Execução">
                              <div className="flex items-center gap-2">
                                <Play className="h-4 w-4" />
                                Execução/Continuidade
                              </div>
                            </SelectItem>
                            <SelectItem value="Paralização">
                              <div className="flex items-center gap-2">
                                <Pause className="h-4 w-4" />
                                Paralisação
                              </div>
                            </SelectItem>
                            <SelectItem value="Conclusão">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4" />
                                Conclusão
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="prioridade">Prioridade</Label>
                        <Select
                          value={novaSolicitacao.prioridade}
                          onValueChange={(value) => setNovaSolicitacao({ ...novaSolicitacao, prioridade: value })}
                        >
                          <SelectTrigger className="border-blue-200 focus:border-blue-500">
                            <SelectValue placeholder="Selecione a prioridade" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Alta">🔴 Alta</SelectItem>
                            <SelectItem value="Média">🟡 Média</SelectItem>
                            <SelectItem value="Baixa">🟢 Baixa</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="titulo">Título da Solicitação *</Label>
                      <Input
                        id="titulo"
                        value={novaSolicitacao.titulo}
                        onChange={(e) => setNovaSolicitacao({ ...novaSolicitacao, titulo: e.target.value })}
                        placeholder="Ex: Solicitar início da pavimentação do setor 2"
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <Label htmlFor="descricao">Descrição *</Label>
                      <Textarea
                        id="descricao"
                        value={novaSolicitacao.descricao}
                        onChange={(e) => setNovaSolicitacao({ ...novaSolicitacao, descricao: e.target.value })}
                        placeholder="Descreva detalhadamente a solicitação, motivos, recursos necessários..."
                        rows={4}
                        className="border-blue-200 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <Label>Anexos</Label>
                      <div className="border-2 border-dashed border-blue-300 rounded-lg p-4 text-center">
                        <FileText className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                        <p className="text-blue-600 mb-2">Adicione documentos, fotos ou planilhas</p>
                        <Button variant="outline" className="border-blue-300 text-blue-600">
                          Selecionar Arquivos
                        </Button>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4">
                      <Button variant="outline" className="border-blue-300 text-blue-600">
                        Salvar Rascunho
                      </Button>
                      <Button onClick={enviarSolicitacao} className="bg-blue-600 hover:bg-blue-700">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Solicitação
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="minhas">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Minhas Solicitações</CardTitle>
                    <CardDescription className="text-blue-600">
                      Acompanhe o status das suas solicitações
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {solicitacoes
                        .filter((s) => user.cargo === "encarregado")
                        .map((solicitacao) => (
                          <div
                            key={solicitacao.id}
                            className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50/50 transition-colors"
                          >
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Badge className={getStatusColor(solicitacao.status)}>
                                    <Clock className="h-3 w-3 mr-1" />
                                    {solicitacao.status}
                                  </Badge>
                                  <Badge className="bg-blue-100 text-blue-800">
                                    {getTipoIcon(solicitacao.tipo)}
                                    <span className="ml-1">{solicitacao.tipo}</span>
                                  </Badge>
                                  <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                                    {solicitacao.prioridade}
                                  </Badge>
                                </div>
                                <h3 className="font-semibold text-lg text-gray-800 mb-1">{solicitacao.titulo}</h3>
                                <p className="text-gray-600 mb-2">{solicitacao.descricao}</p>
                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                  <span>Obra: {solicitacao.obra}</span>
                                  <span>Data: {solicitacao.data}</span>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="todas">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Todas as Solicitações</CardTitle>
                    <CardDescription className="text-blue-600">
                      Visualize todas as solicitações do sistema
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {solicitacoes.map((solicitacao) => (
                        <div
                          key={solicitacao.id}
                          className="border border-blue-100 rounded-lg p-4 hover:bg-blue-50/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <Badge className={getStatusColor(solicitacao.status)}>
                                  <Clock className="h-3 w-3 mr-1" />
                                  {solicitacao.status}
                                </Badge>
                                <Badge className="bg-blue-100 text-blue-800">
                                  {getTipoIcon(solicitacao.tipo)}
                                  <span className="ml-1">{solicitacao.tipo}</span>
                                </Badge>
                                <Badge className={getPrioridadeColor(solicitacao.prioridade)}>
                                  {solicitacao.prioridade}
                                </Badge>
                              </div>
                              <h3 className="font-semibold text-lg text-gray-800 mb-1">{solicitacao.titulo}</h3>
                              <p className="text-gray-600 mb-2">{solicitacao.descricao}</p>
                              <div className="flex items-center gap-4 text-sm text-gray-500">
                                <span>Obra: {solicitacao.obra}</span>
                                <span>Data: {solicitacao.data}</span>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              {user.cargo === "admin" || user.cargo === "gerente" ? (
                                <>
                                  <Button variant="outline" size="sm" className="border-green-200 text-green-600">
                                    <CheckCircle className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" className="border-red-200 text-red-600">
                                    <XCircle className="h-4 w-4" />
                                  </Button>
                                </>
                              ) : null}
                              <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
