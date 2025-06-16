"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, MapPin, Plus, Trash, Upload } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import dynamic from "next/dynamic"

// Importação dinâmica do mapa para evitar problemas de SSR
const MapComponent = dynamic(() => import("@/components/map-interactive"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-gray-100 flex items-center justify-center rounded-lg">Carregando mapa...</div>
  ),
})

const distritos = ["Centro", "Inoã", "Itaipuaçu", "Ponta Negra", "São José do Imbassaí", "Guaratiba", "Cordeirinho"]

const bairros = {
  Centro: ["Centro", "Flamengo", "Mumbuca"],
  Inoã: ["Inoã", "Cajueiros", "Recanto"],
  Itaipuaçu: ["Itaipuaçu", "Jardim Atlântico", "Barroco"],
  "Ponta Negra": ["Ponta Negra", "Jaconé", "Bananal"],
  "São José do Imbassaí": ["São José", "Imbassaí", "Pindobal"],
  Guaratiba: ["Guaratiba", "Retiro", "Cassorotiba"],
  Cordeirinho: ["Cordeirinho", "Bambuí", "Manoel Ribeiro"],
}

const tiposServico = ["Construção / Investimento", "Reforma / Consumo", "Manutenção", "Emergencial"]

const servicos = {
  "Construção / Investimento": [
    "Construção de estruturas",
    "Pavimentação asfáltica",
    "Construção de praça",
    "Construção de escola",
    "Drenagem",
  ],
  "Reforma / Consumo": ["Reforma de escola", "Reforma de praça", "Meio-fio", "Calçada", "Pintura"],
  Manutenção: [
    "Manutenção de via",
    "Manutenção de drenagem",
    "Instalação elétrica",
    "Manutenção predial",
    "Limpeza de canal",
  ],
  Emergencial: [
    "Reparo emergencial",
    "Contenção de encosta",
    "Desobstrução de via",
    "Reparo de vazamento",
    "Remoção de árvore",
  ],
}

const cargos = ["Encarregado", "Pedreiro", "Servente", "Eletricista", "Pintor", "Operador de máquina", "Motorista"]

const equipamentos = [
  "Retroescavadeira",
  "Caminhão basculante",
  "Betoneira",
  "Compactador",
  "Gerador",
  "Andaime",
  "Furadeira industrial",
]

const materiais = [
  "Cimento",
  "Areia",
  "Brita",
  "Tijolo",
  "Bloco de concreto",
  "Tubo PVC",
  "Tinta",
  "Prego",
  "Arame",
  "Madeira",
]

// Função para gerar código da OS (ano + sequência)
const generateOSCode = () => {
  const currentYear = new Date().getFullYear().toString().slice(-2)
  const sequence = Math.floor(Math.random() * 999999) + 1
  return `${currentYear}${sequence.toString().padStart(6, "0")}`
}

export default function NovaOrdemServico() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [osCode] = useState(generateOSCode())
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDistrict, setSelectedDistrict] = useState("")
  const [selectedBairros, setSelectedBairros] = useState<string[]>([])
  const [selectedTipoServico, setSelectedTipoServico] = useState("")
  const [selectedServicos, setSelectedServicos] = useState<string[]>([])
  const [location, setLocation] = useState({ lat: -22.9192, lng: -42.8186 })
  const [address, setAddress] = useState("")
  const [equipe, setEquipe] = useState<any[]>([])
  const [equipamentosLista, setEquipamentosLista] = useState<any[]>([])
  const [materiaisLista, setMateriaisLista] = useState<any[]>([])
  const [bloquearMateriais, setBloquearMateriais] = useState(false)
  const [fotos, setFotos] = useState<string[]>([])

  const [formData, setFormData] = useState({
    solicitante: "",
    criticidade: "Normal",
    responsavelTecnico: "",
    processoSolicitacao: "",
    descricaoServico: "",
    observacao: "",
    local: "",
    localDivergente: "",
    localReferencia: "",
    inicioPrevisao: "",
    conclusaoPrevisao: "",
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  const handleDistrictChange = (district: string) => {
    setSelectedDistrict(district)
    setSelectedBairros([])
  }

  const handleTipoServicoChange = (tipo: string) => {
    setSelectedTipoServico(tipo)
    setSelectedServicos([])
  }

  const handleServicoToggle = (servico: string) => {
    if (selectedServicos.includes(servico)) {
      setSelectedServicos(selectedServicos.filter((s) => s !== servico))
    } else {
      setSelectedServicos([...selectedServicos, servico])
    }
  }

  const handleMapClick = (lat: number, lng: number) => {
    setLocation({ lat, lng })
    setAddress(`Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`)
  }

  const handleAddEquipe = () => {
    setEquipe([
      ...equipe,
      {
        id: Date.now(),
        cargo: "",
        unidade: "Dia",
        custo: 0,
        funcionario: "",
        quantidade: 1,
        total: 0,
      },
    ])
  }

  const handleAddEquipamento = () => {
    setEquipamentosLista([
      ...equipamentosLista,
      {
        id: Date.now(),
        nome: "",
        unidade: "Dia",
        custo: 0,
        quantidade: 1,
        total: 0,
      },
    ])
  }

  const handleAddMaterial = () => {
    setMateriaisLista([
      ...materiaisLista,
      {
        id: Date.now(),
        nome: "",
        unidade: "Unid.",
        custo: 0,
        quantidade: 1,
        total: 0,
      },
    ])
  }

  const handleSubmit = (action: "rascunho" | "aprovacao") => {
    const osData = {
      codigo: osCode,
      ...formData,
      distrito: selectedDistrict,
      bairros: selectedBairros,
      tipoServico: selectedTipoServico,
      servicos: selectedServicos,
      localizacao: location,
      endereco: address,
      equipe,
      equipamentos: equipamentosLista,
      materiais: materiaisLista,
      bloquearMateriais,
      fotos,
      status: action === "rascunho" ? "Rascunho" : "Aguardando Aprovação",
      dataCriacao: new Date().toISOString(),
    }

    console.log("Dados da OS:", osData)
    alert(`Ordem de Serviço ${osCode} ${action === "rascunho" ? "salva como rascunho" : "enviada para aprovação"}!`)
    router.push("/ordens")
  }

  const steps = [
    { id: 1, title: "Informações Básicas", icon: "📋" },
    { id: 2, title: "Localização", icon: "📍" },
    { id: 3, title: "Recursos", icon: "🔧" },
    { id: 4, title: "Anexos", icon: "📎" },
  ]

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
              <div className="flex-1">
                <h1 className="text-lg font-medium">SIGELU Obras</h1>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="sm" className="text-white hover:bg-blue-600">
                  <span className="hidden sm:inline">{user.name}</span>
                </Button>
              </div>
            </div>
          </header>

          <main className="p-6">
            <div className="max-w-7xl mx-auto">
              {/* Cabeçalho */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <Link href="/ordens">
                    <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                      <ArrowLeft className="h-4 w-4 mr-1" />
                      Voltar
                    </Button>
                  </Link>
                  <div className="flex-1">
                    <h1 className="text-2xl font-semibold text-gray-800">Cadastrar Ordem de Serviço</h1>
                    <div className="flex items-center gap-2 text-sm text-blue-600 mt-1">
                      <Link href="/" className="hover:underline">
                        Home
                      </Link>
                      <span className="text-gray-400">&gt;</span>
                      <Link href="/ordens" className="hover:underline">
                        Ordens de Serviço
                      </Link>
                      <span className="text-gray-400">&gt;</span>
                      <span className="text-gray-600">Cadastrar Ordem de Serviço</span>
                    </div>
                  </div>
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-mono text-lg">OS: {osCode}</div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm">
                  {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full text-sm font-medium ${
                          currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {step.icon}
                      </div>
                      <div className="ml-3">
                        <p
                          className={`text-sm font-medium ${
                            currentStep >= step.id ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {step.title}
                        </p>
                      </div>
                      {index < steps.length - 1 && (
                        <div className={`w-16 h-0.5 mx-4 ${currentStep > step.id ? "bg-blue-600" : "bg-gray-200"}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 1: Informações Básicas */}
              {currentStep === 1 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Informações da Ordem de Serviço</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="solicitante">Solicitante *</Label>
                          <Select
                            value={formData.solicitante}
                            onValueChange={(value) => setFormData({ ...formData, solicitante: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione o solicitante" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Chefia da Administração e Finanças">
                                Chefia da Administração e Finanças
                              </SelectItem>
                              <SelectItem value="Secretaria de Obras">Secretaria de Obras</SelectItem>
                              <SelectItem value="Gabinete do Prefeito">Gabinete do Prefeito</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="criticidade">Criticidade *</Label>
                          <Select
                            value={formData.criticidade}
                            onValueChange={(value) => setFormData({ ...formData, criticidade: value })}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione a criticidade" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Normal">Normal</SelectItem>
                              <SelectItem value="Alta">Alta</SelectItem>
                              <SelectItem value="Urgente">Urgente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="responsavelTecnico">Responsável Técnico **</Label>
                        <Select
                          value={formData.responsavelTecnico}
                          onValueChange={(value) => setFormData({ ...formData, responsavelTecnico: value })}
                        >
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Selecione um responsável técnico" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="João Silva">João Silva</SelectItem>
                            <SelectItem value="Maria Santos">Maria Santos</SelectItem>
                            <SelectItem value="Carlos Oliveira">Carlos Oliveira</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="processoSolicitacao">Processo de Solicitação</Label>
                        <Input
                          id="processoSolicitacao"
                          value={formData.processoSolicitacao}
                          onChange={(e) => setFormData({ ...formData, processoSolicitacao: e.target.value })}
                          className="border-blue-200"
                          maxLength={255}
                        />
                      </div>

                      <div>
                        <Label htmlFor="tipoServico">Tipo(s) *</Label>
                        <Select value={selectedTipoServico} onValueChange={handleTipoServicoChange}>
                          <SelectTrigger className="border-blue-200">
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposServico.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="servicos">Serviço(s) ** (Múltipla seleção)</Label>
                        <div className="mt-2 border border-blue-200 rounded-md p-3 max-h-48 overflow-y-auto bg-blue-50/30">
                          {selectedTipoServico ? (
                            servicos[selectedTipoServico as keyof typeof servicos].map((servico) => (
                              <div key={servico} className="flex items-center space-x-2 mb-2">
                                <Checkbox
                                  id={`servico-${servico}`}
                                  checked={selectedServicos.includes(servico)}
                                  onCheckedChange={() => handleServicoToggle(servico)}
                                  className="border-blue-400 data-[state=checked]:bg-blue-600"
                                />
                                <label
                                  htmlFor={`servico-${servico}`}
                                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {servico}
                                </label>
                              </div>
                            ))
                          ) : (
                            <p className="text-sm text-gray-500">Selecione um tipo de serviço primeiro</p>
                          )}
                        </div>
                        {selectedServicos.length > 0 && (
                          <div className="mt-2 text-sm text-blue-600">Selecionados: {selectedServicos.join(", ")}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="descricaoServico">Descrição do serviço</Label>
                        <Textarea
                          id="descricaoServico"
                          value={formData.descricaoServico}
                          onChange={(e) => setFormData({ ...formData, descricaoServico: e.target.value })}
                          rows={4}
                          className="border-blue-200"
                          maxLength={1000}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Datas e Observações</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="inicioPrevisao">Início previsto **</Label>
                          <Input
                            id="inicioPrevisao"
                            type="date"
                            value={formData.inicioPrevisao}
                            onChange={(e) => setFormData({ ...formData, inicioPrevisao: e.target.value })}
                            className="border-blue-200"
                          />
                        </div>
                        <div>
                          <Label htmlFor="conclusaoPrevisao">Conclusão prevista **</Label>
                          <Input
                            id="conclusaoPrevisao"
                            type="date"
                            value={formData.conclusaoPrevisao}
                            onChange={(e) => setFormData({ ...formData, conclusaoPrevisao: e.target.value })}
                            className="border-blue-200"
                          />
                        </div>
                      </div>

                      {(!formData.inicioPrevisao || !formData.conclusaoPrevisao) && (
                        <div className="bg-blue-50 border border-blue-200 p-3 rounded-md text-sm text-blue-700">
                          Por favor, selecione ambas as datas.
                        </div>
                      )}

                      <div>
                        <Label htmlFor="observacao">Observação</Label>
                        <Textarea
                          id="observacao"
                          value={formData.observacao}
                          onChange={(e) => setFormData({ ...formData, observacao: e.target.value })}
                          rows={6}
                          className="border-blue-200"
                          maxLength={390}
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 2: Localização */}
              {currentStep === 2 && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800 flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Mapa Interativo
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="h-[400px] relative border border-blue-200 rounded-lg overflow-hidden">
                        <MapComponent center={location} onMapClick={handleMapClick} marker={location} />
                      </div>
                      <div className="mt-4 bg-blue-50 border border-blue-200 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-blue-800">Localização marcada</p>
                            <p className="text-xs text-blue-600">
                              {address || "Clique no mapa para marcar a localização da obra"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <CardTitle className="text-blue-800">Endereço e Localização</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="distrito">Distrito **</Label>
                          <Select value={selectedDistrict} onValueChange={handleDistrictChange}>
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {distritos.map((distrito) => (
                                <SelectItem key={distrito} value={distrito}>
                                  {distrito}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="bairro">Bairro **</Label>
                          <Select
                            value={selectedBairros[0] || ""}
                            onValueChange={(value) => setSelectedBairros([value])}
                            disabled={!selectedDistrict}
                          >
                            <SelectTrigger className="border-blue-200">
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              {selectedDistrict &&
                                bairros[selectedDistrict as keyof typeof bairros].map((bairro) => (
                                  <SelectItem key={bairro} value={bairro}>
                                    {bairro}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="local">Local *</Label>
                        <Input
                          id="local"
                          value={formData.local}
                          onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                          className="border-blue-200"
                          maxLength={255}
                          placeholder="Ex: Rua das Flores, 100"
                        />
                      </div>

                      <div>
                        <Label htmlFor="localDivergente">Local divergente</Label>
                        <Input
                          id="localDivergente"
                          value={formData.localDivergente}
                          onChange={(e) => setFormData({ ...formData, localDivergente: e.target.value })}
                          className="border-blue-200"
                          maxLength={255}
                        />
                      </div>

                      <div>
                        <Label htmlFor="localReferencia">Local de referência</Label>
                        <Input
                          id="localReferencia"
                          value={formData.localReferencia}
                          onChange={(e) => setFormData({ ...formData, localReferencia: e.target.value })}
                          className="border-blue-200"
                          maxLength={255}
                          placeholder="Ex: Próximo à escola municipal"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Step 3: Recursos */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  {/* Equipe */}
                  <Card className="shadow-lg border-blue-100">
                    <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-blue-800">Equipe **</CardTitle>
                        <Button onClick={handleAddEquipe} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="h-4 w-4 mr-2" />
                          Adicionar membro
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6">
                      {equipe.length > 0 ? (
                        <div className="border border-blue-200 rounded-lg overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-blue-50 border-b border-blue-200">
                              <tr>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Cargo</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Unidade</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Custo</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Funcionário(s)</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Quantidade</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Total</th>
                                <th className="text-left p-3 text-sm font-medium text-blue-800">Ações</th>
                              </tr>
                            </thead>
                            <tbody>
                              {equipe.map((item, index) => (
                                <tr key={item.id} className="border-b border-blue-100">
                                  <td className="p-3">
                                    <Select
                                      value={item.cargo}
                                      onValueChange={(value) => {
                                        const newEquipe = [...equipe]
                                        newEquipe[index].cargo = value
                                        setEquipe(newEquipe)
                                      }}
                                    >
                                      <SelectTrigger className="w-40 border-blue-200">
                                        <SelectValue placeholder="Selecione" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {cargos.map((cargo) => (
                                          <SelectItem key={cargo} value={cargo}>
                                            {cargo}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={item.unidade}
                                      onChange={(e) => {
                                        const newEquipe = [...equipe]
                                        newEquipe[index].unidade = e.target.value
                                        setEquipe(newEquipe)
                                      }}
                                      className="w-20 border-blue-200"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="number"
                                      value={item.custo}
                                      onChange={(e) => {
                                        const newEquipe = [...equipe]
                                        newEquipe[index].custo = Number.parseFloat(e.target.value) || 0
                                        newEquipe[index].total = newEquipe[index].custo * newEquipe[index].quantidade
                                        setEquipe(newEquipe)
                                      }}
                                      className="w-24 border-blue-200"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={item.funcionario}
                                      onChange={(e) => {
                                        const newEquipe = [...equipe]
                                        newEquipe[index].funcionario = e.target.value
                                        setEquipe(newEquipe)
                                      }}
                                      className="w-40 border-blue-200"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      type="number"
                                      value={item.quantidade}
                                      onChange={(e) => {
                                        const newEquipe = [...equipe]
                                        newEquipe[index].quantidade = Number.parseInt(e.target.value) || 0
                                        newEquipe[index].total = newEquipe[index].custo * newEquipe[index].quantidade
                                        setEquipe(newEquipe)
                                      }}
                                      className="w-20 border-blue-200"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Input
                                      value={item.total.toFixed(2)}
                                      readOnly
                                      className="w-24 bg-blue-50 border-blue-200"
                                    />
                                  </td>
                                  <td className="p-3">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setEquipe(equipe.filter((e) => e.id !== item.id))}
                                      className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 border border-blue-200 rounded-lg bg-blue-50/30">
                          Nenhum membro adicionado à equipe
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Equipamentos e Materiais em grid */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Equipamentos */}
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-blue-800">Equipamentos</CardTitle>
                          <Button onClick={handleAddEquipamento} className="bg-blue-600 hover:bg-blue-700" size="sm">
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {equipamentosLista.length > 0 ? (
                          <div className="space-y-3">
                            {equipamentosLista.map((item, index) => (
                              <div key={item.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <Select
                                    value={item.nome}
                                    onValueChange={(value) => {
                                      const newLista = [...equipamentosLista]
                                      newLista[index].nome = value
                                      setEquipamentosLista(newLista)
                                    }}
                                  >
                                    <SelectTrigger className="border-blue-200">
                                      <SelectValue placeholder="Equipamento" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {equipamentos.map((equip) => (
                                        <SelectItem key={equip} value={equip}>
                                          {equip}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    placeholder="Unidade"
                                    value={item.unidade}
                                    onChange={(e) => {
                                      const newLista = [...equipamentosLista]
                                      newLista[index].unidade = e.target.value
                                      setEquipamentosLista(newLista)
                                    }}
                                    className="border-blue-200"
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Custo"
                                    value={item.custo}
                                    onChange={(e) => {
                                      const newLista = [...equipamentosLista]
                                      newLista[index].custo = Number.parseFloat(e.target.value) || 0
                                      newLista[index].total = newLista[index].custo * newLista[index].quantidade
                                      setEquipamentosLista(newLista)
                                    }}
                                    className="border-blue-200"
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Qtd"
                                    value={item.quantidade}
                                    onChange={(e) => {
                                      const newLista = [...equipamentosLista]
                                      newLista[index].quantidade = Number.parseInt(e.target.value) || 0
                                      newLista[index].total = newLista[index].custo * newLista[index].quantidade
                                      setEquipamentosLista(newLista)
                                    }}
                                    className="border-blue-200"
                                  />
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={`R$ ${item.total.toFixed(2)}`}
                                      readOnly
                                      className="bg-blue-50 border-blue-200 text-sm"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        setEquipamentosLista(equipamentosLista.filter((e) => e.id !== item.id))
                                      }
                                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 border border-blue-200 rounded-lg bg-blue-50/30">
                            Nenhum equipamento adicionado
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Materiais */}
                    <Card className="shadow-lg border-blue-100">
                      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-blue-800">Materiais</CardTitle>
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="bloquearMateriais"
                              checked={bloquearMateriais}
                              onCheckedChange={(checked) => setBloquearMateriais(!!checked)}
                              className="border-blue-400 data-[state=checked]:bg-blue-600"
                            />
                            <Label htmlFor="bloquearMateriais" className="text-sm">
                              Bloquear
                            </Label>
                            <Button
                              onClick={handleAddMaterial}
                              className="bg-blue-600 hover:bg-blue-700"
                              size="sm"
                              disabled={bloquearMateriais}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4">
                        {materiaisLista.length > 0 ? (
                          <div className="space-y-3">
                            {materiaisLista.map((item, index) => (
                              <div key={item.id} className="border border-blue-200 rounded-lg p-3 bg-blue-50/30">
                                <div className="grid grid-cols-2 gap-2 mb-2">
                                  <Select
                                    value={item.nome}
                                    onValueChange={(value) => {
                                      const newLista = [...materiaisLista]
                                      newLista[index].nome = value
                                      setMateriaisLista(newLista)
                                    }}
                                    disabled={bloquearMateriais}
                                  >
                                    <SelectTrigger className="border-blue-200">
                                      <SelectValue placeholder="Material" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {materiais.map((material) => (
                                        <SelectItem key={material} value={material}>
                                          {material}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <Input
                                    placeholder="Unidade"
                                    value={item.unidade}
                                    onChange={(e) => {
                                      const newLista = [...materiaisLista]
                                      newLista[index].unidade = e.target.value
                                      setMateriaisLista(newLista)
                                    }}
                                    className="border-blue-200"
                                    disabled={bloquearMateriais}
                                  />
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Custo"
                                    value={item.custo}
                                    onChange={(e) => {
                                      const newLista = [...materiaisLista]
                                      newLista[index].custo = Number.parseFloat(e.target.value) || 0
                                      newLista[index].total = newLista[index].custo * newLista[index].quantidade
                                      setMateriaisLista(newLista)
                                    }}
                                    className="border-blue-200"
                                    disabled={bloquearMateriais}
                                  />
                                  <Input
                                    type="number"
                                    placeholder="Qtd"
                                    value={item.quantidade}
                                    onChange={(e) => {
                                      const newLista = [...materiaisLista]
                                      newLista[index].quantidade = Number.parseInt(e.target.value) || 0
                                      newLista[index].total = newLista[index].custo * newLista[index].quantidade
                                      setMateriaisLista(newLista)
                                    }}
                                    className="border-blue-200"
                                    disabled={bloquearMateriais}
                                  />
                                  <div className="flex items-center gap-2">
                                    <Input
                                      value={`R$ ${item.total.toFixed(2)}`}
                                      readOnly
                                      className="bg-blue-50 border-blue-200 text-sm"
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setMateriaisLista(materiaisLista.filter((m) => m.id !== item.id))}
                                      className="h-8 w-8 p-0 text-red-500 hover:bg-red-50"
                                      disabled={bloquearMateriais}
                                    >
                                      <Trash className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 text-gray-500 border border-blue-200 rounded-lg bg-blue-50/30">
                            Nenhum material adicionado
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}

              {/* Step 4: Anexos */}
              {currentStep === 4 && (
                <Card className="shadow-lg border-blue-100">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-100">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-blue-800">Anexos e Documentos</CardTitle>
                      <Button
                        onClick={() => setFotos([...fotos, "/placeholder.svg?height=200&width=300"])}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Adicionar foto
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    {fotos.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {fotos.map((foto, index) => (
                          <div key={index} className="relative border border-blue-200 rounded-lg overflow-hidden">
                            <img
                              src={foto || "/placeholder.svg"}
                              alt={`Foto ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setFotos(fotos.filter((_, i) => i !== index))}
                              className="absolute top-2 right-2 h-8 w-8 p-0 bg-red-500 text-white hover:bg-red-600"
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                            <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                              Foto {index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-blue-300 rounded-lg bg-blue-50/30">
                        <Upload className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-500 mb-2">Nenhuma foto adicionada</p>
                        <p className="text-sm text-gray-400">Clique no botão acima para adicionar fotos da obra</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-blue-200">
                <div className="flex gap-2">
                  {currentStep > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      Anterior
                    </Button>
                  )}
                </div>

                <div className="text-sm text-gray-600">
                  <p>* Campos obrigatórios para Salvar rascunho e Solicitar aprovação</p>
                  <p>** Campos obrigatórios para Solicitar aprovação</p>
                </div>

                <div className="flex gap-2">
                  {currentStep < 4 ? (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep(currentStep + 1)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Próximo
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleSubmit("rascunho")}
                        className="border-blue-200 text-blue-600 hover:bg-blue-50"
                      >
                        Salvar rascunho
                      </Button>
                      <Button
                        type="button"
                        onClick={() => handleSubmit("aprovacao")}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Solicitar aprovação
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}
