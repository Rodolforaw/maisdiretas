"use client";

import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import L from "leaflet";
import "leaflet-draw";
import { useEffect, useRef } from "react";

export default function MapDrawing() {
  const mapRef = useRef<HTMLDivElement>(null);
  let map: L.Map | null = null;

  useEffect(() => {
    if (!mapRef.current || map) return;

    map = L.map(mapRef.current).setView([-22.935, -42.824], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      draw: {
        polyline: true,
        polygon: true,
        rectangle: true,
        circle: false,
        marker: true,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });
    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, function (event: any) {
      drawnItems.addLayer(event.layer);
    });
  }, []);

  return (
    <div className="h-[80vh] rounded-xl overflow-hidden border border-gray-300 shadow">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
}
