"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

interface MapInteractiveProps {
  center: { lat: number; lng: number }
  marker?: { lat: number; lng: number }
  onMapClick?: (lat: number, lng: number) => void
  obras?: Array<{
    id: string
    titulo: string
    latitude: number
    longitude: number
    status: "Em Andamento" | "Concluída" | "Atrasada" | "Planejada"
  }>
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

export default function MapInteractive({ center, marker, onMapClick, obras = [] }: MapInteractiveProps) {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current) return

    // Inicializar o mapa se ainda não existir
    if (!mapRef.current) {
      mapRef.current = L.map(mapContainerRef.current).setView([center.lat, center.lng], 13)

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
        })
      }
    }

    // Limpar marcadores existentes
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers()
    }

    // Adicionar marcador principal (nova obra)
    if (marker && markersLayerRef.current) {
      const novaObraIcon = createHardHatIcon("Planejada")

      L.marker([marker.lat, marker.lng], { icon: novaObraIcon })
        .addTo(markersLayerRef.current)
        .bindPopup("<b>Nova Obra</b><br>Localização selecionada")
        .openPopup()
    }

    // Adicionar marcadores de obras existentes
    obras.forEach((obra) => {
      if (markersLayerRef.current) {
        const icon = createHardHatIcon(obra.status)

        L.marker([obra.latitude, obra.longitude], { icon })
          .addTo(markersLayerRef.current)
          .bindPopup(`<b>${obra.titulo}</b><br>Status: ${obra.status}`)
      }
    })

    // Atualizar a visualização do mapa se o centro mudar
    mapRef.current.setView([center.lat, center.lng], 13)

    // Adicionar legenda ao mapa
    const legend = L.control({ position: "bottomleft" })
    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend")
      div.style.backgroundColor = "white"
      div.style.padding = "10px"
      div.style.borderRadius = "5px"
      div.style.boxShadow = "0 0 10px rgba(0,0,0,0.2)"

      div.innerHTML = `
        <h4 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">Legenda</h4>
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <svg width="20" height="20" style="margin-right: 8px;">
            <path d="M1 15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2z" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
            <path d="M8 8V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
            <path d="M3 12v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
          </svg>
          <span style="font-size: 12px;">Em Andamento</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <svg width="20" height="20" style="margin-right: 8px;">
            <path d="M1 15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2z" fill="#22c55e" stroke="white" strokeWidth="0.5"/>
            <path d="M8 8V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" fill="#22c55e" stroke="white" strokeWidth="0.5"/>
            <path d="M3 12v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" fill="#22c55e" stroke="white" strokeWidth="0.5"/>
          </svg>
          <span style="font-size: 12px;">Concluída</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 6px;">
          <svg width="20" height="20" style="margin-right: 8px;">
            <path d="M1 15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2z" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
            <path d="M8 8V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
            <path d="M3 12v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
          </svg>
          <span style="font-size: 12px;">Atrasada</span>
        </div>
        <div style="display: flex; align-items: center;">
          <svg width="20" height="20" style="margin-right: 8px;">
            <path d="M1 15a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v2z" fill="#eab308" stroke="white" strokeWidth="0.5"/>
            <path d="M8 8V4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4" fill="#eab308" stroke="white" strokeWidth="0.5"/>
            <path d="M3 12v-2a5 5 0 0 1 5-5h4a5 5 0 0 1 5 5v2" fill="#eab308" stroke="white" strokeWidth="0.5"/>
          </svg>
          <span style="font-size: 12px;">Planejada</span>
        </div>
      `
      return div
    }
    legend.addTo(mapRef.current)

    // Limpar ao desmontar
    return () => {
      if (mapRef.current && !mapRef.current._isDestroyed) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [center, marker, onMapClick, obras])

  return <div ref={mapContainerRef} className="w-full h-full" style={{ minHeight: "600px" }} />
}
