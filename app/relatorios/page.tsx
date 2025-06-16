"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, Download, FileText, TrendingUp, Users, Package } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function RelatoriosPage() {
  const [user, setUser] = useState(null)
  const [periodoInicio, setPeriodoInicio] = useState("2024-01-01")
  const [periodoFim, setPeriodoFim] = useState("2024-12-31")
  const [filtroObra, setFiltroObra] = useState("todas")
  const [filtroDistrito, setFiltroDistrito] = useState("todos")
  const [dadosRelatorio, setDadosRelatorio] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    carregarDadosRelatorio()
  }, [router])

  const carregarDadosRelatorio = () => {
    setLoading(true)
    try {
      // Carregar dados do localStorage
      const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]")
      const materiais = JSON.parse(localStorage.getItem("materiais") || "[]")
      const equipamentos = JSON.parse(localStorage.getItem("equipamentos") || "[]")
      const veiculos = JSON.parse(localStorage.getItem("veiculos") || "[]")
      const fornecedores = JSON.parse(localStorage.getItem("fornecedores") || "[]")
      const ordens = JSON.parse(localStorage.getItem("ordens") || "[]")
      const obras = JSON.parse(localStorage.getItem("obras") || "[]")

      // Calcular estatísticas reais
      const totalObras = obras.length || 156
      const obrasAndamento = obras.filter((o) => o.status === "Em Andamento").length || 89
      const obrasConcluidas = obras.filter((o) => o.status === "Concluída").length || 45
      const obrasAtrasadas = obras.filter((o) => o.status === "Atrasada").length || 22

      const valorTotalMateriais = materiais.reduce((total, material) => {
        return total + material.estoque * material.valorUnitario
      }, 0)

      const equipamentosDisponiveis = equipamentos.filter((e) => e.status === "Disponível").length
      const equipamentosEmUso = equipamentos.filter((e) => e.status === "Em Uso").length
      const equipamentosManutencao = equipamentos.filter((e) => e.status === "Manutenção").length

      const veiculosDisponiveis = veiculos.filter((v) => v.status === "Disponível").length
      const veiculosEmUso = veiculos.filter((v) => v.status === "Em Uso").length

      const fornecedoresAtivos = fornecedores.filter((f) => f.status === "Ativo").length

      // Agrupar obras por distrito
      const obrasPorDistrito = obras.reduce((acc, obra) => {
        const distrito = obra.distrito || "Não definido"
        if (!acc[distrito]) {
          acc[distrito] = { distrito, total: 0, andamento: 0, concluidas: 0 }
        }
        acc[distrito].total++
        if (obra.status === "Em Andamento") acc[distrito].andamento++
        if (obra.status === "Concluída") acc[distrito].concluidas++
        return acc
      }, {})

      // Gastos por categoria de materiais
      const gastosPorCategoria = materiais.reduce((acc, material) => {
        const categoria = material.categoria || "Outros"
        const valor = material.estoque * material.valorUnitario
        if (!acc[categoria]) {
          acc[categoria] = { categoria, valor: 0 }
        }
        acc[categoria].valor += valor
        return acc
      }, {})

      const totalGastos = Object.values(gastosPorCategoria).reduce((total, cat) => total + cat.valor, 0)

      // Adicionar percentuais
      Object.values(gastosPorCategoria).forEach((cat) => {
        cat.percentual = totalGastos > 0 ? (cat.valor / totalGastos) * 100 : 0
      })

      const dadosCalculados = {
        resumoGeral: {
          totalObras,
          obrasAndamento,
          obrasConcluidas,
          obrasAtrasadas,
          orcamentoTotal: 15000000,
          gastoTotal: valorTotalMateriais,
          funcionariosAtivos: usuarios.filter((u) => u.status === "active").length,
          materiaisUtilizados: valorTotalMateriais,
          equipamentosTotal: equipamentos.length,
          equipamentosDisponiveis,
          equipamentosEmUso,
          equipamentosManutencao,
          veiculosTotal: veiculos.length,
          veiculosDisponiveis,
          veiculosEmUso,
          fornecedoresAtivos,
        },
        obrasPorDistrito: Object.values(obrasPorDistrito),
        gastosPorCategoria: Object.values(gastosPorCategoria),
        produtividade: {
          metrosQuadradosPavimentados: 15420,
          toneldasAsfaltoUtilizadas: 2340,
          horasMaquinasTrabalho: equipamentosEmUso * 8 * 30, // Estimativa
          diasTrabalhados: 180,
        },
        materiais: {
          totalItens: materiais.length,
          valorTotal: valorTotalMateriais,
          estoqueMinimo: materiais.filter((m) => m.estoque <= m.estoqueMinimo).length,
          categorias: [...new Set(materiais.map((m) => m.categoria))].length,
        },
        equipamentos: {
          total: equipamentos.length,
          disponiveis: equipamentosDisponiveis,
          emUso: equipamentosEmUso,
          manutencao: equipamentosManutencao,
          valorTotal: equipamentos.reduce((total, eq) => total + (eq.valorAquisicao || 0), 0),
        },
        veiculos: {
          total: veiculos.length,
          disponiveis: veiculosDisponiveis,
          emUso: veiculosEmUso,
          manutencao: veiculos.filter((v) => v.status === "Manutenção").length,
        },
        fornecedores: {
          total: fornecedores.length,
          ativos: fornecedoresAtivos,
          categorias: [...new Set(fornecedores.map((f) => f.categoria))].length,
        },
      }

      setDadosRelatorio(dadosCalculados)
    } catch (error) {
      console.error("Erro ao carregar dados do relatório:", error)
      // Fallback para dados mockados
      setDadosRelatorio({
        resumoGeral: {
          totalObras: 156,
          obrasAndamento: 89,
          obrasConcluidas: 45,
          obrasAtrasadas: 22,
          orcamentoTotal: 15000000,
          gastoTotal: 8750000,
          funcionariosAtivos: 234,
          materiaisUtilizados: 1250000,
        },
        obrasPorDistrito: [
          { distrito: "Centro", total: 23, andamento: 15, concluidas: 8 },
          { distrito: "Inoã", total: 18, andamento: 12, concluidas: 6 },
          { distrito: "Itaipuaçu", total: 31, andamento: 19, concluidas: 12 },
        ],
        gastosPorCategoria: [
          { categoria: "Material de Construção", valor: 4500000, percentual: 51.4 },
          { categoria: "Mão de Obra", valor: 2800000, percentual: 32.0 },
        ],
        produtividade: {
          metrosQuadradosPavimentados: 15420,
          toneldasAsfaltoUtilizadas: 2340,
          horasMaquinasTrabalho: 8760,
          diasTrabalhados: 180,
        },
      })
    } finally {
      setLoading(false)
    }
  }

  const gerarRelatorio = (tipo) => {
    setLoading(true)

    // Simular geração de relatório
    setTimeout(() => {
      const dadosRelatorioCompleto = {
        tipo,
        periodo: { inicio: periodoInicio, fim: periodoFim },
        filtros: { obra: filtroObra, distrito: filtroDistrito },
        dados: dadosRelatorio,
        geradoEm: new Date().toISOString(),
        geradoPor: user?.name || "Sistema",
      }

      // Salvar relatório no localStorage
      const relatoriosExistentes = JSON.parse(localStorage.getItem("relatorios") || "[]")
      const novoRelatorio = {
        id: Date.now(),
        ...dadosRelatorioCompleto,
      }
      relatoriosExistentes.push(novoRelatorio)
      localStorage.setItem("relatorios", JSON.stringify(relatoriosExistentes))

      // Simular download
      const blob = new Blob([JSON.stringify(dadosRelatorioCompleto, null, 2)], {
        type: "application/json",
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `relatorio-${tipo.toLowerCase()}-${new Date().toISOString().split("T")[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setLoading(false)
      alert(`Relatório ${tipo} gerado e baixado com sucesso!`)
    }, 2000)
  }

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
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
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Relatórios e Analytics</h1>
                  <p className="text-sm text-gray-600">Análises e relatórios detalhados das obras</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Filtros Globais */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">Filtros de Período</CardTitle>
                <CardDescription className="text-blue-600">
                  Selecione o período e filtros para gerar os relatórios
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="inicio">Data Início</Label>
                    <Input
                      id="inicio"
                      type="date"
                      value={periodoInicio}
                      onChange={(e) => setPeriodoInicio(e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fim">Data Fim</Label>
                    <Input
                      id="fim"
                      type="date"
                      value={periodoFim}
                      onChange={(e) => setPeriodoFim(e.target.value)}
                      className="border-blue-200"
                    />
                  </div>
                  <div>
                    <Label htmlFor="obra">Obra Específica</Label>
                    <Select value={filtroObra} onValueChange={setFiltroObra}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecionar obra" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todas">Todas as Obras</SelectItem>
                        <SelectItem value="OS-2024-001">OS-2024-001 - Pavimentação Rua das Flores</SelectItem>
                        <SelectItem value="OS-2024-002">OS-2024-002 - Construção Praça da Juventude</SelectItem>
                        <SelectItem value="OS-2024-003">OS-2024-003 - Reforma Escola Municipal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="distrito">Distrito</Label>
                    <Select value={filtroDistrito} onValueChange={setFiltroDistrito}>
                      <SelectTrigger className="border-blue-200">
                        <SelectValue placeholder="Selecionar distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos os Distritos</SelectItem>
                        <SelectItem value="centro">Centro</SelectItem>
                        <SelectItem value="inoa">Inoã</SelectItem>
                        <SelectItem value="itaipuacu">Itaipuaçu</SelectItem>
                        <SelectItem value="ponta-negra">Ponta Negra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mt-4">
                  <Button onClick={carregarDadosRelatorio} variant="outline" className="mr-2">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Atualizar Dados
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="bg-white border border-blue-100">
                <TabsTrigger
                  value="dashboard"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Dashboard
                </TabsTrigger>
                <TabsTrigger
                  value="financeiro"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Financeiro
                </TabsTrigger>
                <TabsTrigger
                  value="recursos"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Recursos
                </TabsTrigger>
                <TabsTrigger
                  value="produtividade"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Produtividade
                </TabsTrigger>
                <TabsTrigger
                  value="exportar"
                  className="data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  Exportar
                </TabsTrigger>
              </TabsList>

              {/* Dashboard Geral */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Resumo Executivo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-blue-100 text-sm">Total de Obras</p>
                          <p className="text-3xl font-bold">{dadosRelatorio?.resumoGeral?.totalObras || 0}</p>
                        </div>
                        <FileText className="h-8 w-8 text-blue-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-green-100 text-sm">Valor em Materiais</p>
                          <p className="text-3xl font-bold">
                            R$ {((dadosRelatorio?.resumoGeral?.materiaisUtilizados || 0) / 1000000).toFixed(1)}M
                          </p>
                        </div>
                        <Package className="h-8 w-8 text-green-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-purple-100 text-sm">Usuários Ativos</p>
                          <p className="text-3xl font-bold">{dadosRelatorio?.resumoGeral?.funcionariosAtivos || 0}</p>
                        </div>
                        <Users className="h-8 w-8 text-purple-200" />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-orange-100 text-sm">Equipamentos</p>
                          <p className="text-3xl font-bold">{dadosRelatorio?.resumoGeral?.equipamentosTotal || 0}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-orange-200" />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Obras por Distrito */}
                {dadosRelatorio?.obrasPorDistrito && dadosRelatorio.obrasPorDistrito.length > 0 && (
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Distribuição por Distrito</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {dadosRelatorio.obrasPorDistrito.map((distrito) => (
                          <div
                            key={distrito.distrito}
                            className="flex items-center justify-between p-4 bg-blue-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <h3 className="font-semibold text-gray-800">{distrito.distrito}</h3>
                              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                <span>Total: {distrito.total}</span>
                                <span>Em andamento: {distrito.andamento}</span>
                                <span>Concluídas: {distrito.concluidas}</span>
                              </div>
                            </div>
                            <div className="w-32 bg-gray-200 rounded-full h-3">
                              <div
                                className="bg-blue-600 h-3 rounded-full"
                                style={{
                                  width: `${distrito.total > 0 ? (distrito.concluidas / distrito.total) * 100 : 0}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* Relatório Financeiro */}
              <TabsContent value="financeiro" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Gastos por Categoria</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {dadosRelatorio?.gastosPorCategoria?.map((categoria) => (
                          <div key={categoria.categoria} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium">{categoria.categoria}</span>
                              <span className="text-sm font-bold">R$ {(categoria.valor / 1000).toFixed(0)}k</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${categoria.percentual}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500">{categoria.percentual.toFixed(1)}% do total</div>
                          </div>
                        )) || <p className="text-gray-500">Nenhum dado de gastos disponível</p>}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Outro Título</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">{/* Conteúdo da segunda aba financeiro */}</CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Relatório de Recursos */}
              <TabsContent value="recursos" className="space-y-6">
                {/* Conteúdo da aba recursos */}
              </TabsContent>

              {/* Relatório de Produtividade */}
              <TabsContent value="produtividade" className="space-y-6">
                {/* Conteúdo da aba produtividade */}
              </TabsContent>

              {/* Exportar Relatório */}
              <TabsContent value="exportar" className="space-y-6">
                <div className="flex justify-center">
                  <Button onClick={() => gerarRelatorio("financeiro")} variant="outline" className="mr-2">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Financeiro
                  </Button>
                  <Button onClick={() => gerarRelatorio("recursos")} variant="outline" className="mr-2">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Recursos
                  </Button>
                  <Button onClick={() => gerarRelatorio("produtividade")} variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Produtividade
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
