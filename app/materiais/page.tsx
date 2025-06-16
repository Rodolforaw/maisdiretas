"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Package, Plus, Search, Edit, Trash2, ShoppingCart, FileText, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const materiais = [
  {
    id: 1,
    nome: "Asfalto CBUQ",
    categoria: "Pavimentação",
    unidade: "ton",
    estoque: 150,
    estoqueMinimo: 50,
    valorUnitario: 450,
    fornecedor: "Asfaltos Maricá Ltda",
    status: "Disponível",
  },
  {
    id: 2,
    nome: "Brita Graduada",
    categoria: "Agregados",
    unidade: "m³",
    estoque: 200,
    estoqueMinimo: 100,
    valorUnitario: 85,
    fornecedor: "Pedreira Central",
    status: "Disponível",
  },
  {
    id: 3,
    nome: "Cimento Portland",
    categoria: "Cimentícios",
    unidade: "saca",
    estoque: 25,
    estoqueMinimo: 50,
    valorUnitario: 32,
    fornecedor: "Cimentos do Brasil",
    status: "Estoque Baixo",
  },
  {
    id: 4,
    nome: "Tinta para Sinalização",
    categoria: "Tintas",
    unidade: "lata",
    estoque: 80,
    estoqueMinimo: 30,
    valorUnitario: 125,
    fornecedor: "Tintas Especiais RJ",
    status: "Disponível",
  },
  {
    id: 5,
    nome: "Ferro 12mm",
    categoria: "Estrutural",
    unidade: "barra",
    estoque: 5,
    estoqueMinimo: 20,
    valorUnitario: 45,
    fornecedor: "Aços Maricá",
    status: "Crítico",
  },
]

const solicitacoesMateriais = [
  {
    id: "RM-2024-001",
    obra: "OS-2024-001",
    solicitante: "João Silva",
    datasolicitacao: "2024-01-20",
    status: "Pendente",
    prioridade: "Alta",
    itens: [
      { material: "Asfalto CBUQ", quantidade: 10, unidade: "ton", justificativa: "Pavimentação setor 2" },
      { material: "Brita Graduada", quantidade: 15, unidade: "m³", justificativa: "Base da pavimentação" },
    ],
    observacoes: "Material necessário para continuidade da obra",
    valorTotal: 5775,
  },
  {
    id: "RM-2024-002",
    obra: "OS-2024-002",
    solicitante: "Maria Santos",
    datasolicitacao: "2024-01-19",
    status: "Aprovada",
    prioridade: "Média",
    itens: [{ material: "Cimento Portland", quantidade: 20, unidade: "saca", justificativa: "Fundação da praça" }],
    observacoes: "Urgente para não atrasar cronograma",
    valorTotal: 640,
    dataAprovacao: "2024-01-20",
    aprovadoPor: "Carlos Admin",
  },
  {
    id: "RM-2024-003",
    obra: "OS-2024-003",
    solicitante: "Carlos Oliveira",
    datasolicitacao: "2024-01-18",
    status: "Rejeitada",
    prioridade: "Baixa",
    itens: [{ material: "Ferro 12mm", quantidade: 50, unidade: "barra", justificativa: "Estrutura do telhado" }],
    observacoes: "Quantidade muito alta para o orçamento atual",
    valorTotal: 2250,
    dataResposta: "2024-01-19",
    respondidoPor: "Ana Gerente",
    motivoRejeicao: "Orçamento insuficiente para esta quantidade",
  },
]

export default function MateriaisPage() {
  const [user, setUser] = useState<any>(null)
  const [busca, setBusca] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [materiaisFiltrados, setMateriaisFiltrados] = useState(materiais)
  const [novaSolicitacao, setNovaSolicitacao] = useState({
    obra: "",
    prioridade: "Média",
    observacoes: "",
    itens: [] as any[],
  })
  const [novoItem, setNovoItem] = useState({
    materialId: "",
    quantidade: "",
    justificativa: "",
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
    let filtered = materiais

    if (busca) {
      filtered = filtered.filter(
        (material) =>
          material.nome.toLowerCase().includes(busca.toLowerCase()) ||
          material.categoria.toLowerCase().includes(busca.toLowerCase()),
      )
    }

    if (filtroCategoria !== "todos") {
      filtered = filtered.filter((material) => material.categoria.toLowerCase() === filtroCategoria)
    }

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((material) => material.status.toLowerCase().replace(" ", "-") === filtroStatus)
    }

    setMateriaisFiltrados(filtered)
  }, [busca, filtroCategoria, filtroStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Disponível":
        return "bg-green-100 text-green-800 border-green-200"
      case "Estoque Baixo":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Crítico":
        return "bg-red-100 text-red-800 border-red-200"
      case "Pendente":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Aprovada":
        return "bg-green-100 text-green-800 border-green-200"
      case "Rejeitada":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const adicionarItem = () => {
    if (novoItem.materialId && novoItem.quantidade) {
      const material = materiais.find((m) => m.id.toString() === novoItem.materialId)
      if (material) {
        setNovaSolicitacao({
          ...novaSolicitacao,
          itens: [
            ...novaSolicitacao.itens,
            {
              ...novoItem,
              material: material.nome,
              unidade: material.unidade,
              valorUnitario: material.valorUnitario,
              valorTotal: Number.parseFloat(novoItem.quantidade) * material.valorUnitario,
              id: Date.now(),
            },
          ],
        })
        setNovoItem({ materialId: "", quantidade: "", justificativa: "" })
      }
    }
  }

  const enviarSolicitacao = () => {
    if (novaSolicitacao.obra && novaSolicitacao.itens.length > 0) {
      console.log("Solicitação enviada:", novaSolicitacao)
      alert("Solicitação de material enviada com sucesso! RM gerada.")
      setNovaSolicitacao({
        obra: "",
        prioridade: "Média",
        observacoes: "",
        itens: [],
      })
    }
  }

  const aprovarSolicitacao = (id: string) => {
    console.log("Aprovando solicitação:", id)
    alert("Solicitação aprovada! Material será liberado.")
  }

  const rejeitarSolicitacao = (id: string) => {
    console.log("Rejeitando solicitação:", id)
    alert("Solicitação rejeitada.")
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
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Controle de Materiais</h1>
                  <p className="text-sm text-gray-600">Gestão de estoque e solicitações</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            <Tabs defaultValue={user.cargo === "encarregado" ? "solicitar" : "estoque"} className="space-y-6">
              <TabsList className="bg-white border border-blue-100">
                {(user.cargo === "admin" || user.cargo === "gerente") && (
                  <TabsTrigger
                    value="estoque"
                    className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                  >
                    Estoque
                  </TabsTrigger>
                )}
                <TabsTrigger
                  value="solicitar"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  {user.cargo === "encarregado" ? "Solicitar Material" : "Solicitações"}
                </TabsTrigger>
                <TabsTrigger
                  value="historico"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Histórico RM
                </TabsTrigger>
              </TabsList>

              {/* Aba Estoque - Apenas Admin/Gerente */}
              {(user.cargo === "admin" || user.cargo === "gerente") && (
                <TabsContent value="estoque" className="space-y-6">
                  {/* Filtros */}
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Filtros de Estoque</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar materiais..."
                            value={busca}
                            onChange={(e) => setBusca(e.target.value)}
                            className="pl-10 border-blue-200 focus:border-blue-500"
                          />
                        </div>
                        <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todas</SelectItem>
                            <SelectItem value="pavimentação">Pavimentação</SelectItem>
                            <SelectItem value="agregados">Agregados</SelectItem>
                            <SelectItem value="cimentícios">Cimentícios</SelectItem>
                            <SelectItem value="tintas">Tintas</SelectItem>
                            <SelectItem value="estrutural">Estrutural</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            <SelectItem value="disponível">Disponível</SelectItem>
                            <SelectItem value="estoque-baixo">Estoque Baixo</SelectItem>
                            <SelectItem value="crítico">Crítico</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setBusca("")
                            setFiltroCategoria("todos")
                            setFiltroStatus("todos")
                          }}
                          className="border-blue-200 text-blue-600"
                        >
                          Limpar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Lista de Materiais */}
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Estoque de Materiais</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {materiaisFiltrados.map((material) => (
                          <Card key={material.id} className="border-blue-100">
                            <CardContent className="p-4">
                              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="font-semibold text-gray-800">{material.nome}</h3>
                                    <Badge variant="outline" className="border-blue-200 text-blue-700">
                                      {material.categoria}
                                    </Badge>
                                    <Badge className={getStatusColor(material.status)}>{material.status}</Badge>
                                  </div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                                    <div>
                                      <span className="text-gray-500">Estoque:</span>
                                      <span className="font-semibold text-gray-800 ml-1">
                                        {material.estoque} {material.unidade}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Mínimo:</span>
                                      <span className="font-semibold text-gray-800 ml-1">
                                        {material.estoqueMinimo} {material.unidade}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Valor:</span>
                                      <span className="font-semibold text-gray-800 ml-1">
                                        R$ {material.valorUnitario.toFixed(2)}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-500">Fornecedor:</span>
                                      <span className="text-gray-800 ml-1">{material.fornecedor}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              )}

              {/* Aba Solicitar Material */}
              <TabsContent value="solicitar" className="space-y-6">
                {user.cargo === "encarregado" ? (
                  /* Interface para Encarregado Solicitar */
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800 flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Nova Solicitação de Material
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Solicite materiais para sua obra - será gerada uma RM
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="obra">Obra *</Label>
                          <Select
                            value={novaSolicitacao.obra}
                            onValueChange={(value) => setNovaSolicitacao({ ...novaSolicitacao, obra: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione sua obra" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="OS-2024-001">OS-2024-001 - Pavimentação Rua das Flores</SelectItem>
                              <SelectItem value="OS-2024-002">OS-2024-002 - Construção Praça da Juventude</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="prioridade">Prioridade</Label>
                          <Select
                            value={novaSolicitacao.prioridade}
                            onValueChange={(value) => setNovaSolicitacao({ ...novaSolicitacao, prioridade: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Alta">🔴 Alta</SelectItem>
                              <SelectItem value="Média">🟡 Média</SelectItem>
                              <SelectItem value="Baixa">🟢 Baixa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Adicionar Itens */}
                      <Card className="border-blue-200 bg-blue-50/30">
                        <CardHeader>
                          <CardTitle className="text-lg text-blue-800">Adicionar Material</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Select
                              value={novoItem.materialId}
                              onValueChange={(value) => setNovoItem({ ...novoItem, materialId: value })}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue placeholder="Material" />
                              </SelectTrigger>
                              <SelectContent>
                                {materiais.map((material) => (
                                  <SelectItem key={material.id} value={material.id.toString()}>
                                    {material.nome} ({material.unidade})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <Input
                              type="number"
                              placeholder="Quantidade"
                              value={novoItem.quantidade}
                              onChange={(e) => setNovoItem({ ...novoItem, quantidade: e.target.value })}
                              className="border-blue-200"
                            />
                            <Input
                              placeholder="Justificativa"
                              value={novoItem.justificativa}
                              onChange={(e) => setNovoItem({ ...novoItem, justificativa: e.target.value })}
                              className="border-blue-200"
                            />
                            <Button onClick={adicionarItem} className="bg-blue-600 hover:bg-blue-700">
                              <Plus className="h-4 w-4 mr-2" />
                              Adicionar
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Lista de Itens Adicionados */}
                      {novaSolicitacao.itens.length > 0 && (
                        <Card className="border-blue-200">
                          <CardHeader>
                            <CardTitle className="text-lg text-blue-800">Itens da Solicitação</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              {novaSolicitacao.itens.map((item) => (
                                <div
                                  key={item.id}
                                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-800">{item.material}</div>
                                    <div className="text-sm text-gray-600">
                                      {item.quantidade} {item.unidade} - R$ {item.valorTotal.toFixed(2)}
                                    </div>
                                    <div className="text-sm text-blue-600">{item.justificativa}</div>
                                  </div>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      setNovaSolicitacao({
                                        ...novaSolicitacao,
                                        itens: novaSolicitacao.itens.filter((i) => i.id !== item.id),
                                      })
                                    }
                                    className="border-red-200 text-red-600"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              ))}
                              <div className="border-t pt-3 mt-3">
                                <div className="text-right font-semibold text-lg">
                                  Total: R${" "}
                                  {novaSolicitacao.itens.reduce((acc, item) => acc + item.valorTotal, 0).toFixed(2)}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      <div>
                        <Label htmlFor="observacoes">Observações</Label>
                        <Textarea
                          id="observacoes"
                          value={novaSolicitacao.observacoes}
                          onChange={(e) => setNovaSolicitacao({ ...novaSolicitacao, observacoes: e.target.value })}
                          placeholder="Observações adicionais sobre a solicitação..."
                          className="border-blue-200"
                        />
                      </div>

                      <div className="flex justify-end gap-4">
                        <Button variant="outline" className="border-blue-200">
                          Salvar Rascunho
                        </Button>
                        <Button
                          onClick={enviarSolicitacao}
                          disabled={!novaSolicitacao.obra || novaSolicitacao.itens.length === 0}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Enviar Solicitação
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  /* Interface para Admin/Gerente Aprovar */
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Solicitações Pendentes</CardTitle>
                      <CardDescription className="text-blue-600">
                        Analise e aprove as solicitações de material
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {solicitacoesMateriais
                          .filter((s) => s.status === "Pendente")
                          .map((solicitacao) => (
                            <Card key={solicitacao.id} className="border-yellow-200 bg-yellow-50/30">
                              <CardContent className="p-6">
                                <div className="flex flex-col lg:flex-row justify-between gap-4">
                                  <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-3">
                                      <h3 className="font-semibold text-lg">{solicitacao.id}</h3>
                                      <Badge className={getStatusColor(solicitacao.status)}>{solicitacao.status}</Badge>
                                      <Badge className={getStatusColor(solicitacao.prioridade)}>
                                        {solicitacao.prioridade}
                                      </Badge>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm mb-4">
                                      <div>
                                        <span className="text-gray-500">Obra:</span>
                                        <span className="font-semibold ml-1">{solicitacao.obra}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Solicitante:</span>
                                        <span className="font-semibold ml-1">{solicitacao.solicitante}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Data:</span>
                                        <span className="font-semibold ml-1">{solicitacao.datasolicitacao}</span>
                                      </div>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                      {solicitacao.itens.map((item, index) => (
                                        <div key={index} className="bg-white p-3 rounded border">
                                          <div className="font-semibold">{item.material}</div>
                                          <div className="text-sm text-gray-600">
                                            Quantidade: {item.quantidade} {item.unidade}
                                          </div>
                                          <div className="text-sm text-blue-600">
                                            Justificativa: {item.justificativa}
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                    <div className="text-right font-semibold text-lg text-green-600">
                                      Valor Total: R$ {solicitacao.valorTotal.toFixed(2)}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 lg:w-40">
                                    <Button
                                      onClick={() => aprovarSolicitacao(solicitacao.id)}
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Aprovar
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() => rejeitarSolicitacao(solicitacao.id)}
                                      className="border-red-200 text-red-600"
                                    >
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Rejeitar
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Aba Histórico RM */}
              <TabsContent value="historico" className="space-y-6">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="text-blue-800">Histórico de Requisições de Material</CardTitle>
                    <CardDescription className="text-blue-600">Todas as RMs geradas no sistema</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {solicitacoesMateriais.map((solicitacao) => (
                        <Card key={solicitacao.id} className="border-blue-100">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row justify-between gap-4">
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <h3 className="font-semibold text-lg">{solicitacao.id}</h3>
                                  <Badge className={getStatusColor(solicitacao.status)}>{solicitacao.status}</Badge>
                                  <Badge className={getStatusColor(solicitacao.prioridade)}>
                                    {solicitacao.prioridade}
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm mb-4">
                                  <div>
                                    <span className="text-gray-500">Obra:</span>
                                    <span className="font-semibold ml-1">{solicitacao.obra}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Solicitante:</span>
                                    <span className="font-semibold ml-1">{solicitacao.solicitante}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Data:</span>
                                    <span className="font-semibold ml-1">{solicitacao.datasolicitacao}</span>
                                  </div>
                                  <div>
                                    <span className="text-gray-500">Valor:</span>
                                    <span className="font-semibold text-green-600 ml-1">
                                      R$ {solicitacao.valorTotal.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                                {solicitacao.status === "Aprovada" && (
                                  <div className="text-sm text-green-600 mb-2">
                                    ✅ Aprovada por {solicitacao.aprovadoPor} em {solicitacao.dataAprovacao}
                                  </div>
                                )}
                                {solicitacao.status === "Rejeitada" && (
                                  <div className="text-sm text-red-600 mb-2">
                                    ❌ Rejeitada por {solicitacao.respondidoPor} em {solicitacao.dataResposta}
                                    <br />
                                    Motivo: {solicitacao.motivoRejeicao}
                                  </div>
                                )}
                              </div>
                              <div className="flex gap-2">
                                <Button variant="outline" size="sm" className="border-blue-200 text-blue-600">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Ver RM
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
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
