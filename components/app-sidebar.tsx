"use client"

import {
  HardHat,
  BarChart3,
  MapPin,
  Settings,
  Camera,
  LogOut,
  Waves,
  ClipboardList,
  Truck,
  TrendingUp,
  Briefcase,
  FileSpreadsheet,
  ShoppingBasket,
  List,
  ListChecks,
  Tag,
  Wrench,
  Edit,
  BookIcon as AddressBook,
  Network,
  Sliders,
  MapIcon as MapSigns,
  Scale,
  ShoppingCart,
  SortDesc,
  Info,
  Gauge,
  TestTube,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

interface AppSidebarProps {
  user: {
    name: string
    email: string
    cargo: string
    avatar: string
    isTestMode?: boolean
  }
}

export function AppSidebar({ user }: AppSidebarProps) {
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  // Menu baseado no SIGELU original
  const menuSections = [
    {
      title: "",
      items: [
        {
          title: "Mapa Operacional",
          url: "/mapa",
          icon: MapPin,
          external: false,
        },
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: Gauge,
        },
        {
          title: "Mural de Acompanhamento",
          url: "/mural",
          icon: Camera,
          external: false,
        },
      ],
    },
    {
      title: "ACOMPANHAMENTO DE OBRAS",
      items: [
        {
          title: "Ordens de Serviço",
          url: "/ordens",
          icon: ClipboardList,
        },
        {
          title: "Obras",
          url: "/obras",
          icon: HardHat,
        },
        {
          title: "Performance",
          url: "/performance",
          icon: TrendingUp,
        },
        {
          title: "Encarregados",
          url: "/encarregados",
          icon: Briefcase,
        },
        {
          title: "Análises de Produtividade",
          url: "/analise-produtividade",
          icon: BarChart3,
        },
      ],
    },
    {
      title: "GERÊNCIA",
      items: [
        {
          title: "Relatório Resumido",
          url: "/relatorio/resumido",
          icon: FileSpreadsheet,
        },
        {
          title: "Relatório com Estatísticas",
          url: "/relatorio/estatisticas",
          icon: FileSpreadsheet,
        },
        {
          title: "Relatório Detalhado",
          url: "/relatorio/detalhado",
          icon: FileSpreadsheet,
        },
        {
          title: "Relatório por Insumo",
          url: "/relatorio/insumo",
          icon: FileSpreadsheet,
        },
        {
          title: "Relatório com Materiais",
          url: "/relatorio/material",
          icon: FileSpreadsheet,
        },
      ],
    },
    {
      title: "ADMINISTRATIVO",
      items: [
        {
          title: "Equipamentos",
          url: "/equipamentos",
          icon: Truck,
        },
        {
          title: "Materiais",
          url: "/materiais",
          icon: ShoppingBasket,
        },
        {
          title: "Produtos",
          url: "/produtos",
          icon: List,
        },
        {
          title: "Categorias de Produtos",
          url: "/categoria-produto",
          icon: ListChecks,
        },
        {
          title: "Cargos",
          url: "/cargos",
          icon: Tag,
        },
        {
          title: "Funcionários",
          url: "/funcionarios",
          icon: Wrench,
        },
        {
          title: "Responsáveis Técnicos",
          url: "/responsaveis",
          icon: Edit,
        },
        {
          title: "Solicitantes",
          url: "/solicitantes",
          icon: AddressBook,
        },
        {
          title: "Tipos de OS",
          url: "/tipos-os",
          icon: Network,
        },
        {
          title: "Serviços",
          url: "/servicos",
          icon: Sliders,
        },
        {
          title: "Núcleos",
          url: "/nucleos",
          icon: MapSigns,
        },
        {
          title: "Unidades de Medida",
          url: "/unidades-medida",
          icon: Scale,
        },
        {
          title: "Unidades Alternativas",
          url: "/unidades-alternativas",
          icon: ShoppingCart,
        },
        {
          title: "Fatores de Conversão",
          url: "/fatores-conversao",
          icon: SortDesc,
        },
      ],
    },
  ]

  return (
    <Sidebar className="border-r border-gray-200 bg-gray-900 text-white">
      <SidebarHeader className="border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3 px-3 py-4">
          <div className="bg-blue-600 p-2 rounded-lg">
            <HardHat className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-white">SOMAR</h2>
            <p className="text-xs text-gray-300">+Diretas</p>
          </div>
          {user.isTestMode && (
            <Badge variant="secondary" className="bg-red-600 text-white border-red-500">
              <TestTube className="h-3 w-3 mr-1" />
              Teste
            </Badge>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-gray-900">
        {menuSections.map((section, index) => (
          <SidebarGroup key={index}>
            {section.title && (
              <SidebarGroupLabel className="text-gray-400 font-semibold text-xs uppercase tracking-wider px-3 py-2">
                {section.title}
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className="text-gray-300 hover:bg-gray-800 hover:text-white data-[active=true]:bg-blue-600 data-[active=true]:text-white px-3 py-2 text-sm"
                    >
                      <a href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarSeparator className="bg-gray-700" />

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="text-gray-300 hover:bg-gray-800 hover:text-white px-3 py-2 text-sm"
                >
                  <a href="/sobre">
                    <Info className="h-4 w-4" />
                    <span>Sobre</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-700 bg-gray-900">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="w-full hover:bg-gray-800 text-gray-300">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                    <AvatarFallback className="bg-blue-600 text-white">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="text-sm font-medium text-white">{user.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 capitalize">{user.cargo}</span>
                      {user.isTestMode && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-4 border-red-400 text-red-400">
                          Teste
                        </Badge>
                      )}
                    </div>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-56">
                {user.cargo === "admin" && (
                  <>
                    <DropdownMenuItem asChild>
                      <a href="/admin" className="flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Administração</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>

        <div className="px-3 py-2">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Waves className="h-3 w-3 text-blue-500" />
            <span>Maricá - RJ</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
