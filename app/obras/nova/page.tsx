"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

const distritos = ["Centro", "Inoã", "Itaipuaçu", "Ponta Negra", "São José do Imbassaí", "Guaratiba", "Cordeirinho"]

const encarregados = ["João Silva", "Maria Santos", "Carlos Oliveira", "Ana Costa", "Pedro Ferreira", "Lucia Almeida"]

export default function NovaObra() {
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    distrito: "",
    endereco: "",
    encarregado: "",
    dataInicio: "",
    previsaoTermino: "",
    orcamento: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aqui você implementaria a lógica para salvar a obra
    console.log("Dados da obra:", formData)
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

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
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Nova Obra</h1>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Informações da Obra</CardTitle>
              <CardDescription>Preencha os dados para criar uma nova ordem de serviço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="titulo">Título da Obra *</Label>
                  <Input
                    id="titulo"
                    value={formData.titulo}
                    onChange={(e) => handleChange("titulo", e.target.value)}
                    placeholder="Ex: Pavimentação Rua das Flores"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    value={formData.descricao}
                    onChange={(e) => handleChange("descricao", e.target.value)}
                    placeholder="Descreva os detalhes da obra..."
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="distrito">Distrito *</Label>
                  <Select value={formData.distrito} onValueChange={(value) => handleChange("distrito", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o distrito" />
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
                  <Label htmlFor="encarregado">Encarregado *</Label>
                  <Select value={formData.encarregado} onValueChange={(value) => handleChange("encarregado", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o encarregado" />
                    </SelectTrigger>
                    <SelectContent>
                      {encarregados.map((encarregado) => (
                        <SelectItem key={encarregado} value={encarregado}>
                          {encarregado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="endereco">Endereço Completo *</Label>
                  <Input
                    id="endereco"
                    value={formData.endereco}
                    onChange={(e) => handleChange("endereco", e.target.value)}
                    placeholder="Ex: Rua das Flores, 100 - Centro, Maricá/RJ"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dataInicio">Data de Início *</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={formData.dataInicio}
                    onChange={(e) => handleChange("dataInicio", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="previsaoTermino">Previsão de Término *</Label>
                  <Input
                    id="previsaoTermino"
                    type="date"
                    value={formData.previsaoTermino}
                    onChange={(e) => handleChange("previsaoTermino", e.target.value)}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="orcamento">Orçamento Total (R$) *</Label>
                  <Input
                    id="orcamento"
                    type="number"
                    value={formData.orcamento}
                    onChange={(e) => handleChange("orcamento", e.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6">
                <Link href="/">
                  <Button variant="outline">Cancelar</Button>
                </Link>
                <Button type="submit">
                  <Save className="w-4 h-4 mr-2" />
                  Criar Obra
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
