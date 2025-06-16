"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { HardHat, FileText, Users, Package, Camera, Truck, Plus, Save, Eye } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const obras = [
  { id: "OS-2024-001", titulo: "Pavimentação Rua das Flores", distrito: "Centro" },
  { id: "OS-2024-002", titulo: "Construção Praça da Juventude", distrito: "Inoã" },
  { id: "OS-2024-003", titulo: "Reforma Escola Municipal", distrito: "Itaipuaçu" },
]

const funcionarios = [
  { id: 1, nome: "João Silva", funcao: "Encarregado" },
  { id: 2, nome: "Maria Santos", funcao: "Operadora de Máquinas" },
  { id: 3, nome: "Carlos Oliveira", funcao: "Pedreiro" },
  { id: 4, nome: "Ana Costa", funcao: "Auxiliar" },
]

const maquinas = [
  { id: 1, nome: "Escavadeira CAT 320", tipo: "Escavadeira" },
  { id: 2, nome: "Rolo Compactador", tipo: "Compactador" },
  { id: 3, nome: "Caminhão Basculante", tipo: "Transporte" },
]

export default function DiarioObrasPage() {
  const [user, setUser] = useState<any>(null)
  const [diarioData, setDiarioData] = useState({
    obra: "",
    data: new Date().toISOString().split("T")[0],
    clima: "",
    atividades: "",
    funcionarios: [] as any[],
    materiais: [] as any[],
    maquinario: [] as any[],
    fotos: [] as any[],
    observacoes: "",
  })
  const [novoFuncionario, setNovoFuncionario] = useState({
    funcionarioId: "",
    horaEntrada: "",
    horaSaida: "",
    funcao: "",
  })
  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    quantidade: "",
    unidade: "",
  })
  const [novaMaquina, setNovaMaquina] = useState({
    maquinaId: "",
    horasTrabalho: "",
    operador: "",
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

  const adicionarFuncionario = () => {
    if (novoFuncionario.funcionarioId && novoFuncionario.horaEntrada) {
      const funcionario = funcionarios.find((f) => f.id.toString() === novoFuncionario.funcionarioId)
      setDiarioData({
        ...diarioData,
        funcionarios: [
          ...diarioData.funcionarios,
          {
            ...novoFuncionario,
            nome: funcionario?.nome,
            id: Date.now(),
          },
        ],
      })
      setNovoFuncionario({ funcionarioId: "", horaEntrada: "", horaSaida: "", funcao: "" })
    }
  }

  const adicionarMaterial = () => {
    if (novoMaterial.nome && novoMaterial.quantidade) {
      setDiarioData({
        ...diarioData,
        materiais: [...diarioData.materiais, { ...novoMaterial, id: Date.now() }],
      })
      setNovoMaterial({ nome: "", quantidade: "", unidade: "" })
    }
  }

  const adicionarMaquina = () => {
    if (novaMaquina.maquinaId && novaMaquina.horasTrabalho) {
      const maquina = maquinas.find((m) => m.id.toString() === novaMaquina.maquinaId)
      setDiarioData({
        ...diarioData,
        maquinario: [
          ...diarioData.maquinario,
          {
            ...novaMaquina,
            nome: maquina?.nome,
            tipo: maquina?.tipo,
            id: Date.now(),
          },
        ],
      })
      setNovaMaquina({ maquinaId: "", horasTrabalho: "", operador: "" })
    }
  }

  const salvarDiario = () => {
    console.log("Diário salvo:", diarioData)
    alert("Diário de obra salvo com sucesso!")
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
                  <FileText className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Diário de Obras</h1>
                  <p className="text-sm text-gray-600">Registre as atividades diárias da obra</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800 flex items-center gap-2">
                  <HardHat className="h-5 w-5" />
                  Novo Diário de Obra
                </CardTitle>
                <CardDescription className="text-blue-600">
                  Registre todas as atividades, funcionários, materiais e equipamentos do dia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <Label htmlFor="obra">Obra *</Label>
                    <Select
                      value={diarioData.obra}
                      onValueChange={(value) => setDiarioData({ ...diarioData, obra: value })}
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
                    <Label htmlFor="data">Data *</Label>
                    <Input
                      id="data"
                      type="date"
                      value={diarioData.data}
                      onChange={(e) => setDiarioData({ ...diarioData, data: e.target.value })}
                      className="border-blue-200 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="clima">Condições Climáticas</Label>
                    <Select
                      value={diarioData.clima}
                      onValueChange={(value) => setDiarioData({ ...diarioData, clima: value })}
                    >
                      <SelectTrigger className="border-blue-200 focus:border-blue-500">
                        <SelectValue placeholder="Selecione o clima" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ensolarado">☀️ Ensolarado</SelectItem>
                        <SelectItem value="nublado">☁️ Nublado</SelectItem>
                        <SelectItem value="chuvoso">🌧️ Chuvoso</SelectItem>
                        <SelectItem value="parcialmente-nublado">⛅ Parcialmente Nublado</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mb-6">
                  <Label htmlFor="atividades">Atividades Realizadas *</Label>
                  <Textarea
                    id="atividades"
                    value={diarioData.atividades}
                    onChange={(e) => setDiarioData({ ...diarioData, atividades: e.target.value })}
                    placeholder="Descreva detalhadamente as atividades realizadas no dia..."
                    rows={4}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <Tabs defaultValue="funcionarios" className="space-y-6">
                  <TabsList className="bg-blue-50 border border-blue-200">
                    <TabsTrigger
                      value="funcionarios"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Funcionários
                    </TabsTrigger>
                    <TabsTrigger
                      value="materiais"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Materiais
                    </TabsTrigger>
                    <TabsTrigger
                      value="maquinario"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Maquinário
                    </TabsTrigger>
                    <TabsTrigger
                      value="fotos"
                      className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                    >
                      Fotos
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="funcionarios">
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Controle de Funcionários
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                          <Select
                            value={novoFuncionario.funcionarioId}
                            onValueChange={(value) => setNovoFuncionario({ ...novoFuncionario, funcionarioId: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Funcionário" />
                            </SelectTrigger>
                            <SelectContent>
                              {funcionarios.map((func) => (
                                <SelectItem key={func.id} value={func.id.toString()}>
                                  {func.nome} - {func.funcao}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="time"
                            value={novoFuncionario.horaEntrada}
                            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, horaEntrada: e.target.value })}
                            placeholder="Entrada"
                            className="border-blue-200"
                          />
                          <Input
                            type="time"
                            value={novoFuncionario.horaSaida}
                            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, horaSaida: e.target.value })}
                            placeholder="Saída"
                            className="border-blue-200"
                          />
                          <Input
                            value={novoFuncionario.funcao}
                            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, funcao: e.target.value })}
                            placeholder="Função exercida"
                            className="border-blue-200"
                          />
                          <Button onClick={adicionarFuncionario} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {diarioData.funcionarios.map((func) => (
                            <div
                              key={func.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <div>
                                <span className="font-medium text-blue-800">{func.nome}</span>
                                <span className="text-sm text-blue-600 ml-2">({func.funcao})</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-blue-700">
                                <span>Entrada: {func.horaEntrada}</span>
                                {func.horaSaida && <span>Saída: {func.horaSaida}</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="materiais">
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          Materiais Utilizados
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <Input
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                            placeholder="Nome do material"
                            className="border-blue-200"
                          />
                          <Input
                            type="number"
                            value={novoMaterial.quantidade}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: e.target.value })}
                            placeholder="Quantidade"
                            className="border-blue-200"
                          />
                          <Input
                            value={novoMaterial.unidade}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, unidade: e.target.value })}
                            placeholder="Unidade (kg, m³, etc)"
                            className="border-blue-200"
                          />
                          <Button onClick={adicionarMaterial} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {diarioData.materiais.map((material) => (
                            <div
                              key={material.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <span className="font-medium text-blue-800">{material.nome}</span>
                              <span className="text-sm text-blue-700">
                                {material.quantidade} {material.unidade}
                              </span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="maquinario">
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          Maquinário Utilizado
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                          <Select
                            value={novaMaquina.maquinaId}
                            onValueChange={(value) => setNovaMaquina({ ...novaMaquina, maquinaId: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Máquina" />
                            </SelectTrigger>
                            <SelectContent>
                              {maquinas.map((maq) => (
                                <SelectItem key={maq.id} value={maq.id.toString()}>
                                  {maq.nome} - {maq.tipo}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            type="number"
                            value={novaMaquina.horasTrabalho}
                            onChange={(e) => setNovaMaquina({ ...novaMaquina, horasTrabalho: e.target.value })}
                            placeholder="Horas trabalhadas"
                            className="border-blue-200"
                          />
                          <Input
                            value={novaMaquina.operador}
                            onChange={(e) => setNovaMaquina({ ...novaMaquina, operador: e.target.value })}
                            placeholder="Operador"
                            className="border-blue-200"
                          />
                          <Button onClick={adicionarMaquina} className="bg-blue-600 hover:bg-blue-700">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {diarioData.maquinario.map((maq) => (
                            <div
                              key={maq.id}
                              className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                            >
                              <div>
                                <span className="font-medium text-blue-800">{maq.nome}</span>
                                <span className="text-sm text-blue-600 ml-2">({maq.tipo})</span>
                              </div>
                              <div className="flex items-center gap-4 text-sm text-blue-700">
                                <span>{maq.horasTrabalho}h</span>
                                <span>Op: {maq.operador}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="fotos">
                    <Card className="border-blue-100">
                      <CardHeader>
                        <CardTitle className="text-blue-800 flex items-center gap-2">
                          <Camera className="h-5 w-5" />
                          Registro Fotográfico
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center">
                          <Camera className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                          <p className="text-blue-600 mb-2">Clique para adicionar fotos das atividades</p>
                          <Button variant="outline" className="border-blue-300 text-blue-600">
                            Selecionar Fotos
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Textarea
                    id="observacoes"
                    value={diarioData.observacoes}
                    onChange={(e) => setDiarioData({ ...diarioData, observacoes: e.target.value })}
                    placeholder="Observações gerais, problemas encontrados, melhorias sugeridas..."
                    rows={3}
                    className="border-blue-200 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button variant="outline" className="border-blue-300 text-blue-600">
                    <Eye className="h-4 w-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button onClick={salvarDiario} className="bg-blue-600 hover:bg-blue-700">
                    <Save className="h-4 w-4 mr-2" />
                    Salvar Diário
                  </Button>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
