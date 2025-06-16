"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Plus,
  Eye,
  Paperclip,
  FileText,
  ChevronLeft,
  ChevronRight,
  FileSpreadsheet,
  ImageIcon,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar"
import Link from "next/link"

// Função para gerar código da OS (ano + sequência)
const generateOSCode = () => {
  const currentYear = new Date().getFullYear().toString().slice(-2) // Últimos 2 dígitos do ano
  const sequence = Math.floor(Math.random() * 9999) + 1 // Sequência de 1 a 9999
  return `${currentYear}${sequence.toString().padStart(6, "0")}`
}

// Mock data baseado no SIGELU
const ordensServico = [
  {
    id: 1,
    codigo: "25050023",
    criticidade: "Normal",
    tipos: "Construção / Investimento",
    servicos: "Drenagem",
    situacao: "Aprovada",
    distrito: "Ponta Negra",
    local: "Estrada de Jaconé",
    inicioPrevisao: "20/05/2025",
    solicitante: "João Silva",
    dataAbertura: "15/05/2025",
    fotos: ["/placeholder.svg?height=200&width=300", "/placeholder.svg?height=200&width=300"],
  },
  {
    id: 2,
    codigo: "25050022",
    criticidade: "Normal",
    tipos: "Reforma / Consumo",
    servicos: "Meio-fio, Calçada",
    situacao: "Aprovada",
    distrito: "Centro",
    local: "Avenida Litorânea",
    inicioPrevisao: "28/05/2025",
    solicitante: "Maria Santos",
    dataAbertura: "14/05/2025",
    fotos: ["/placeholder.svg?height=200&width=300"],
  },
  {
    id: 3,
    codigo: "25050021",
    criticidade: "Normal",
    tipos: "Reforma / Consumo",
    servicos: "Calçada",
    situacao: "Aprovada",
    distrito: "Inoã",
    local: "Rua Carlos Mariguella (E.M. Carlos Costa Lima)",
    inicioPrevisao: "22/05/2025",
    solicitante: "Carlos Oliveira",
    dataAbertura: "13/05/2025",
    fotos: [
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
      "/placeholder.svg?height=200&width=300",
    ],
  },
  {
    id: 4,
    codigo: "25050020",
    criticidade: "Alta",
    tipos: "Manutenção",
    servicos: "Instalação elétrica",
    situacao: "Em Análise",
    distrito: "Itaipuaçu",
    local: "Av. Beira Mar, Ponta Negra",
    inicioPrevisao: "25/05/2025",
    solicitante: "Ana Costa",
    dataAbertura: "12/05/2025",
    fotos: [],
  },
  {
    id: 5,
    codigo: "25050019",
    criticidade: "Urgente",
    tipos: "Emergencial",
    servicos: "Reparo emergencial",
    situacao: "Reprovada",
    distrito: "Centro",
    local: "Estrada do Imbassaí",
    inicioPrevisao: "20/05/2025",
    solicitante: "Pedro Ferreira",
    dataAbertura: "11/05/2025",
    fotos: ["/placeholder.svg?height=200&width=300"],
  },
]

export default function OrdensPage() {
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [filteredOrdens, setFilteredOrdens] = useState(ordensServico)
  const [selectedOS, setSelectedOS] = useState<any>(null)
  const [showPhotoGallery, setShowPhotoGallery] = useState(false)
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
    const filtered = ordensServico.filter(
      (os) =>
        os.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.local.toLowerCase().includes(searchTerm.toLowerCase()) ||
        os.servicos.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredOrdens(filtered)
  }, [searchTerm])

  const getSituacaoColor = (situacao: string) => {
    switch (situacao) {
      case "Aprovada":
        return "bg-blue-600 text-white hover:bg-blue-700"
      case "Reprovada":
        return "bg-red-600 text-white hover:bg-red-700"
      case "Em Análise":
        return "bg-yellow-600 text-white hover:bg-yellow-700"
      default:
        return "bg-gray-600 text-white hover:bg-gray-700"
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(filteredOrdens.map((os) => os.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id))
    }
  }

  const openPhotoGallery = (os: any) => {
    setSelectedOS(os)
    setShowPhotoGallery(true)
  }

  const closePhotoGallery = () => {
    setShowPhotoGallery(false)
    setSelectedOS(null)
  }

  const totalPages = Math.ceil(filteredOrdens.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = filteredOrdens.slice(startIndex, endIndex)

  if (!user) {
    return <div>Carregando...</div>
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar user={user} />
        <SidebarInset className="flex-1">
          {/* Header - Estilo SIGELU com azul */}
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
            {/* Card Principal */}
            <Card className="shadow-sm border-0">
              <CardHeader className="pb-4 bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-normal text-gray-800 mb-2">Ordens de Serviço</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-blue-600">
                      <Link href="/" className="hover:underline">
                        Home
                      </Link>
                      <span className="text-gray-400">&gt;</span>
                      <span className="text-gray-600">Ordens de Serviço</span>
                    </div>
                  </div>
                  <Button
                    className="bg-blue-600 hover:bg-blue-700 rounded-full h-14 w-14 p-0 shadow-lg"
                    onClick={() => router.push("/ordens/nova")}
                  >
                    <Plus className="h-6 w-6" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                {/* Filtros */}
                <div className="flex flex-col md:flex-row gap-4 items-end">
                  <div className="flex-1">
                    <div className="relative">
                      <Input
                        placeholder="Busque pelo código, local ou serviço prestado."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                      <Search className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6">BUSCA AVANÇADA</Button>
                </div>

                {/* Ações de Exportação */}
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-10 w-10 p-0">
                    <FileSpreadsheet className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50 h-10 w-10 p-0">
                    <FileText className="h-5 w-5" />
                  </Button>
                </div>

                {/* Tabela */}
                <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="text-left p-4 w-12">
                            <Checkbox
                              checked={selectedItems.length === currentItems.length && currentItems.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Código</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Criticidade</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Tipo(s)</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Serviço(s)</th>
                          <th className="text-center p-4 font-medium text-gray-700 text-sm">Situação</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Distrito</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Local</th>
                          <th className="text-center p-4 font-medium text-gray-700 text-sm">Início previsto</th>
                          <th className="text-left p-4 font-medium text-gray-700 text-sm">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {currentItems.map((os) => (
                          <tr key={os.id} className="hover:bg-gray-50">
                            <td className="p-4">
                              <Checkbox
                                checked={selectedItems.includes(os.id)}
                                onCheckedChange={(checked) => handleSelectItem(os.id, checked as boolean)}
                              />
                            </td>
                            <td className="p-4 text-sm text-gray-900">{os.codigo}</td>
                            <td className="p-4 text-sm text-gray-700">{os.criticidade}</td>
                            <td className="p-4 text-sm text-gray-700">{os.tipos}</td>
                            <td className="p-4 text-sm text-gray-700">{os.servicos}</td>
                            <td className="p-4 text-center">
                              <Badge className={`${getSituacaoColor(os.situacao)} text-xs px-3 py-1`}>
                                {os.situacao}
                              </Badge>
                            </td>
                            <td className="p-4 text-sm text-gray-700">{os.distrito}</td>
                            <td className="p-4 text-sm text-gray-700">{os.local}</td>
                            <td className="p-4 text-center text-sm text-gray-700">{os.inicioPrevisao}</td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                  <Eye className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                                  <Paperclip className="h-4 w-4 text-gray-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  onClick={() => openPhotoGallery(os)}
                                >
                                  <ImageIcon className="h-4 w-4 text-gray-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Footer da Tabela - Paginação */}
                  <div className="bg-gray-50 px-4 py-3 flex items-center justify-between border-t border-gray-200">
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">Linhas por página:</span>
                      <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                        <SelectTrigger className="w-20 h-8 border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5</SelectItem>
                          <SelectItem value="10">10</SelectItem>
                          <SelectItem value="25">25</SelectItem>
                          <SelectItem value="50">50</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-700">
                        {startIndex + 1}-{Math.min(endIndex, filteredOrdens.length)} de {filteredOrdens.length}
                      </span>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={currentPage === 1}
                          onClick={() => setCurrentPage(currentPage - 1)}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={currentPage === totalPages}
                          onClick={() => setCurrentPage(currentPage + 1)}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </main>
        </SidebarInset>
      </div>

      {/* Modal de Galeria de Fotos */}
      {showPhotoGallery && selectedOS && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">
                Fotos da OS {selectedOS.codigo} - {selectedOS.local}
              </h2>
              <Button variant="ghost" size="sm" onClick={closePhotoGallery} className="h-8 w-8 p-0">
                &times;
              </Button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              {selectedOS.fotos.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedOS.fotos.map((foto: string, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                      <img
                        src={foto || "/placeholder.svg"}
                        alt={`Foto ${index + 1} da OS ${selectedOS.codigo}`}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-2 bg-gray-50 text-sm text-gray-600">
                        Foto {index + 1} - {new Date().toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <ImageIcon className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <p>Nenhuma foto disponível para esta Ordem de Serviço.</p>
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-200 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={closePhotoGallery}>
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}
    </SidebarProvider>
  )
}
