"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Calendar, MapPin, Users, Plus, Edit, Trash2, Download, Upload } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

// Dados mockados da obra
const obra = {
  id: "OS-2024-001",
  titulo: "Pavimentação Rua das Flores",
  descricao: "Pavimentação asfáltica da Rua das Flores, incluindo drenagem e sinalização viária.",
  distrito: "Centro",
  endereco: "Rua das Flores, 100 - Centro, Maricá/RJ",
  status: "Em Andamento",
  progresso: 75,
  encarregado: "João Silva",
  dataInicio: "2024-01-15",
  previsaoTermino: "2024-03-20",
  orcamento: 850000,
  gastoAtual: 637500,
}

const funcionarios = [
  { id: 1, nome: "João Silva", funcao: "Encarregado", dataInicio: "2024-01-15", status: "Ativo" },
  { id: 2, nome: "Maria Santos", funcao: "Operadora de Máquinas", dataInicio: "2024-01-15", status: "Ativo" },
  { id: 3, nome: "Carlos Oliveira", funcao: "Pedreiro", dataInicio: "2024-01-20", status: "Ativo" },
  { id: 4, nome: "Ana Costa", funcao: "Auxiliar", dataInicio: "2024-01-22", status: "Ativo" },
]

const materiais = [
  {
    id: 1,
    nome: "Asfalto CBUQ",
    quantidade: 150,
    unidade: "ton",
    valorUnitario: 450,
    valorTotal: 67500,
    dataUso: "2024-01-20",
  },
  {
    id: 2,
    nome: "Brita Graduada",
    quantidade: 200,
    unidade: "m³",
    valorUnitario: 85,
    valorTotal: 17000,
    dataUso: "2024-01-18",
  },
  {
    id: 3,
    nome: "Cimento Portland",
    quantidade: 50,
    unidade: "saca",
    valorUnitario: 32,
    valorTotal: 1600,
    dataUso: "2024-01-25",
  },
  {
    id: 4,
    nome: "Tinta para Sinalização",
    quantidade: 20,
    unidade: "lata",
    valorUnitario: 125,
    valorTotal: 2500,
    dataUso: "2024-02-01",
  },
]

const fotos = [
  { id: 1, titulo: "Início da Obra", data: "2024-01-15", url: "/placeholder.svg?height=200&width=300" },
  { id: 2, titulo: "Preparação do Terreno", data: "2024-01-18", url: "/placeholder.svg?height=200&width=300" },
  { id: 3, titulo: "Aplicação do Asfalto", data: "2024-02-01", url: "/placeholder.svg?height=200&width=300" },
  { id: 4, titulo: "Sinalização Viária", data: "2024-02-10", url: "/placeholder.svg?height=200&width=300" },
]

export default function DetalhesObra() {
  const params = useParams()
  const [novoFuncionario, setNovoFuncionario] = useState({ nome: "", funcao: "" })
  const [novoMaterial, setNovoMaterial] = useState({ nome: "", quantidade: "", unidade: "", valorUnitario: "" })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
              </Link>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">{obra.titulo}</h1>
                <div className="flex items-center gap-4 mt-1">
                  <Badge variant="outline">{obra.id}</Badge>
                  <Badge className="bg-blue-100 text-blue-800">{obra.status}</Badge>
                  <span className="text-sm text-gray-500">{obra.distrito}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Relatório
              </Button>
              <Link href={`/obras/${params.id}/editar`}>
                <Button>
                  <Edit className="w-4 h-4 mr-2" />
                  Editar Obra
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Informações Gerais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Informações da Obra</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-500">Descrição</Label>
                <p className="mt-1">{obra.descricao}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Endereço</Label>
                  <p className="mt-1 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {obra.endereco}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Encarregado</Label>
                  <p className="mt-1 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    {obra.encarregado}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Data de Início</Label>
                  <p className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {obra.dataInicio}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Previsão de Término</Label>
                  <p className="mt-1 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {obra.previsaoTermino}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Progresso e Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progresso da Obra</span>
                  <span className="font-semibold">{obra.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-blue-600 h-3 rounded-full transition-all"
                    style={{ width: `${obra.progresso}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Orçamento Total:</span>
                  <span className="font-semibold">R$ {obra.orcamento.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Gasto Atual:</span>
                  <span className="font-semibold text-blue-600">R$ {obra.gastoAtual.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Saldo:</span>
                  <span className="font-semibold text-green-600">
                    R$ {(obra.orcamento - obra.gastoAtual).toLocaleString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="funcionarios" className="space-y-6">
          <TabsList>
            <TabsTrigger value="funcionarios">Funcionários</TabsTrigger>
            <TabsTrigger value="materiais">Materiais</TabsTrigger>
            <TabsTrigger value="fotos">Fotos</TabsTrigger>
          </TabsList>

          <TabsContent value="funcionarios">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Funcionários da Obra</CardTitle>
                    <CardDescription>Gerencie a equipe alocada nesta obra</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Funcionário
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Funcionário</DialogTitle>
                        <DialogDescription>Adicione um novo funcionário à obra</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="nome">Nome</Label>
                          <Input
                            id="nome"
                            value={novoFuncionario.nome}
                            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                            placeholder="Nome do funcionário"
                          />
                        </div>
                        <div>
                          <Label htmlFor="funcao">Função</Label>
                          <Input
                            id="funcao"
                            value={novoFuncionario.funcao}
                            onChange={(e) => setNovoFuncionario({ ...novoFuncionario, funcao: e.target.value })}
                            placeholder="Função do funcionário"
                          />
                        </div>
                        <Button className="w-full">Adicionar</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {funcionarios.map((funcionario) => (
                    <div key={funcionario.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-semibold">{funcionario.nome}</h4>
                        <p className="text-sm text-gray-500">{funcionario.funcao}</p>
                        <p className="text-xs text-gray-400">Desde {funcionario.dataInicio}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          {funcionario.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materiais">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Materiais Utilizados</CardTitle>
                    <CardDescription>Controle de materiais e custos da obra</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar Material
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Adicionar Material</DialogTitle>
                        <DialogDescription>Registre um novo material utilizado na obra</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="material-nome">Nome do Material</Label>
                          <Input
                            id="material-nome"
                            value={novoMaterial.nome}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, nome: e.target.value })}
                            placeholder="Nome do material"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="quantidade">Quantidade</Label>
                            <Input
                              id="quantidade"
                              type="number"
                              value={novoMaterial.quantidade}
                              onChange={(e) => setNovoMaterial({ ...novoMaterial, quantidade: e.target.value })}
                              placeholder="0"
                            />
                          </div>
                          <div>
                            <Label htmlFor="unidade">Unidade</Label>
                            <Input
                              id="unidade"
                              value={novoMaterial.unidade}
                              onChange={(e) => setNovoMaterial({ ...novoMaterial, unidade: e.target.value })}
                              placeholder="kg, m³, un..."
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="valor">Valor Unitário (R$)</Label>
                          <Input
                            id="valor"
                            type="number"
                            value={novoMaterial.valorUnitario}
                            onChange={(e) => setNovoMaterial({ ...novoMaterial, valorUnitario: e.target.value })}
                            placeholder="0,00"
                          />
                        </div>
                        <Button className="w-full">Adicionar Material</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {materiais.map((material) => (
                    <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{material.nome}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2 text-sm text-gray-500">
                          <span>
                            Qtd: {material.quantidade} {material.unidade}
                          </span>
                          <span>Unit: R$ {material.valorUnitario}</span>
                          <span className="font-semibold text-gray-900">
                            Total: R$ {material.valorTotal.toLocaleString()}
                          </span>
                          <span>Data: {material.dataUso}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Gasto em Materiais:</span>
                    <span className="text-xl font-bold text-blue-600">
                      R$ {materiais.reduce((total, material) => total + material.valorTotal, 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fotos">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Fotos da Obra</CardTitle>
                    <CardDescription>Registro fotográfico do progresso da obra</CardDescription>
                  </div>
                  <Button>
                    <Upload className="w-4 h-4 mr-2" />
                    Adicionar Fotos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {fotos.map((foto) => (
                    <div key={foto.id} className="space-y-3">
                      <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <img
                          src={foto.url || "/placeholder.svg"}
                          alt={foto.titulo}
                          className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold">{foto.titulo}</h4>
                        <p className="text-sm text-gray-500">{foto.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
