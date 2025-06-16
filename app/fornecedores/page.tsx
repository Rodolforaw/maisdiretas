"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Package, Search, Filter, Phone, Mail, MapPin, Building, Plus, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function FornecedoresPage() {
  const [user, setUser] = useState(null)
  const [fornecedores, setFornecedores] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filtroCategoria, setFiltroCategoria] = useState("todos")
  const [filtroStatus, setFiltroStatus] = useState("todos")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
    carregarFornecedores()
  }, [router])

  const carregarFornecedores = () => {
    setLoading(true)
    try {
      const dadosFornecedores = localStorage.getItem("fornecedores")
      if (dadosFornecedores) {
        setFornecedores(JSON.parse(dadosFornecedores))
      } else {
        const fornecedoresIniciais = [
          {
            id: 1,
            nome: "Construmega Materiais",
            cnpj: "12.345.678/0001-90",
            contato: "Carlos Pereira",
            telefone: "(21) 3333-4444",
            email: "vendas@construmega.com.br",
            endereco: "Av. Industrial, 1000 - Maricá/RJ",
            categoria: "Materiais de Construção",
            status: "Ativo",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            nome: "TecnoFerramentas Ltda",
            cnpj: "98.765.432/0001-10",
            contato: "Ana Costa",
            telefone: "(21) 2222-3333",
            email: "contato@tecnoferramentas.com.br",
            endereco: "Rua das Ferramentas, 500 - Niterói/RJ",
            categoria: "Ferramentas e Equipamentos",
            status: "Ativo",
            createdAt: new Date().toISOString(),
          },
          {
            id: 3,
            nome: "Posto Combustível Central",
            cnpj: "11.222.333/0001-44",
            contato: "Roberto Silva",
            telefone: "(21) 4444-5555",
            email: "vendas@postocentralrj.com.br",
            endereco: "BR-101, Km 15 - Maricá/RJ",
            categoria: "Combustível",
            status: "Ativo",
            createdAt: new Date().toISOString(),
          },
        ]
        setFornecedores(fornecedoresIniciais)
        localStorage.setItem("fornecedores", JSON.stringify(fornecedoresIniciais))
      }
    } catch (error) {
      console.error("Erro ao carregar fornecedores:", error)
    } finally {
      setLoading(false)
    }
  }

  const fornecedoresFiltrados = fornecedores.filter((fornecedor) => {
    const matchSearch =
      fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fornecedor.cnpj.includes(searchTerm) ||
      fornecedor.contato.toLowerCase().includes(searchTerm.toLowerCase())

    const matchCategoria = filtroCategoria === "todos" || fornecedor.categoria === filtroCategoria
    const matchStatus = filtroStatus === "todos" || fornecedor.status === filtroStatus

    return matchSearch && matchCategoria && matchStatus
  })

  const categorias = [...new Set(fornecedores.map((f) => f.categoria))]

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
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
                  <Package className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Fornecedores</h1>
                  <p className="text-sm text-gray-600">Gerencie fornecedores e prestadores de serviços</p>
                </div>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {/* Filtros e Busca */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filtros e Busca
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Buscar fornecedores..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-blue-200"
                    />
                  </div>

                  <Select value={filtroCategoria} onValueChange={setFiltroCategoria}>
                    <SelectTrigger className="border-blue-200">
                      <SelectValue placeholder="Categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todas as Categorias</SelectItem>
                      {categorias.map((categoria) => (
                        <SelectItem key={categoria} value={categoria}>
                          {categoria}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                    <SelectTrigger className="border-blue-200">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os Status</SelectItem>
                      <SelectItem value="Ativo">Ativo</SelectItem>
                      <SelectItem value="Inativo">Inativo</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button onClick={() => router.push("/admin")} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Fornecedor
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-blue-100 text-sm">Total de Fornecedores</p>
                      <p className="text-3xl font-bold">{fornecedores.length}</p>
                    </div>
                    <Building className="h-8 w-8 text-blue-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-100 text-sm">Fornecedores Ativos</p>
                      <p className="text-3xl font-bold">{fornecedores.filter((f) => f.status === "Ativo").length}</p>
                    </div>
                    <Package className="h-8 w-8 text-green-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-100 text-sm">Categorias</p>
                      <p className="text-3xl font-bold">{categorias.length}</p>
                    </div>
                    <Filter className="h-8 w-8 text-purple-200" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white border-0">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-orange-100 text-sm">Resultados</p>
                      <p className="text-3xl font-bold">{fornecedoresFiltrados.length}</p>
                    </div>
                    <Search className="h-8 w-8 text-orange-200" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Lista de Fornecedores */}
            <Card className="shadow-lg border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                <CardTitle>Lista de Fornecedores</CardTitle>
                <CardDescription>{fornecedoresFiltrados.length} fornecedores encontrados</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Contato</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Ações</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fornecedoresFiltrados.map((fornecedor) => (
                        <TableRow key={fornecedor.id} className="hover:bg-blue-50">
                          <TableCell>
                            <div>
                              <div className="font-medium text-gray-900">{fornecedor.nome}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Building className="h-3 w-3" />
                                CNPJ: {fornecedor.cnpj}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <MapPin className="h-3 w-3" />
                                {fornecedor.endereco}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{fornecedor.contato}</div>
                              <div className="text-sm text-gray-500 flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {fornecedor.telefone}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <Mail className="h-3 w-3" />
                                {fornecedor.email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                              {fornecedor.categoria}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={fornecedor.status === "Ativo" ? "default" : "secondary"}
                              className={fornecedor.status === "Ativo" ? "bg-green-100 text-green-800" : ""}
                            >
                              {fornecedor.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="text-blue-600 hover:bg-blue-50">
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
