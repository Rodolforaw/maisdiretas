"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Truck,
  Package,
  Wrench,
  Edit,
  Trash2,
  Shield,
  MessageSquare,
  UserPlus,
  Eye,
  EyeOff,
  Save,
  RefreshCw,
  Search,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"

export default function AdminPage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("usuarios")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [editingItem, setEditingItem] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Estados para dados
  const [usuarios, setUsuarios] = useState([])
  const [materiais, setMateriais] = useState([])
  const [equipamentos, setEquipamentos] = useState([])
  const [veiculos, setVeiculos] = useState([])
  const [fornecedores, setFornecedores] = useState([])

  // Estados para formulários
  const [novoUsuario, setNovoUsuario] = useState({
    username: "",
    password: "",
    name: "",
    email: "",
    cargo: "",
    status: "active",
  })

  const [novoMaterial, setNovoMaterial] = useState({
    nome: "",
    categoria: "",
    unidade: "",
    estoque: 0,
    estoqueMinimo: 0,
    valorUnitario: 0,
    fornecedor: "",
    localizacao: "",
  })

  const [novoEquipamento, setNovoEquipamento] = useState({
    nome: "",
    tipo: "",
    modelo: "",
    numeroSerie: "",
    status: "Disponível",
    localizacao: "",
    dataAquisicao: "",
    valorAquisicao: 0,
    responsavel: "",
  })

  const [novoVeiculo, setNovoVeiculo] = useState({
    nome: "",
    tipo: "Caminhão",
    modelo: "",
    placa: "",
    ano: "",
    status: "Disponível",
    localizacao: "",
    responsavel: "",
    combustivel: "Diesel",
  })

  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    cnpj: "",
    contato: "",
    telefone: "",
    email: "",
    endereco: "",
    categoria: "",
    status: "Ativo",
  })

  // Configurações de permissões
  const permissoesPorCargo = {
    admin: {
      label: "Administrador",
      permissions: ["read", "write", "delete", "manage", "users", "reports", "system"],
      color: "bg-red-100 text-red-800",
    },
    master: {
      label: "Master",
      permissions: ["read", "write", "delete", "manage", "users", "reports", "system", "admin"],
      color: "bg-purple-100 text-purple-800",
    },
    gerente: {
      label: "Gerente",
      permissions: ["read", "write", "manage", "reports"],
      color: "bg-blue-100 text-blue-800",
    },
    supervisor: {
      label: "Supervisor",
      permissions: ["read", "write", "manage"],
      color: "bg-green-100 text-green-800",
    },
    encarregado: {
      label: "Encarregado",
      permissions: ["read", "write"],
      color: "bg-yellow-100 text-yellow-800",
    },
    funcionario: {
      label: "Funcionário",
      permissions: ["read"],
      color: "bg-gray-100 text-gray-800",
    },
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }

    const parsedUser = JSON.parse(userData)
    if (!parsedUser.permissions?.includes("admin") && !parsedUser.permissions?.includes("system")) {
      router.push("/dashboard")
      return
    }

    setUser(parsedUser)
    carregarDados()
  }, [router])

  const carregarDados = async () => {
    setLoading(true)
    try {
      // Carregar dados do localStorage ou criar dados iniciais
      const dadosUsuarios = localStorage.getItem("usuarios")
      const dadosMateriais = localStorage.getItem("materiais")
      const dadosEquipamentos = localStorage.getItem("equipamentos")
      const dadosVeiculos = localStorage.getItem("veiculos")
      const dadosFornecedores = localStorage.getItem("fornecedores")

      if (dadosUsuarios) {
        setUsuarios(JSON.parse(dadosUsuarios))
      } else {
        const usuariosIniciais = [
          {
            id: 1,
            username: "admin",
            password: "admin123",
            name: "Administrador",
            email: "admin@somar.com.br",
            cargo: "admin",
            status: "active",
            createdAt: new Date().toISOString(),
          },
          {
            id: 2,
            username: "gerente01",
            password: "gerente123",
            name: "João Silva",
            email: "joao.silva@somar.com.br",
            cargo: "gerente",
            status: "active",
            createdAt: new Date().toISOString(),
          },
        ]
        setUsuarios(usuariosIniciais)
        localStorage.setItem("usuarios", JSON.stringify(usuariosIniciais))
      }

      if (dadosMateriais) {
        setMateriais(JSON.parse(dadosMateriais))
      } else {
        const materiaisIniciais = [
          {
            id: 1,
            nome: "Cimento Portland CP-II",
            categoria: "Cimento",
            unidade: "Saco 50kg",
            estoque: 150,
            estoqueMinimo: 50,
            valorUnitario: 28.5,
            fornecedor: "Construmega",
            localizacao: "Galpão A",
            createdAt: new Date().toISOString(),
          },
        ]
        setMateriais(materiaisIniciais)
        localStorage.setItem("materiais", JSON.stringify(materiaisIniciais))
      }

      if (dadosEquipamentos) {
        setEquipamentos(JSON.parse(dadosEquipamentos))
      } else {
        const equipamentosIniciais = [
          {
            id: 1,
            nome: "Retroescavadeira CAT 416F",
            tipo: "Máquina Pesada",
            modelo: "416F",
            numeroSerie: "CAT001234",
            status: "Disponível",
            localizacao: "Almoxarifado Central",
            responsavel: "João Silva",
            createdAt: new Date().toISOString(),
          },
        ]
        setEquipamentos(equipamentosIniciais)
        localStorage.setItem("equipamentos", JSON.stringify(equipamentosIniciais))
      }

      if (dadosVeiculos) {
        setVeiculos(JSON.parse(dadosVeiculos))
      } else {
        const veiculosIniciais = [
          {
            id: 1,
            nome: "Caminhão Basculante",
            tipo: "Caminhão",
            modelo: "Mercedes 2831",
            placa: "ABC-1234",
            ano: "2023",
            status: "Disponível",
            combustivel: "Diesel",
            createdAt: new Date().toISOString(),
          },
        ]
        setVeiculos(veiculosIniciais)
        localStorage.setItem("veiculos", JSON.stringify(veiculosIniciais))
      }

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
        ]
        setFornecedores(fornecedoresIniciais)
        localStorage.setItem("fornecedores", JSON.stringify(fornecedoresIniciais))
      }

      setMessage({ type: "success", text: "Dados carregados com sucesso!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao carregar dados" })
    } finally {
      setLoading(false)
    }
  }

  const salvarUsuario = async () => {
    if (
      !novoUsuario.username ||
      !novoUsuario.password ||
      !novoUsuario.name ||
      !novoUsuario.email ||
      !novoUsuario.cargo
    ) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)
    try {
      const usuario = {
        ...novoUsuario,
        id: editingItem ? editingItem.id : Date.now(),
        permissions: permissoesPorCargo[novoUsuario.cargo]?.permissions || [],
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let novosUsuarios
      if (editingItem) {
        novosUsuarios = usuarios.map((u) => (u.id === editingItem.id ? usuario : u))
      } else {
        novosUsuarios = [...usuarios, usuario]
      }

      setUsuarios(novosUsuarios)
      localStorage.setItem("usuarios", JSON.stringify(novosUsuarios))

      setNovoUsuario({
        username: "",
        password: "",
        name: "",
        email: "",
        cargo: "",
        status: "active",
      })
      setEditingItem(null)
      setMessage({ type: "success", text: editingItem ? "Usuário atualizado!" : "Usuário cadastrado!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar usuário" })
    } finally {
      setLoading(false)
    }
  }

  const salvarMaterial = async () => {
    if (!novoMaterial.nome || !novoMaterial.categoria) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)
    try {
      const material = {
        ...novoMaterial,
        id: editingItem ? editingItem.id : Date.now(),
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let novosMateriais
      if (editingItem) {
        novosMateriais = materiais.map((m) => (m.id === editingItem.id ? material : m))
      } else {
        novosMateriais = [...materiais, material]
      }

      setMateriais(novosMateriais)
      localStorage.setItem("materiais", JSON.stringify(novosMateriais))

      setNovoMaterial({
        nome: "",
        categoria: "",
        unidade: "",
        estoque: 0,
        estoqueMinimo: 0,
        valorUnitario: 0,
        fornecedor: "",
        localizacao: "",
      })
      setEditingItem(null)
      setMessage({ type: "success", text: editingItem ? "Material atualizado!" : "Material cadastrado!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar material" })
    } finally {
      setLoading(false)
    }
  }

  const salvarEquipamento = async () => {
    if (!novoEquipamento.nome || !novoEquipamento.tipo) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)
    try {
      const equipamento = {
        ...novoEquipamento,
        id: editingItem ? editingItem.id : Date.now(),
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let novosEquipamentos
      if (editingItem) {
        novosEquipamentos = equipamentos.map((e) => (e.id === editingItem.id ? equipamento : e))
      } else {
        novosEquipamentos = [...equipamentos, equipamento]
      }

      setEquipamentos(novosEquipamentos)
      localStorage.setItem("equipamentos", JSON.stringify(novosEquipamentos))

      setNovoEquipamento({
        nome: "",
        tipo: "",
        modelo: "",
        numeroSerie: "",
        status: "Disponível",
        localizacao: "",
        dataAquisicao: "",
        valorAquisicao: 0,
        responsavel: "",
      })
      setEditingItem(null)
      setMessage({ type: "success", text: editingItem ? "Equipamento atualizado!" : "Equipamento cadastrado!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar equipamento" })
    } finally {
      setLoading(false)
    }
  }

  const salvarVeiculo = async () => {
    if (!novoVeiculo.nome || !novoVeiculo.placa) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)
    try {
      const veiculo = {
        ...novoVeiculo,
        id: editingItem ? editingItem.id : Date.now(),
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let novosVeiculos
      if (editingItem) {
        novosVeiculos = veiculos.map((v) => (v.id === editingItem.id ? veiculo : v))
      } else {
        novosVeiculos = [...veiculos, veiculo]
      }

      setVeiculos(novosVeiculos)
      localStorage.setItem("veiculos", JSON.stringify(novosVeiculos))

      setNovoVeiculo({
        nome: "",
        tipo: "Caminhão",
        modelo: "",
        placa: "",
        ano: "",
        status: "Disponível",
        localizacao: "",
        responsavel: "",
        combustivel: "Diesel",
      })
      setEditingItem(null)
      setMessage({ type: "success", text: editingItem ? "Veículo atualizado!" : "Veículo cadastrado!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar veículo" })
    } finally {
      setLoading(false)
    }
  }

  const salvarFornecedor = async () => {
    if (!novoFornecedor.nome || !novoFornecedor.cnpj) {
      setMessage({ type: "error", text: "Preencha todos os campos obrigatórios" })
      return
    }

    setLoading(true)
    try {
      const fornecedor = {
        ...novoFornecedor,
        id: editingItem ? editingItem.id : Date.now(),
        createdAt: editingItem ? editingItem.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      let novosFornecedores
      if (editingItem) {
        novosFornecedores = fornecedores.map((f) => (f.id === editingItem.id ? fornecedor : f))
      } else {
        novosFornecedores = [...fornecedores, fornecedor]
      }

      setFornecedores(novosFornecedores)
      localStorage.setItem("fornecedores", JSON.stringify(novosFornecedores))

      setNovoFornecedor({
        nome: "",
        cnpj: "",
        contato: "",
        telefone: "",
        email: "",
        endereco: "",
        categoria: "",
        status: "Ativo",
      })
      setEditingItem(null)
      setMessage({ type: "success", text: editingItem ? "Fornecedor atualizado!" : "Fornecedor cadastrado!" })
    } catch (error) {
      setMessage({ type: "error", text: "Erro ao salvar fornecedor" })
    } finally {
      setLoading(false)
    }
  }

  const editarItem = (item, tipo) => {
    setEditingItem(item)
    switch (tipo) {
      case "usuario":
        setNovoUsuario(item)
        break
      case "material":
        setNovoMaterial(item)
        break
      case "equipamento":
        setNovoEquipamento(item)
        break
      case "veiculo":
        setNovoVeiculo(item)
        break
      case "fornecedor":
        setNovoFornecedor(item)
        break
    }
  }

  const excluirItem = (id, tipo) => {
    if (!confirm("Tem certeza que deseja excluir este item?")) return

    switch (tipo) {
      case "usuario":
        const novosUsuarios = usuarios.filter((u) => u.id !== id)
        setUsuarios(novosUsuarios)
        localStorage.setItem("usuarios", JSON.stringify(novosUsuarios))
        break
      case "material":
        const novosMateriais = materiais.filter((m) => m.id !== id)
        setMateriais(novosMateriais)
        localStorage.setItem("materiais", JSON.stringify(novosMateriais))
        break
      case "equipamento":
        const novosEquipamentos = equipamentos.filter((e) => e.id !== id)
        setEquipamentos(novosEquipamentos)
        localStorage.setItem("equipamentos", JSON.stringify(novosEquipamentos))
        break
      case "veiculo":
        const novosVeiculos = veiculos.filter((v) => v.id !== id)
        setVeiculos(novosVeiculos)
        localStorage.setItem("veiculos", JSON.stringify(novosVeiculos))
        break
      case "fornecedor":
        const novosFornecedores = fornecedores.filter((f) => f.id !== id)
        setFornecedores(novosFornecedores)
        localStorage.setItem("fornecedores", JSON.stringify(novosFornecedores))
        break
    }
    setMessage({ type: "success", text: "Item excluído com sucesso!" })
  }

  const cancelarEdicao = () => {
    setEditingItem(null)
    setNovoUsuario({
      username: "",
      password: "",
      name: "",
      email: "",
      cargo: "",
      status: "active",
    })
    setNovoMaterial({
      nome: "",
      categoria: "",
      unidade: "",
      estoque: 0,
      estoqueMinimo: 0,
      valorUnitario: 0,
      fornecedor: "",
      localizacao: "",
    })
    setNovoEquipamento({
      nome: "",
      tipo: "",
      modelo: "",
      numeroSerie: "",
      status: "Disponível",
      localizacao: "",
      dataAquisicao: "",
      valorAquisicao: 0,
      responsavel: "",
    })
    setNovoVeiculo({
      nome: "",
      tipo: "Caminhão",
      modelo: "",
      placa: "",
      ano: "",
      status: "Disponível",
      localizacao: "",
      responsavel: "",
      combustivel: "Diesel",
    })
    setNovoFornecedor({
      nome: "",
      cnpj: "",
      contato: "",
      telefone: "",
      email: "",
      endereco: "",
      categoria: "",
      status: "Ativo",
    })
  }

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
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">Painel Administrativo</h1>
                  <p className="text-sm text-gray-600">Gerencie usuários, materiais, equipamentos e permissões</p>
                </div>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrador
                </Badge>
                <Button onClick={carregarDados} variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Atualizar
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6 space-y-6">
            {message.text && (
              <Alert className={message.type === "error" ? "border-red-200 bg-red-50" : "border-green-200 bg-green-50"}>
                <AlertDescription className={message.type === "error" ? "text-red-700" : "text-green-700"}>
                  {message.type === "error" ? (
                    <AlertCircle className="h-4 w-4 inline mr-2" />
                  ) : (
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                  )}
                  {message.text}
                </AlertDescription>
              </Alert>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-6 bg-white border border-blue-100">
                <TabsTrigger
                  value="usuarios"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Users className="h-4 w-4" />
                  Usuários
                </TabsTrigger>
                <TabsTrigger
                  value="materiais"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Package className="h-4 w-4" />
                  Materiais
                </TabsTrigger>
                <TabsTrigger
                  value="equipamentos"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Wrench className="h-4 w-4" />
                  Equipamentos
                </TabsTrigger>
                <TabsTrigger
                  value="veiculos"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Truck className="h-4 w-4" />
                  Veículos
                </TabsTrigger>
                <TabsTrigger
                  value="fornecedores"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <Package className="h-4 w-4" />
                  Fornecedores
                </TabsTrigger>
                <TabsTrigger
                  value="mensagens"
                  className="flex items-center gap-2 data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
                >
                  <MessageSquare className="h-4 w-4" />
                  Mensagens
                </TabsTrigger>
              </TabsList>

              {/* Tab Usuários */}
              <TabsContent value="usuarios" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2">
                          <UserPlus className="h-5 w-5" />
                          {editingItem ? "Editar Usuário" : "Cadastrar Usuário"}
                        </CardTitle>
                        <CardDescription>
                          {editingItem
                            ? "Atualize os dados do usuário"
                            : "Crie novos usuários e defina suas permissões"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="username">Usuário *</Label>
                          <Input
                            id="username"
                            value={novoUsuario.username}
                            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, username: e.target.value }))}
                            placeholder="usuario123"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="password">Senha *</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              value={novoUsuario.password}
                              onChange={(e) => setNovoUsuario((prev) => ({ ...prev, password: e.target.value }))}
                              placeholder="••••••••"
                              className="border-blue-200"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="name">Nome Completo *</Label>
                          <Input
                            id="name"
                            value={novoUsuario.name}
                            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="João Silva"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="email">E-mail *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={novoUsuario.email}
                            onChange={(e) => setNovoUsuario((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="joao@somar.com.br"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cargo">Cargo *</Label>
                          <Select
                            value={novoUsuario.cargo}
                            onValueChange={(value) => setNovoUsuario((prev) => ({ ...prev, cargo: value }))}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione o cargo" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(permissoesPorCargo).map(([key, config]) => (
                                <SelectItem key={key} value={key}>
                                  <div className="flex items-center gap-2">
                                    <Badge className={config.color}>{config.label}</Badge>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        {novoUsuario.cargo && (
                          <div>
                            <Label>Permissões do Cargo</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {permissoesPorCargo[novoUsuario.cargo]?.permissions.map((perm) => (
                                <Badge key={perm} variant="outline" className="text-xs">
                                  {perm}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="status"
                            checked={novoUsuario.status === "active"}
                            onCheckedChange={(checked) =>
                              setNovoUsuario((prev) => ({ ...prev, status: checked ? "active" : "inactive" }))
                            }
                          />
                          <Label htmlFor="status">Usuário Ativo</Label>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={salvarUsuario}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Salvando..." : editingItem ? "Atualizar" : "Cadastrar"}
                          </Button>
                          {editingItem && (
                            <Button onClick={cancelarEdicao} variant="outline" className="flex-1">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Usuários Cadastrados</CardTitle>
                            <CardDescription>{usuarios.length} usuários no sistema</CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="relative">
                              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                              <Input
                                placeholder="Buscar usuários..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                              />
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {usuarios
                            .filter(
                              (usuario) =>
                                usuario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                usuario.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                usuario.email.toLowerCase().includes(searchTerm.toLowerCase()),
                            )
                            .map((usuario) => (
                              <div
                                key={usuario.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{usuario.name}</div>
                                  <div className="text-sm text-gray-500">
                                    @{usuario.username} • {usuario.email}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      className={
                                        permissoesPorCargo[usuario.cargo]?.color || "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {permissoesPorCargo[usuario.cargo]?.label || usuario.cargo}
                                    </Badge>
                                    <Badge variant={usuario.status === "active" ? "default" : "secondary"}>
                                      {usuario.status === "active" ? "Ativo" : "Inativo"}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarItem(usuario, "usuario")}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => excluirItem(usuario.id, "usuario")}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Materiais */}
              <TabsContent value="materiais" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {editingItem ? "Editar Material" : "Cadastrar Material"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="material-nome">Nome do Material *</Label>
                          <Input
                            id="material-nome"
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial((prev) => ({ ...prev, nome: e.target.value }))}
                            placeholder="Cimento Portland"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="categoria">Categoria *</Label>
                          <Select
                            value={novoMaterial.categoria}
                            onChange={(value) => setNovoMaterial((prev) => ({ ...prev, categoria: value }))}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Cimento">Cimento</SelectItem>
                              <SelectItem value="Agregado">Agregado</SelectItem>
                              <SelectItem value="Ferro">Ferro</SelectItem>
                              <SelectItem value="Madeira">Madeira</SelectItem>
                              <SelectItem value="Elétrico">Elétrico</SelectItem>
                              <SelectItem value="Hidráulico">Hidráulico</SelectItem>
                              <SelectItem value="Tintas">Tintas</SelectItem>
                              <SelectItem value="Ferramentas">Ferramentas</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="unidade">Unidade</Label>
                          <Input
                            id="unidade"
                            value={novoMaterial.unidade}
                            onChange={(e) => setNovoMaterial((prev) => ({ ...prev, unidade: e.target.value }))}
                            placeholder="kg, m³, unidade"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="estoque">Estoque</Label>
                            <Input
                              id="estoque"
                              type="number"
                              value={novoMaterial.estoque}
                              onChange={(e) =>
                                setNovoMaterial((prev) => ({ ...prev, estoque: Number(e.target.value) }))
                              }
                              className="border-blue-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="estoque-min">Estoque Mín.</Label>
                            <Input
                              id="estoque-min"
                              type="number"
                              value={novoMaterial.estoqueMinimo}
                              onChange={(e) =>
                                setNovoMaterial((prev) => ({ ...prev, estoqueMinimo: Number(e.target.value) }))
                              }
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="valor">Valor Unitário (R$)</Label>
                          <Input
                            id="valor"
                            type="number"
                            step="0.01"
                            value={novoMaterial.valorUnitario}
                            onChange={(e) =>
                              setNovoMaterial((prev) => ({ ...prev, valorUnitario: Number(e.target.value) }))
                            }
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="fornecedor">Fornecedor</Label>
                          <Input
                            id="fornecedor"
                            value={novoMaterial.fornecedor}
                            onChange={(e) => setNovoMaterial((prev) => ({ ...prev, fornecedor: e.target.value }))}
                            placeholder="Nome do fornecedor"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="localizacao">Localização</Label>
                          <Input
                            id="localizacao"
                            value={novoMaterial.localizacao}
                            onChange={(e) => setNovoMaterial((prev) => ({ ...prev, localizacao: e.target.value }))}
                            placeholder="Galpão A - Setor 1"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={salvarMaterial}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Salvando..." : editingItem ? "Atualizar" : "Cadastrar"}
                          </Button>
                          {editingItem && (
                            <Button onClick={cancelarEdicao} variant="outline" className="flex-1">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Materiais Cadastrados</CardTitle>
                            <CardDescription>{materiais.length} materiais no sistema</CardDescription>
                          </div>
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              placeholder="Buscar materiais..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Material</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead>Estoque</TableHead>
                              <TableHead>Valor Unit.</TableHead>
                              <TableHead>Ações</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {materiais
                              .filter(
                                (material) =>
                                  material.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  material.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
                              )
                              .map((material) => (
                                <TableRow key={material.id}>
                                  <TableCell>
                                    <div>
                                      <div className="font-medium">{material.nome}</div>
                                      <div className="text-sm text-gray-500">{material.fornecedor}</div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{material.categoria}</TableCell>
                                  <TableCell>
                                    <Badge
                                      variant={material.estoque <= material.estoqueMinimo ? "destructive" : "default"}
                                    >
                                      {material.estoque} {material.unidade}
                                    </Badge>
                                  </TableCell>
                                  <TableCell>R$ {material.valorUnitario.toFixed(2)}</TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => editarItem(material, "material")}
                                        className="text-blue-600 hover:bg-blue-50"
                                      >
                                        <Edit className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => excluirItem(material.id, "material")}
                                        className="text-red-600 hover:bg-red-50"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Equipamentos */}
              <TabsContent value="equipamentos" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2">
                          <Wrench className="h-5 w-5" />
                          {editingItem ? "Editar Equipamento" : "Cadastrar Equipamento"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="equip-nome">Nome do Equipamento *</Label>
                          <Input
                            id="equip-nome"
                            value={novoEquipamento.nome}
                            onChange={(e) => setNovoEquipamento((prev) => ({ ...prev, nome: e.target.value }))}
                            placeholder="Retroescavadeira CAT 416F"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="equip-tipo">Tipo *</Label>
                          <Select
                            value={novoEquipamento.tipo}
                            onChange={(value) => setNovoEquipamento((prev) => ({ ...prev, tipo: value }))}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Máquina Pesada">Máquina Pesada</SelectItem>
                              <SelectItem value="Ferramenta Elétrica">Ferramenta Elétrica</SelectItem>
                              <SelectItem value="Ferramenta Manual">Ferramenta Manual</SelectItem>
                              <SelectItem value="Equipamento de Segurança">Equipamento de Segurança</SelectItem>
                              <SelectItem value="Equipamento de Medição">Equipamento de Medição</SelectItem>
                              <SelectItem value="Compressor">Compressor</SelectItem>
                              <SelectItem value="Gerador">Gerador</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="equip-modelo">Modelo</Label>
                            <Input
                              id="equip-modelo"
                              value={novoEquipamento.modelo}
                              onChange={(e) => setNovoEquipamento((prev) => ({ ...prev, modelo: e.target.value }))}
                              placeholder="416F"
                              className="border-blue-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="numero-serie">Número de Série</Label>
                            <Input
                              id="numero-serie"
                              value={novoEquipamento.numeroSerie}
                              onChange={(e) => setNovoEquipamento((prev) => ({ ...prev, numeroSerie: e.target.value }))}
                              placeholder="CAT001234"
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="equip-status">Status</Label>
                          <Select
                            value={novoEquipamento.status}
                            onChange={(value) => setNovoEquipamento((prev) => ({ ...prev, status: value }))}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Disponível">Disponível</SelectItem>
                              <SelectItem value="Em Uso">Em Uso</SelectItem>
                              <SelectItem value="Manutenção">Manutenção</SelectItem>
                              <SelectItem value="Inativo">Inativo</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="equip-localizacao">Localização</Label>
                          <Input
                            id="equip-localizacao"
                            value={novoEquipamento.localizacao}
                            onChange={(e) => setNovoEquipamento((prev) => ({ ...prev, localizacao: e.target.value }))}
                            placeholder="Almoxarifado Central"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="data-aquisicao">Data de Aquisição</Label>
                            <Input
                              id="data-aquisicao"
                              type="date"
                              value={novoEquipamento.dataAquisicao}
                              onChange={(e) =>
                                setNovoEquipamento((prev) => ({ ...prev, dataAquisicao: e.target.value }))
                              }
                              className="border-blue-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="valor-aquisicao">Valor de Aquisição (R$)</Label>
                            <Input
                              id="valor-aquisicao"
                              type="number"
                              step="0.01"
                              value={novoEquipamento.valorAquisicao}
                              onChange={(e) =>
                                setNovoEquipamento((prev) => ({ ...prev, valorAquisicao: Number(e.target.value) }))
                              }
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="equip-responsavel">Responsável</Label>
                          <Input
                            id="equip-responsavel"
                            value={novoEquipamento.responsavel}
                            onChange={(e) => setNovoEquipamento((prev) => ({ ...prev, responsavel: e.target.value }))}
                            placeholder="Nome do responsável"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={salvarEquipamento}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Salvando..." : editingItem ? "Atualizar" : "Cadastrar"}
                          </Button>
                          {editingItem && (
                            <Button onClick={cancelarEdicao} variant="outline" className="flex-1">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Equipamentos Cadastrados</CardTitle>
                            <CardDescription>{equipamentos.length} equipamentos no sistema</CardDescription>
                          </div>
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              placeholder="Buscar equipamentos..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {equipamentos
                            .filter(
                              (equipamento) =>
                                equipamento.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                equipamento.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                equipamento.modelo.toLowerCase().includes(searchTerm.toLowerCase()),
                            )
                            .map((equipamento) => (
                              <div
                                key={equipamento.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{equipamento.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    {equipamento.tipo} - {equipamento.modelo}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    Série: {equipamento.numeroSerie} • {equipamento.localizacao}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={
                                        equipamento.status === "Disponível"
                                          ? "default"
                                          : equipamento.status === "Em Uso"
                                            ? "secondary"
                                            : equipamento.status === "Manutenção"
                                              ? "destructive"
                                              : "outline"
                                      }
                                    >
                                      {equipamento.status}
                                    </Badge>
                                    {equipamento.responsavel && (
                                      <Badge variant="outline">Resp: {equipamento.responsavel}</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarItem(equipamento, "equipamento")}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => excluirItem(equipamento.id, "equipamento")}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Veículos */}
              <TabsContent value="veiculos" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2">
                          <Truck className="h-5 w-5" />
                          {editingItem ? "Editar Veículo" : "Cadastrar Veículo"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="veiculo-nome">Nome/Descrição *</Label>
                          <Input
                            id="veiculo-nome"
                            value={novoVeiculo.nome}
                            onChange={(e) => setNovoVeiculo((prev) => ({ ...prev, nome: e.target.value }))}
                            placeholder="Caminhão Basculante"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="veiculo-tipo">Tipo</Label>
                            <Select
                              value={novoVeiculo.tipo}
                              onChange={(value) => setNovoVeiculo((prev) => ({ ...prev, tipo: value }))}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Caminhão">Caminhão</SelectItem>
                                <SelectItem value="Van">Van</SelectItem>
                                <SelectItem value="Pickup">Pickup</SelectItem>
                                <SelectItem value="Ônibus">Ônibus</SelectItem>
                                <SelectItem value="Motocicleta">Motocicleta</SelectItem>
                                <SelectItem value="Trator">Trator</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="veiculo-modelo">Modelo</Label>
                            <Input
                              id="veiculo-modelo"
                              value={novoVeiculo.modelo}
                              onChange={(e) => setNovoVeiculo((prev) => ({ ...prev, modelo: e.target.value }))}
                              placeholder="Mercedes 2831"
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="placa">Placa *</Label>
                            <Input
                              id="placa"
                              value={novoVeiculo.placa}
                              onChange={(e) =>
                                setNovoVeiculo((prev) => ({ ...prev, placa: e.target.value.toUpperCase() }))
                              }
                              placeholder="ABC-1234"
                              className="border-blue-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="ano">Ano</Label>
                            <Input
                              id="ano"
                              value={novoVeiculo.ano}
                              onChange={(e) => setNovoVeiculo((prev) => ({ ...prev, ano: e.target.value }))}
                              placeholder="2023"
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="veiculo-status">Status</Label>
                            <Select
                              value={novoVeiculo.status}
                              onChange={(value) => setNovoVeiculo((prev) => ({ ...prev, status: value }))}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Disponível">Disponível</SelectItem>
                                <SelectItem value="Em Uso">Em Uso</SelectItem>
                                <SelectItem value="Manutenção">Manutenção</SelectItem>
                                <SelectItem value="Inativo">Inativo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="combustivel">Combustível</Label>
                            <Select
                              value={novoVeiculo.combustivel}
                              onChange={(value) => setNovoVeiculo((prev) => ({ ...prev, combustivel: value }))}
                            >
                              <SelectTrigger className="border-blue-200">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Diesel">Diesel</SelectItem>
                                <SelectItem value="Gasolina">Gasolina</SelectItem>
                                <SelectItem value="Etanol">Etanol</SelectItem>
                                <SelectItem value="Flex">Flex</SelectItem>
                                <SelectItem value="Elétrico">Elétrico</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="veiculo-localizacao">Localização</Label>
                          <Input
                            id="veiculo-localizacao"
                            value={novoVeiculo.localizacao}
                            onChange={(e) => setNovoVeiculo((prev) => ({ ...prev, localizacao: e.target.value }))}
                            placeholder="Garagem Central"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="veiculo-responsavel">Responsável</Label>
                          <Input
                            id="veiculo-responsavel"
                            value={novoVeiculo.responsavel}
                            onChange={(e) => setNovoVeiculo((prev) => ({ ...prev, responsavel: e.target.value }))}
                            placeholder="Nome do responsável"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={salvarVeiculo}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Salvando..." : editingItem ? "Atualizar" : "Cadastrar"}
                          </Button>
                          {editingItem && (
                            <Button onClick={cancelarEdicao} variant="outline" className="flex-1">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Veículos Cadastrados</CardTitle>
                            <CardDescription>{veiculos.length} veículos no sistema</CardDescription>
                          </div>
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              placeholder="Buscar veículos..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {veiculos
                            .filter(
                              (veiculo) =>
                                veiculo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                veiculo.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                veiculo.modelo.toLowerCase().includes(searchTerm.toLowerCase()),
                            )
                            .map((veiculo) => (
                              <div
                                key={veiculo.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{veiculo.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    {veiculo.modelo} - {veiculo.placa} ({veiculo.ano})
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {veiculo.combustivel} • {veiculo.localizacao}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge
                                      variant={
                                        veiculo.status === "Disponível"
                                          ? "default"
                                          : veiculo.status === "Em Uso"
                                            ? "secondary"
                                            : veiculo.status === "Manutenção"
                                              ? "destructive"
                                              : "outline"
                                      }
                                    >
                                      {veiculo.status}
                                    </Badge>
                                    {veiculo.responsavel && (
                                      <Badge variant="outline">Resp: {veiculo.responsavel}</Badge>
                                    )}
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarItem(veiculo, "veiculo")}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => excluirItem(veiculo.id, "veiculo")}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Fornecedores */}
              <TabsContent value="fornecedores" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <CardTitle className="flex items-center gap-2">
                          <Package className="h-5 w-5" />
                          {editingItem ? "Editar Fornecedor" : "Cadastrar Fornecedor"}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 space-y-4">
                        <div>
                          <Label htmlFor="fornecedor-nome">Nome da Empresa *</Label>
                          <Input
                            id="fornecedor-nome"
                            value={novoFornecedor.nome}
                            onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, nome: e.target.value }))}
                            placeholder="Construmega Materiais Ltda"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="cnpj">CNPJ *</Label>
                          <Input
                            id="cnpj"
                            value={novoFornecedor.cnpj}
                            onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, cnpj: e.target.value }))}
                            placeholder="12.345.678/0001-90"
                            className="border-blue-200"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="contato">Pessoa de Contato</Label>
                            <Input
                              id="contato"
                              value={novoFornecedor.contato}
                              onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, contato: e.target.value }))}
                              placeholder="Carlos Pereira"
                              className="border-blue-200"
                            />
                          </div>
                          <div>
                            <Label htmlFor="telefone">Telefone</Label>
                            <Input
                              id="telefone"
                              value={novoFornecedor.telefone}
                              onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, telefone: e.target.value }))}
                              placeholder="(21) 3333-4444"
                              className="border-blue-200"
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="fornecedor-email">E-mail</Label>
                          <Input
                            id="fornecedor-email"
                            type="email"
                            value={novoFornecedor.email}
                            onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, email: e.target.value }))}
                            placeholder="vendas@construmega.com.br"
                            className="border-blue-200"
                          />
                        </div>

                        <div>
                          <Label htmlFor="endereco">Endereço</Label>
                          <Textarea
                            id="endereco"
                            value={novoFornecedor.endereco}
                            onChange={(e) => setNovoFornecedor((prev) => ({ ...prev, endereco: e.target.value }))}
                            placeholder="Av. Industrial, 1000 - Maricá/RJ"
                            className="border-blue-200"
                            rows={3}
                          />
                        </div>

                        <div>
                          <Label htmlFor="fornecedor-categoria">Categoria</Label>
                          <Select
                            value={novoFornecedor.categoria}
                            onChange={(value) => setNovoFornecedor((prev) => ({ ...prev, categoria: value }))}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione a categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Materiais de Construção">Materiais de Construção</SelectItem>
                              <SelectItem value="Ferramentas e Equipamentos">Ferramentas e Equipamentos</SelectItem>
                              <SelectItem value="Serviços Especializados">Serviços Especializados</SelectItem>
                              <SelectItem value="Combustível">Combustível</SelectItem>
                              <SelectItem value="Alimentação">Alimentação</SelectItem>
                              <SelectItem value="Transporte">Transporte</SelectItem>
                              <SelectItem value="Manutenção">Manutenção</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="fornecedor-status"
                            checked={novoFornecedor.status === "Ativo"}
                            onCheckedChange={(checked) =>
                              setNovoFornecedor((prev) => ({ ...prev, status: checked ? "Ativo" : "Inativo" }))
                            }
                          />
                          <Label htmlFor="fornecedor-status">Fornecedor Ativo</Label>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            onClick={salvarFornecedor}
                            className="flex-1 bg-blue-600 hover:bg-blue-700"
                            disabled={loading}
                          >
                            <Save className="h-4 w-4 mr-2" />
                            {loading ? "Salvando..." : editingItem ? "Atualizar" : "Cadastrar"}
                          </Button>
                          {editingItem && (
                            <Button onClick={cancelarEdicao} variant="outline" className="flex-1">
                              Cancelar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="lg:col-span-2">
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle>Fornecedores Cadastrados</CardTitle>
                            <CardDescription>{fornecedores.length} fornecedores no sistema</CardDescription>
                          </div>
                          <div className="relative">
                            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <Input
                              placeholder="Buscar fornecedores..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="pl-10 w-64"
                            />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {fornecedores
                            .filter(
                              (fornecedor) =>
                                fornecedor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                fornecedor.cnpj.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                fornecedor.categoria.toLowerCase().includes(searchTerm.toLowerCase()),
                            )
                            .map((fornecedor) => (
                              <div
                                key={fornecedor.id}
                                className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-blue-50 transition-colors"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900">{fornecedor.nome}</div>
                                  <div className="text-sm text-gray-500">
                                    CNPJ: {fornecedor.cnpj} • {fornecedor.contato}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {fornecedor.telefone} • {fornecedor.email}
                                  </div>
                                  <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline">{fornecedor.categoria}</Badge>
                                    <Badge variant={fornecedor.status === "Ativo" ? "default" : "secondary"}>
                                      {fornecedor.status}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => editarItem(fornecedor, "fornecedor")}
                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => excluirItem(fornecedor.id, "fornecedor")}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Tab Mensagens */}
              <TabsContent value="mensagens" className="space-y-6">
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Sistema de Mensagens
                    </CardTitle>
                    <CardDescription>Envie mensagens para usuários específicos ou grupos</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="destinatario">Destinatário</Label>
                          <Select>
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione o destinatário" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos os Usuários</SelectItem>
                              <SelectItem value="gerentes">Apenas Gerentes</SelectItem>
                              <SelectItem value="supervisores">Apenas Supervisores</SelectItem>
                              <SelectItem value="encarregados">Apenas Encarregados</SelectItem>
                              {usuarios.map((usuario) => (
                                <SelectItem key={usuario.id} value={usuario.username}>
                                  {usuario.name} (@{usuario.username})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor="assunto">Assunto</Label>
                          <Input id="assunto" placeholder="Assunto da mensagem" className="border-blue-200" />
                        </div>

                        <div>
                          <Label htmlFor="mensagem">Mensagem</Label>
                          <Textarea
                            id="mensagem"
                            placeholder="Digite sua mensagem aqui..."
                            rows={6}
                            className="border-blue-200"
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch id="urgente" />
                          <Label htmlFor="urgente">Mensagem Urgente</Label>
                        </div>

                        <Button className="w-full bg-blue-600 hover:bg-blue-700">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Enviar Mensagem
                        </Button>
                      </div>

                      <div>
                        <h3 className="font-medium mb-4">Mensagens Recentes</h3>
                        <div className="space-y-3">
                          <div className="p-3 border rounded-lg bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Para: João Silva</span>
                              <span className="text-xs text-gray-500">Há 2 horas</span>
                            </div>
                            <p className="text-sm text-gray-600">Reunião de planejamento marcada para amanhã às 14h.</p>
                            <Badge variant="outline" className="mt-2">
                              Entregue
                            </Badge>
                          </div>

                          <div className="p-3 border rounded-lg bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Para: Todos os Gerentes</span>
                              <span className="text-xs text-gray-500">Ontem</span>
                            </div>
                            <p className="text-sm text-gray-600">Relatório mensal disponível no sistema.</p>
                            <Badge variant="outline" className="mt-2">
                              Entregue
                            </Badge>
                          </div>

                          <div className="p-3 border rounded-lg bg-white">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">Para: Maria Santos</span>
                              <span className="text-xs text-gray-500">2 dias atrás</span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Aprovação de material solicitada para obra do Centro.
                            </p>
                            <Badge variant="outline" className="mt-2">
                              Lida
                            </Badge>
                          </div>
                        </div>
                      </div>
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
