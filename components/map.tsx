"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapProps {
  markers?: Array<{
    nome: string
    latitude: number
    longitude: number
    status?: "Em Andamento" | "Concluída" | "Atrasada" | "Planejada"
  }>
  center?: [number, number]
  zoom?: number
  onMarkerClick?: (marker: any) => void
  onMapClick?: (lat: number, lng: number) => void
  height?: string
  selectedLocation?: { lat: number; lng: number } | null
  setSelectedLocation?: (location: { lat: number; lng: number } | null) => void
}

// Função para criar um ícone de capacete personalizado com a cor baseada no status
const createHardHatIcon = (status = "Em Andamento") => {
  // Definir a cor baseada no status
  let color = "#3b82f6" // Azul (Em Andamento - padrão)

  switch (status) {
    case "Concluída":
      color = "#22c55e" // Verde
      break
    case "Atrasada":
      color = "#ef4444" // Vermelho
      break
    case "Planejada":
      color = "#eab308" // Amarelo
      break
  }

  // Criar um elemento SVG para o ícone do capacete com preenchimento
  const svgTemplate = `
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 18a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v2z"></path>
      <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"></path>
      <path d="M4 15v-3a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v3"></path>
    </svg>
  `

  // Converter SVG para Base64
  const svgBase64 = btoa(svgTemplate)

  // Criar o ícone personalizado sem círculo
  return L.divIcon({
    html: `<div style="display: flex; flex-direction: column; align-items: center;">
            <img src="data:image/svg+xml;base64,${svgBase64}" width="32" height="32" style="filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));" />
          </div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })
}

export default function Map({
  markers = [],
  center = [-22.9068, -43.1729], // Rio de Janeiro como padrão
  zoom = 12,
  onMarkerClick,
  onMapClick,
  height = "500px",
  selectedLocation,
  setSelectedLocation,
}: MapProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Inicializar o mapa se ainda não existir
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView(center, zoom)

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapRef.current)

      // Criar uma camada para os marcadores
      markersLayerRef.current = L.layerGroup().addTo(mapRef.current)

      // Adicionar evento de clique no mapa
      if (onMapClick) {
        mapRef.current.on("click", (e) => {
          const { lat, lng } = e.latlng
          onMapClick(lat, lng)

          // Se tiver a função para atualizar a localização selecionada
          if (setSelectedLocation) {
            setSelectedLocation({ lat, lng })
          }
        })
      }
    }

    // Limpar marcadores existentes
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers()
    }

    // Adicionar marcadores
    markers.forEach((marker) => {
      const { latitude, longitude, nome, status = "Em Andamento" } = marker

      // Usar o ícone personalizado baseado no status
      const icon = createHardHatIcon(status)

      const leafletMarker = L.marker([latitude, longitude], { icon })
        .addTo(markersLayerRef.current!)
        .bindPopup(`<b>${nome}</b><br>Status: ${status}`)

      if (onMarkerClick) {
        leafletMarker.on("click", () => onMarkerClick(marker))
      }
    })

    // Adicionar marcador para a localização selecionada
    if (selectedLocation && markersLayerRef.current) {
      const selectedIcon = createHardHatIcon("Planejada")

      L.marker([selectedLocation.lat, selectedLocation.lng], { icon: selectedIcon })
        .addTo(markersLayerRef.current)
        .bindPopup("Localização selecionada")
        .openPopup()
    }

    // Atualizar a visualização do mapa se o centro ou zoom mudar
    mapRef.current.setView(center, zoom)

    // Limpar ao desmontar
    return () => {
      if (mapRef.current && !mapRef.current._isDestroyed) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [markers, center, zoom, onMarkerClick, onMapClick, selectedLocation, setSelectedLocation])

  return <div ref={mapContainerRef} style={{ height, width: "100%" }} />
}
