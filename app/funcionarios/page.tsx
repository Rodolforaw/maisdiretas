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
import { Users, Plus, Search, Edit, Trash2, Phone, Mail, Calendar, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

const funcionarios = [
  {
    id: 1,
    nome: "João Silva",
    funcao: "Encarregado",
    cpf: "123.456.789-00",
    telefone: "(21) 99999-1111",
    email: "joao.silva@somar.com.br",
    dataAdmissao: "2023-01-15",
    status: "Ativo",
    obraAtual: "OS-2024-001",
    salario: 4500,
    endereco: "Rua A, 123 - Centro, Maricá/RJ",
  },
  {
    id: 2,
    nome: "Maria Santos",
    funcao: "Operadora de Máquinas",
    cpf: "987.654.321-00",
    telefone: "(21) 99999-2222",
    email: "maria.santos@somar.com.br",
    dataAdmissao: "2023-03-20",
    status: "Ativo",
    obraAtual: "OS-2024-002",
    salario: 3800,
    endereco: "Rua B, 456 - Inoã, Maricá/RJ",
  },
  {
    id: 3,
    nome: "Carlos Oliveira",
    funcao: "Pedreiro",
    cpf: "456.789.123-00",
    telefone: "(21) 99999-3333",
    email: "carlos.oliveira@somar.com.br",
    dataAdmissao: "2023-02-10",
    status: "Ativo",
    obraAtual: "OS-2024-003",
    salario: 3200,
    endereco: "Rua C, 789 - Itaipuaçu, Maricá/RJ",
  },
  {
    id: 4,
    nome: "Ana Costa",
    funcao: "Auxiliar",
    cpf: "789.123.456-00",
    telefone: "(21) 99999-4444",
    email: "ana.costa@somar.com.br",
    dataAdmissao: "2023-04-05",
    status: "Ativo",
    obraAtual: "OS-2024-004",
    salario: 2800,
    endereco: "Rua D, 321 - Ponta Negra, Maricá/RJ",
  },
  {
    id: 5,
    nome: "Pedro Ferreira",
    funcao: "Soldador",
    cpf: "321.654.987-00",
    telefone: "(21) 99999-5555",
    email: "pedro.ferreira@somar.com.br",
    dataAdmissao: "2023-05-12",
    status: "Férias",
    obraAtual: null,
    salario: 3500,
    endereco: "Rua E, 654 - Guaratiba, Maricá/RJ",
  },
]

export default function FuncionariosPage() {
  const [user, setUser] = useState<any>(null)
  const [busca, setBusca] = useState("")
  const [filtroFuncao, setFiltroFuncao] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [funcionariosFiltrados, setFuncionariosFiltrados] = useState(funcionarios)
  const [novoFuncionario, setNovoFuncionario] = useState({
    nome: "",
    funcao: "",
    cpf: "",
    telefone: "",
    email: "",
    salario: "",
    endereco: "",
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
    let filtered = funcionarios

    if (busca) {
      filtered = filtered.filter(
        (func) =>
          func.nome.toLowerCase().includes(busca.toLowerCase()) ||
          func.funcao.toLowerCase().includes(busca.toLowerCase()) ||
          func.cpf.includes(busca),
      )
    }

    if (filtroFuncao !== "todos") {
      filtered = filtered.filter((func) => func.funcao.toLowerCase() === filtroFuncao)
    }

    if (filtroStatus !== "todos") {
      filtered = filtered.filter((func) => func.status.toLowerCase() === filtroStatus)
    }

    setFuncionariosFiltrados(filtered)
  }, [busca, filtroFuncao, filtroStatus])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ativo":
        return "bg-green-100 text-green-800 border-green-200"
      case "Férias":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Afastado":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Inativo":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const adicionarFuncionario = () => {
    console.log("Novo funcionário:", novoFuncionario)
    alert("Funcionário adicionado com sucesso!")
    setNovoFuncionario({
      nome: "",
      funcao: "",
      cpf: "",
      telefone: "",
      email: "",
      salario: "",
      endereco: "",
    })
  }

  const estatisticas = {
    total: funcionarios.length,
    ativos: funcionarios.filter((f) => f.status === "Ativo").length,
    ferias: funcionarios.filter((f) => f.status === "Férias").length,
    afastados: funcionarios.filter((f) => f.status === "Afastado").length,
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
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Gestão de Funcionários</h1>
                  <p className="text-sm text-gray-600">Controle de equipe e recursos humanos</p>
                </div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Funcionário
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
                    <DialogDescription>Preencha os dados do novo funcionário</DialogDescription>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="nome">Nome Completo *</Label>
                      <Input
                        id="nome"
                        value={novoFuncionario.nome}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                        placeholder="Nome do funcionário"
                        className="border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="funcao">Função *</Label>
                      <Select
                        value={novoFuncionario.funcao}
                        onValueChange={(value) => setNovoFuncionario({ ...novoFuncionario, funcao: value })}
                      >
                        <SelectTrigger className="border-blue-200">
                          <SelectValue placeholder="Selecione a função" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="encarregado">Encarregado</SelectItem>
                          <SelectItem value="pedreiro">Pedreiro</SelectItem>
                          <SelectItem value="auxiliar">Auxiliar</SelectItem>
                          <SelectItem value="operador">Operador de Máquinas</SelectItem>
                          <SelectItem value="soldador">Soldador</SelectItem>
                          <SelectItem value="eletricista">Eletricista</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cpf">CPF *</Label>
                      <Input
                        id="cpf"
                        value={novoFuncionario.cpf}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, cpf: e.target.value })}
                        placeholder="000.000.000-00"
                        className="border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="telefone">Telefone *</Label>
                      <Input
                        id="telefone"
                        value={novoFuncionario.telefone}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, telefone: e.target.value })}
                        placeholder="(21) 99999-9999"
                        className="border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={novoFuncionario.email}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, email: e.target.value })}
                        placeholder="funcionario@somar.com.br"
                        className="border-blue-200"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salario">Salário (R$)</Label>
                      <Input
                        id="salario"
                        type="number"
                        value={novoFuncionario.salario}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, salario: e.target.value })}
                        placeholder="0,00"
                        className="border-blue-200"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="endereco">Endereço</Label>
                      <Input
                        id="endereco"
                        value={novoFuncionario.endereco}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, endereco: e.target.value })}
                        placeholder="Endereço completo"
                        className="border-blue-200"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-4 mt-6">
                    <Button variant="outline" className="border-blue-200">
                      Cancelar
                    </Button>
                    <Button onClick={adicionarFuncionario} className="bg-blue-600 hover:bg-blue-700">
                      Adicionar Funcionário
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
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
                  <div className="text-2xl font-bold">{estatisticas.ativos}</div>
                  <div className="text-sm opacity-90">Ativos</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-blue-600 to-blue-700 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.ferias}</div>
                  <div className="text-sm opacity-90">Em Férias</div>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white border-0">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold">{estatisticas.afastados}</div>
                  <div className="text-sm opacity-90">Afastados</div>
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
                      placeholder="Buscar funcionários..."
                      value={busca}
                      onChange={(e) => setBusca(e.target.value)}
                      className="pl-10 border-blue-200 focus:border-blue-500"
                    />
                  </div>
                  <Select value={filtroFuncao} onValueChange={setFiltroFuncao}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Função" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as Funções</SelectItem>
                      <SelectItem value="encarregado">Encarregado</SelectItem>
                      <SelectItem value="pedreiro">Pedreiro</SelectItem>
                      <SelectItem value="auxiliar">Auxiliar</SelectItem>
                      <SelectItem value="operadora de máquinas">Operador de Máquinas</SelectItem>
                      <SelectItem value="soldador">Soldador</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="border-blue-200 focus:border-blue-500">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="ativo">Ativo</SelectItem>
                      <SelectItem value="férias">Férias</SelectItem>
                      <SelectItem value="afastado">Afastado</SelectItem>
                      <SelectItem value="inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setBusca("")
                      setFiltroFuncao("todos")
                      setFiltroStatus("todos")
                    }}
                    className="border-blue-200 text-blue-600"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Funcionários */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="text-blue-800">
                  Funcionários ({funcionariosFiltrados.length} de {funcionarios.length})
                </CardTitle>
                <CardDescription className="text-blue-600">Lista completa de todos os funcionários</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {funcionariosFiltrados.map((funcionario) => (
                    <Card key={funcionario.id} className="border-blue-100 hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 flex-wrap">
                              <h3 className="font-semibold text-lg text-gray-800">{funcionario.nome}</h3>
                              <Badge variant="outline" className="border-blue-200 text-blue-700">
                                {funcionario.funcao}
                              </Badge>
                              <Badge className={getStatusColor(funcionario.status)}>{funcionario.status}</Badge>
                              {funcionario.obraAtual && (
                                <Badge className="bg-green-100 text-green-800">{funcionario.obraAtual}</Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                <span>{funcionario.telefone}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-blue-500" />
                                <span>{funcionario.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-blue-500" />
                                <span>Desde {funcionario.dataAdmissao}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-blue-500" />
                                <span>CPF: {funcionario.cpf}</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Endereço: </span>
                                <span className="text-gray-800">{funcionario.endereco}</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Salário: </span>
                                <span className="font-semibold text-gray-800">
                                  R$ {funcionario.salario.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 lg:w-32">
                            <Button variant="outline" size="sm" className="w-full border-blue-200 text-blue-600">
                              <Edit className="h-4 w-4 mr-2" />
                              Editar
                            </Button>
                            <Button variant="outline" size="sm" className="w-full border-red-200 text-red-600">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remover
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {funcionariosFiltrados.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Nenhum funcionário encontrado</h3>
                    <p className="text-gray-500">Tente ajustar os filtros ou adicionar um novo funcionário.</p>
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
