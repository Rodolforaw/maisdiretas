"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { MessageSquare, Send, Inbox, Mail, MailOpen, Clock, User, AlertCircle, CheckCircle2, X } from "lucide-react"

interface Message {
  id: number
  remetente: string
  destinatario: string
  assunto: string
  mensagem: string
  timestamp: string
  lida: boolean
  urgente: boolean
  tipo: "direct" | "broadcast" | "system"
}

interface MessageCenterProps {
  currentUser: string
}

export function MessageCenter({ currentUser }: MessageCenterProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [showCompose, setShowCompose] = useState(false)
  const [filter, setFilter] = useState<"all" | "unread" | "urgent">("all")

  // Estados para nova mensagem
  const [novaMensagem, setNovaMensagem] = useState({
    destinatario: "",
    assunto: "",
    mensagem: "",
    urgente: false,
  })

  // Lista de usuários disponíveis
  const usuarios = [
    { username: "admin", name: "Administrador" },
    { username: "gerente01", name: "João Silva" },
    { username: "supervisor01", name: "Maria Santos" },
    { username: "encarregado01", name: "Carlos Oliveira" },
  ]

  useEffect(() => {
    carregarMensagens()
  }, [currentUser])

  const carregarMensagens = () => {
    // Simular carregamento de mensagens
    const mensagensSimuladas: Message[] = [
      {
        id: 1,
        remetente: "admin",
        destinatario: currentUser,
        assunto: "Reunião de Planejamento",
        mensagem: "Reunião marcada para amanhã às 14h na sala de reuniões. Favor confirmar presença.",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        lida: false,
        urgente: true,
        tipo: "direct",
      },
      {
        id: 2,
        remetente: "gerente01",
        destinatario: currentUser,
        assunto: "Relatório Mensal",
        mensagem: "O relatório mensal está disponível no sistema. Favor revisar os dados da sua área.",
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        lida: true,
        urgente: false,
        tipo: "direct",
      },
      {
        id: 3,
        remetente: "system",
        destinatario: currentUser,
        assunto: "Atualização do Sistema",
        mensagem:
          "O sistema será atualizado no próximo domingo das 2h às 6h. Durante este período, o acesso estará indisponível.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        lida: true,
        urgente: false,
        tipo: "system",
      },
    ]

    setMessages(mensagensSimuladas)
  }

  const enviarMensagem = () => {
    if (!novaMensagem.destinatario || !novaMensagem.assunto || !novaMensagem.mensagem) {
      return
    }

    const mensagem: Message = {
      id: Date.now(),
      remetente: currentUser,
      destinatario: novaMensagem.destinatario,
      assunto: novaMensagem.assunto,
      mensagem: novaMensagem.mensagem,
      timestamp: new Date().toISOString(),
      lida: false,
      urgente: novaMensagem.urgente,
      tipo: "direct",
    }

    // Simular envio
    console.log("Mensagem enviada:", mensagem)

    // Limpar formulário
    setNovaMensagem({
      destinatario: "",
      assunto: "",
      mensagem: "",
      urgente: false,
    })

    setShowCompose(false)
  }

  const marcarComoLida = (messageId: number) => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, lida: true } : msg)))
  }

  const filteredMessages = messages.filter((msg) => {
    if (filter === "unread") return !msg.lida
    if (filter === "urgent") return msg.urgente
    return true
  })

  const unreadCount = messages.filter((msg) => !msg.lida).length
  const urgentCount = messages.filter((msg) => msg.urgente && !msg.lida).length

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Agora"
    if (diffInHours < 24) return `${diffInHours}h atrás`
    if (diffInHours < 48) return "Ontem"
    return date.toLocaleDateString("pt-BR")
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
      {/* Lista de Mensagens */}
      <div className="lg:col-span-1">
        <Card className="h-full">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Inbox className="h-5 w-5" />
                Mensagens
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </CardTitle>
              <Dialog open={showCompose} onOpenChange={setShowCompose}>
                <DialogTrigger asChild>
                  <Button size="sm">
                    <Send className="h-4 w-4 mr-2" />
                    Nova
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Nova Mensagem</DialogTitle>
                    <DialogDescription>Envie uma mensagem para outro usuário</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="destinatario">Destinatário</Label>
                      <Select
                        value={novaMensagem.destinatario}
                        onValueChange={(value) => setNovaMensagem((prev) => ({ ...prev, destinatario: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o destinatário" />
                        </SelectTrigger>
                        <SelectContent>
                          {usuarios
                            .filter((u) => u.username !== currentUser)
                            .map((usuario) => (
                              <SelectItem key={usuario.username} value={usuario.username}>
                                {usuario.name} (@{usuario.username})
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="assunto">Assunto</Label>
                      <Input
                        id="assunto"
                        value={novaMensagem.assunto}
                        onChange={(e) => setNovaMensagem((prev) => ({ ...prev, assunto: e.target.value }))}
                        placeholder="Assunto da mensagem"
                      />
                    </div>

                    <div>
                      <Label htmlFor="mensagem">Mensagem</Label>
                      <Textarea
                        id="mensagem"
                        value={novaMensagem.mensagem}
                        onChange={(e) => setNovaMensagem((prev) => ({ ...prev, mensagem: e.target.value }))}
                        placeholder="Digite sua mensagem..."
                        rows={4}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="urgente"
                        checked={novaMensagem.urgente}
                        onChange={(e) => setNovaMensagem((prev) => ({ ...prev, urgente: e.target.checked }))}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="urgente" className="text-sm">
                        Mensagem urgente
                      </Label>
                    </div>

                    <div className="flex gap-2">
                      <Button onClick={enviarMensagem} className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                      <Button variant="outline" onClick={() => setShowCompose(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex gap-2">
              <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
                Todas
              </Button>
              <Button
                variant={filter === "unread" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("unread")}
              >
                Não lidas {unreadCount > 0 && `(${unreadCount})`}
              </Button>
              <Button
                variant={filter === "urgent" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter("urgent")}
              >
                Urgentes {urgentCount > 0 && `(${urgentCount})`}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1 p-3">
                {filteredMessages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?.id === message.id ? "bg-blue-50 border-blue-200 border" : "hover:bg-gray-50"
                    } ${!message.lida ? "bg-blue-25 border-l-4 border-l-blue-500" : ""}`}
                    onClick={() => {
                      setSelectedMessage(message)
                      if (!message.lida) {
                        marcarComoLida(message.id)
                      }
                    }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {message.lida ? (
                            <MailOpen className="h-4 w-4 text-gray-400" />
                          ) : (
                            <Mail className="h-4 w-4 text-blue-600" />
                          )}
                          <span className={`text-sm truncate ${!message.lida ? "font-semibold" : ""}`}>
                            {usuarios.find((u) => u.username === message.remetente)?.name || message.remetente}
                          </span>
                          {message.urgente && <AlertCircle className="h-4 w-4 text-red-500" />}
                        </div>
                        <p className={`text-sm truncate mt-1 ${!message.lida ? "font-medium" : "text-gray-600"}`}>
                          {message.assunto}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 truncate">{message.mensagem}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs text-gray-500">{formatTimestamp(message.timestamp)}</span>
                        {message.tipo === "system" && (
                          <Badge variant="outline" className="text-xs">
                            Sistema
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredMessages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhuma mensagem encontrada</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Visualização da Mensagem */}
      <div className="lg:col-span-2">
        <Card className="h-full">
          {selectedMessage ? (
            <>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">
                        {usuarios.find((u) => u.username === selectedMessage.remetente)?.name ||
                          selectedMessage.remetente}
                      </span>
                      {selectedMessage.urgente && (
                        <Badge variant="destructive" className="text-xs">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Urgente
                        </Badge>
                      )}
                      {selectedMessage.tipo === "system" && (
                        <Badge variant="outline" className="text-xs">
                          Sistema
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold">{selectedMessage.assunto}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(selectedMessage.timestamp).toLocaleString("pt-BR")}</span>
                      {selectedMessage.lida && (
                        <div className="flex items-center gap-1 ml-4">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>Lida</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{selectedMessage.mensagem}</p>
                </div>

                <div className="mt-6 pt-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Send className="h-4 w-4 mr-2" />
                      Responder
                    </Button>
                    <Button variant="outline" size="sm">
                      Encaminhar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">Selecione uma mensagem</p>
                <p className="text-sm">Clique em uma mensagem da lista para visualizar</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
