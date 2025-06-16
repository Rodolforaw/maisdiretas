"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MapPin, Search } from "lucide-react"
import dynamic from "next/dynamic"

const Map = dynamic(() => import("@/components/map"), {
  ssr: false,
  loading: () => <p>Carregando mapa...</p>,
})

interface MapLocationProps {
  onLocationSelect?: (location: { lat: number; lng: number; address?: string }) => void
  initialLocation?: { lat: number; lng: number }
}

export default function MapLocation({ onLocationSelect, initialLocation }: MapLocationProps) {
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(initialLocation || null)
  const [address, setAddress] = useState("")
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Função para buscar endereço usando a API Nominatim do OpenStreetMap
  const searchAddress = async () => {
    if (!address.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5`,
      )
      const data = await response.json()
      setSearchResults(data)
    } catch (error) {
      console.error("Erro ao buscar endereço:", error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  // Função para selecionar um resultado da busca
  const selectSearchResult = (result: any) => {
    const location = {
      lat: Number.parseFloat(result.lat),
      lng: Number.parseFloat(result.lon),
      address: result.display_name,
    }
    setSelectedLocation({ lat: location.lat, lng: location.lng })
    setSearchResults([])

    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }

  // Função para lidar com clique no mapa
  const handleMapClick = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng })

    if (onLocationSelect) {
      onLocationSelect({ lat, lng })
    }
  }

  // Função para confirmar a localização selecionada
  const confirmLocation = () => {
    if (selectedLocation && onLocationSelect) {
      onLocationSelect(selectedLocation)
    }
  }

  return (
    <Card className="shadow-md border-blue-100">
      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Buscar endereço</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="address"
                placeholder="Digite um endereço..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="pl-10 border-blue-200"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    searchAddress()
                  }
                }}
              />
            </div>
            <Button onClick={searchAddress} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
              {isSearching ? "Buscando..." : "Buscar"}
            </Button>
          </div>

          {/* Resultados da busca */}
          {searchResults.length > 0 && (
            <div className="mt-2 border border-blue-100 rounded-md overflow-hidden">
              <ul className="divide-y divide-blue-100">
                {searchResults.map((result, index) => (
                  <li
                    key={index}
                    className="p-3 hover:bg-blue-50 cursor-pointer flex items-start gap-2"
                    onClick={() => selectSearchResult(result)}
                  >
                    <MapPin className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{result.display_name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="h-[400px] w-full border border-blue-100 rounded-md overflow-hidden">
          <Map
            markers={
              selectedLocation
                ? [
                    {
                      nome: "Localização Selecionada",
                      latitude: selectedLocation.lat,
                      longitude: selectedLocation.lng,
                      status: "Planejada",
                    },
                  ]
                : []
            }
            center={
              selectedLocation ? [selectedLocation.lat, selectedLocation.lng] : [-22.9068, -43.1729] // Rio de Janeiro como padrão
            }
            zoom={15}
            onMapClick={handleMapClick}
            height="400px"
          />
        </div>

        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {selectedLocation ? (
              <span>
                Localização selecionada: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </span>
            ) : (
              <span>Clique no mapa para selecionar uma localização</span>
            )}
          </div>
          <Button onClick={confirmLocation} disabled={!selectedLocation} className="bg-blue-600 hover:bg-blue-700">
            <MapPin className="h-4 w-4 mr-2" />
            Confirmar Localização
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
