"use client";

import React, { useMemo, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  AttributionControl,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { TbPackage, TbPlus, TbMinus, TbFocus2 } from "react-icons/tb";
import type { Delivery, Driver, GeoPoint } from "@/lib/types";
import { useTheme } from "@/lib/ThemeContext";

// The mock data models positions as an abstract 0-100 grid (see GeoPoint in
// lib/types.ts). To render on a real basemap we project that grid onto a
// real downtown bounding box, so drivers and deliveries land on actual
// streets instead of floating over a blank canvas.
const BOUNDS = {
  north: 41.911,
  south: 41.868,
  west: -87.655,
  east: -87.607,
};
const CENTER: [number, number] = [
  (BOUNDS.north + BOUNDS.south) / 2,
  (BOUNDS.west + BOUNDS.east) / 2,
];
const DEFAULT_ZOOM = 14;

function toLatLng(p: GeoPoint): [number, number] {
  const lat = BOUNDS.north - (p.y / 100) * (BOUNDS.north - BOUNDS.south);
  const lng = BOUNDS.west + (p.x / 100) * (BOUNDS.east - BOUNDS.west);
  return [lat, lng];
}

// Approximates the same gentle "arc" the old abstract map drew between an
// origin and destination, but as a sampled quadratic bezier in lat/lng space
// so it still reads as a real route on the tile layer.
function curvedRoute(origin: GeoPoint, destination: GeoPoint): [number, number][] {
  const [oLat, oLng] = toLatLng(origin);
  const [dLat, dLng] = toLatLng(destination);
  const midLat = (oLat + dLat) / 2;
  const midLng = (oLng + dLng) / 2;
  const dx = dLng - oLng;
  const dy = dLat - oLat;
  const controlLat = midLat + dx * 0.18;
  const controlLng = midLng - dy * 0.18;

  const steps = 20;
  const points: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lat = (1 - t) ** 2 * oLat + 2 * (1 - t) * t * controlLat + t ** 2 * dLat;
    const lng = (1 - t) ** 2 * oLng + 2 * (1 - t) * t * controlLng + t ** 2 * dLng;
    points.push([lat, lng]);
  }
  return points;
}

function driverIcon(driver: Driver, selected: boolean): L.DivIcon {
  const html = renderToStaticMarkup(
    <div style={{ position: "relative", width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center" }}>
      {driver.status === "On route" && (
        <span
          style={{
            position: "absolute",
            width: 26,
            height: 26,
            borderRadius: "9999px",
            background: driver.avatarColor,
            animation: "pulse-ring 1.8s cubic-bezier(0.4,0,0.6,1) infinite",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 26,
          height: 26,
          borderRadius: "9999px",
          border: selected ? "2px solid var(--ink)" : "2px solid var(--surface)",
          background: driver.avatarColor,
          color: "#fff",
          fontSize: 10,
          fontWeight: 700,
          boxShadow: "0 2px 6px rgba(0,0,0,0.35)",
          transform: selected ? "scale(1.15)" : "scale(1)",
        }}
      >
        {driver.initials}
      </div>
    </div>
  );
  return L.divIcon({
    html,
    className: "fleetflow-driver-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });
}

function deliveryIcon(): L.DivIcon {
  const html = renderToStaticMarkup(
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        width: 16,
        height: 16,
        borderRadius: 4,
        background: "color-mix(in oklab, var(--signal) 20%, transparent)",
        border: "1px solid color-mix(in oklab, var(--signal) 50%, transparent)",
        color: "var(--signal)",
        boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
      }}
    >
      <TbPackage size={9} />
    </div>
  );
  return L.divIcon({
    html,
    className: "fleetflow-delivery-marker",
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function ZoomWatcher({ onZoomChange }: { onZoomChange: (z: number) => void }) {
  useMapEvents({
    zoomend: (e) => onZoomChange(e.target.getZoom()),
  });
  return null;
}

function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute bottom-3 right-3 z-[500] flex flex-col overflow-hidden rounded-lg border border-border bg-surface/90 shadow-sm backdrop-blur">
      <button
        onClick={() => map.zoomIn()}
        className="cursor-pointer border-b border-border p-2.5 text-muted transition-colors hover:text-ink"
        aria-label="Zoom in"
      >
        <TbPlus className="text-[15px]" />
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="cursor-pointer border-b border-border p-2.5 text-muted transition-colors hover:text-ink"
        aria-label="Zoom out"
      >
        <TbMinus className="text-[15px]" />
      </button>
      <button
        onClick={() => map.flyTo(CENTER, DEFAULT_ZOOM, { duration: 0.6 })}
        className="cursor-pointer p-2.5 text-muted transition-colors hover:text-ink"
        aria-label="Reset view"
      >
        <TbFocus2 className="text-[15px]" />
      </button>
    </div>
  );
}

interface LeafletMapProps {
  drivers: Driver[];
  activeDeliveries: Delivery[];
  showDrivers: boolean;
  showDeliveries: boolean;
  selectedDriverId: string | null;
  onSelectDriver: (id: string) => void;
}

export default function LeafletMap({
  drivers,
  activeDeliveries,
  showDrivers,
  showDeliveries,
  selectedDriverId,
  onSelectDriver,
}: LeafletMapProps) {
  const { theme } = useTheme();
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);

  const tileUrl =
    theme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

  const routes = useMemo(
    () =>
      showDeliveries
        ? activeDeliveries.slice(0, 10).map((d) => ({ id: d.id, points: curvedRoute(d.origin, d.destinationPoint) }))
        : [],
    [showDeliveries, activeDeliveries]
  );

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={CENTER}
        zoom={DEFAULT_ZOOM}
        minZoom={12}
        maxZoom={18}
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          key={theme}
          url={tileUrl}
          subdomains="abcd"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        <AttributionControl position="bottomleft" prefix={false} />
        <ZoomWatcher onZoomChange={setZoom} />
        <ZoomControls />

        {routes.map((r) => (
          <Polyline
            key={r.id}
            positions={r.points}
            pathOptions={{
              color: "#FF7A1A",
              weight: 2.5,
              opacity: 0.55,
              dashArray: "6 8",
              className: "animate-dash-move",
            }}
          />
        ))}

        {showDeliveries &&
          activeDeliveries.map((d) => (
            <Marker
              key={d.id}
              position={toLatLng(d.destinationPoint)}
              icon={deliveryIcon()}
              zIndexOffset={100}
            />
          ))}

        {showDrivers &&
          drivers.map((d) => (
            <Marker
              key={d.id}
              position={toLatLng(d.position)}
              icon={driverIcon(d, d.id === selectedDriverId)}
              eventHandlers={{ click: () => onSelectDriver(d.id) }}
              zIndexOffset={200}
            />
          ))}
      </MapContainer>

      <div className="pointer-events-none absolute bottom-3 left-3 z-[500] rounded-lg border border-border bg-surface/90 px-3 py-1.5 text-[11px] font-medium text-faint shadow-sm backdrop-blur">
        Zoom {zoom}
      </div>
    </div>
  );
}
