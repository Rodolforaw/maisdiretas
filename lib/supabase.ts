import { createClient } from "@supabase/supabase-js"

// Verificar se as variáveis de ambiente estão definidas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Criar cliente com fallback para valores vazios (evita erros de build)
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key",
)

// Tipos para o banco de dados
export interface User {
  id: number
  username: string
  password: string
  name: string
  email: string
  cargo: string
  permissions: string[]
  status: string
  avatar: string
  created_at: string
  updated_at: string
}

export interface Ordem {
  id: number
  codigo: string
  titulo: string
  descricao?: string
  distrito?: string
  endereco?: string
  solicitante?: string
  status: string
  prioridade: string
  data_criacao: string
  data_prazo?: string
  latitude?: number
  longitude?: number
  servicos?: string[]
  observacoes?: string
  created_at: string
  updated_at: string
}

export interface Funcionario {
  id: number
  nome: string
  cargo: string
  cpf?: string
  telefone?: string
  email?: string
  status: string
  data_admissao?: string
  salario?: number
  created_at: string
  updated_at: string
}

// Funções de autenticação
export async function authenticateUser(username: string, password: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("username", username)
    .eq("password", password)
    .eq("status", "active")
    .single()

  if (error) {
    console.error("Erro na autenticação:", error)
    return null
  }

  return data
}

// Funções para ordens de serviço
export async function createOrdem(ordemData: Partial<Ordem>) {
  const codigo = generateOSCode()

  const { data, error } = await supabase
    .from("ordens")
    .insert([
      {
        ...ordemData,
        codigo,
        status: ordemData.status || "Rascunho",
        data_criacao: new Date().toISOString(),
      },
    ])
    .select()
    .single()

  if (error) {
    console.error("Erro ao criar ordem:", error)
    throw error
  }

  return data
}

export async function getOrdens() {
  const { data, error } = await supabase.from("ordens").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar ordens:", error)
    throw error
  }

  return data
}

export async function updateOrdem(id: number, updates: Partial<Ordem>) {
  const { data, error } = await supabase
    .from("ordens")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar ordem:", error)
    throw error
  }

  return data
}

export async function deleteOrdem(id: number) {
  const { error } = await supabase.from("ordens").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar ordem:", error)
    throw error
  }
}

// Funções para funcionários
export async function getFuncionarios() {
  const { data, error } = await supabase.from("funcionarios").select("*").order("nome", { ascending: true })

  if (error) {
    console.error("Erro ao buscar funcionários:", error)
    throw error
  }

  return data
}

export async function createFuncionario(funcionarioData: Partial<Funcionario>) {
  const { data, error } = await supabase.from("funcionarios").insert([funcionarioData]).select().single()

  if (error) {
    console.error("Erro ao criar funcionário:", error)
    throw error
  }

  return data
}

export async function updateFuncionario(id: number, updates: Partial<Funcionario>) {
  const { data, error } = await supabase
    .from("funcionarios")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  if (error) {
    console.error("Erro ao atualizar funcionário:", error)
    throw error
  }

  return data
}

export async function deleteFuncionario(id: number) {
  const { error } = await supabase.from("funcionarios").delete().eq("id", id)

  if (error) {
    console.error("Erro ao deletar funcionário:", error)
    throw error
  }
}

// Função para gerar código de OS
function generateOSCode() {
  const currentYear = new Date().getFullYear().toString().slice(-2)
  const sequence = Math.floor(Math.random() * 999999) + 1
  return `${currentYear}${sequence.toString().padStart(6, "0")}`
}

// Funções de busca
export async function searchOrdens(searchTerm: string) {
  const { data, error } = await supabase
    .from("ordens")
    .select("*")
    .or(`titulo.ilike.%${searchTerm}%,codigo.ilike.%${searchTerm}%,distrito.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro na busca:", error)
    throw error
  }

  return data
}

export async function getOrdensByStatus(status: string) {
  const { data, error } = await supabase
    .from("ordens")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Erro ao buscar ordens por status:", error)
    throw error
  }

  return data
}

// Função para verificar conexão
export async function checkSupabaseConnection() {
  try {
    const { data, error } = await supabase.from("users").select("count").limit(1)
    if (error) throw error
    return { success: true, message: "Conexão com Supabase estabelecida" }
  } catch (error) {
    console.error("Erro na conexão com Supabase:", error)
    return { success: false, message: "Falha na conexão com Supabase", error }
  }
}
