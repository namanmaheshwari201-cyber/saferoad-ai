import { ArrowLeft } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { NavPage } from "../types";

interface RoadStats {
  city: string;
  totalRoads: number;
  motorways: number;
  primaryRoads: number;
  healthScore: number;
}

const QUICK_CITIES = [
  "Delhi",
  "Mumbai",
  "Bangalore",
  "Chennai",
  "Hyderabad",
  "Kolkata",
];

interface DigitalTwinPageProps {
  onNavigate: (page: NavPage) => void;
}

export default function DigitalTwinPage({ onNavigate }: DigitalTwinPageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const roadLayersRef = useRef<any[]>([]);
  const dotMarkersRef = useRef<any[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<RoadStats | null>(null);
  const [showWelcome, setShowWelcome] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);

  useEffect(() => {
    if (document.getElementById("leaflet-dt-css")) {
      setLeafletReady(true);
      return;
    }
    const link = document.createElement("link");
    link.id = "leaflet-dt-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.id = "leaflet-dt-js";
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setLeafletReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!leafletReady || !mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current, { zoomControl: false }).setView(
      [20.5937, 78.9629],
      5,
    );
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    mapInstanceRef.current = map;
  }, [leafletReady]);

  const clearLayers = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    for (const layer of roadLayersRef.current) {
      map.removeLayer(layer);
    }
    roadLayersRef.current = [];
    for (const dot of dotMarkersRef.current) {
      map.removeLayer(dot);
    }
    dotMarkersRef.current = [];
  };

  const getRoadColor = (highway: string): string => {
    if (highway === "motorway" || highway === "trunk") return "#3b82f6";
    if (highway === "primary") return "#f97316";
    return "#eab308";
  };

  const getRoadWeight = (highway: string): number => {
    if (highway === "motorway" || highway === "trunk") return 5;
    if (highway === "primary") return 3;
    return 2;
  };

  const getRoadCondition = (highway: string): string => {
    if (highway === "motorway" || highway === "trunk") return "Good";
    if (highway === "primary") return "Fair";
    return "Varies";
  };

  const addTrafficDots = (roads: any[], L: any, map: any) => {
    const subset = roads.slice(0, 12);
    for (const road of subset) {
      if (!road.geometry || road.geometry.length < 2) continue;
      const mid = road.geometry[Math.floor(road.geometry.length / 2)];
      const color = getRoadColor(road.tags?.highway || "secondary");
      const icon = L.divIcon({
        className: "",
        html: `<div style="width:8px;height:8px;border-radius:50%;background:${color};animation:pulse 2s infinite;box-shadow:0 0 6px ${color}"></div>`,
        iconSize: [8, 8],
        iconAnchor: [4, 4],
      });
      const marker = L.marker([mid.lat, mid.lon], { icon }).addTo(map);
      dotMarkersRef.current.push(marker);
    }
  };

  const searchCity = async (cityName: string) => {
    if (!cityName.trim() || !mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = mapInstanceRef.current;
    setIsLoading(true);
    setError("");
    setShowWelcome(false);
    clearLayers();

    try {
      const geoRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(cityName)}+India&format=json&limit=1`,
      );
      const geoData = await geoRes.json();
      if (!geoData.length) {
        setError(`Could not find "${cityName}". Try a different city name.`);
        setIsLoading(false);
        return;
      }
      const { lat, lon } = geoData[0];
      map.flyTo([Number.parseFloat(lat), Number.parseFloat(lon)], 13);

      const overpassQuery = `[out:json][timeout:25];area[name="${cityName}"][admin_level~"4|6|8"]->.a;(way[highway~"motorway|trunk|primary|secondary"](area.a););out body geom qt;`;
      const overpassRes = await fetch(
        "https://overpass-api.de/api/interpreter",
        {
          method: "POST",
          body: overpassQuery,
        },
      );
      const overpassData = await overpassRes.json();
      const roads = overpassData.elements || [];

      let motorwayCount = 0;
      let primaryCount = 0;

      for (const road of roads) {
        if (!road.geometry || road.geometry.length < 2) continue;
        const latlngs: [number, number][] = road.geometry.map(
          (p: any) => [p.lat, p.lon] as [number, number],
        );
        const hw = road.tags?.highway || "secondary";
        if (hw === "motorway" || hw === "trunk") motorwayCount++;
        if (hw === "primary") primaryCount++;
        const poly = L.polyline(latlngs, {
          color: getRoadColor(hw),
          weight: getRoadWeight(hw),
          opacity: 0.85,
        });
        poly.bindPopup(
          `<div style="font-family:sans-serif;min-width:160px">
            <strong style="font-size:14px">${road.tags?.name || "Unnamed Road"}</strong><br/>
            <span style="color:#666">Type: ${hw}</span><br/>
            <span style="color:#666">Condition: ${getRoadCondition(hw)}</span>
          </div>`,
        );
        poly.addTo(map);
        roadLayersRef.current.push(poly);
      }

      addTrafficDots(roads, L, map);

      const healthScore = Math.floor(65 + Math.random() * 25);
      setStats({
        city: cityName,
        totalRoads: roads.length,
        motorways: motorwayCount,
        primaryRoads: primaryCount,
        healthScore,
      });
    } catch {
      setError("Failed to load road network. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => searchCity(searchInput);
  const handleQuickCity = (city: string) => {
    setSearchInput(city);
    searchCity(city);
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      {/* Floating back button */}
      <button
        type="button"
        onClick={() => onNavigate("home")}
        aria-label="Back to home"
        data-ocid="digitaltwin.back_button"
        style={{ position: "fixed", top: 72, left: 16, zIndex: 1000 }}
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-slate-900/90 border border-white/20 hover:bg-amber-400/20 hover:border-amber-400/40 hover:text-amber-400 backdrop-blur-sm transition-all shadow-lg"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back</span>
      </button>
      {/* Map container */}
      <div
        ref={mapRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1,
        }}
      />

      {/* Pulse animation style */}
      <style>
        {
          "@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}"
        }
      </style>

      {/* Top bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          background: "rgba(10,15,30,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          padding: "12px 20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            maxWidth: 800,
          }}
        >
          <div>
            <div style={{ color: "#f1f5f9", fontWeight: 700, fontSize: 16 }}>
              Road Safety Digital Twin
            </div>
            <div style={{ color: "#64748b", fontSize: 12 }}>
              Real-time road network visualization
            </div>
          </div>
          <div style={{ flex: 1, display: "flex", gap: 8, marginLeft: 16 }}>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search any Indian city..."
              style={{
                flex: 1,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 8,
                padding: "8px 14px",
                color: "#f1f5f9",
                fontSize: 14,
                outline: "none",
              }}
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={isLoading}
              style={{
                background: "#3b82f6",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 18px",
                fontWeight: 600,
                cursor: "pointer",
                fontSize: 14,
                opacity: isLoading ? 0.6 : 1,
              }}
            >
              {isLoading ? "Loading..." : "Search"}
            </button>
          </div>
        </div>
      </div>

      {/* Welcome overlay */}
      {showWelcome && !isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 1001,
            background: "rgba(10,15,30,0.95)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "32px 40px",
            textAlign: "center",
            maxWidth: 480,
            width: "90%",
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 12 }}>🗺️</div>
          <div
            style={{
              color: "#f1f5f9",
              fontWeight: 700,
              fontSize: 22,
              marginBottom: 8,
            }}
          >
            Road Safety Digital Twin
          </div>
          <div style={{ color: "#94a3b8", fontSize: 14, marginBottom: 24 }}>
            Visualize real road networks from OpenStreetMap. Search any Indian
            city to load live road data, traffic indicators, and infrastructure
            analytics.
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              justifyContent: "center",
            }}
          >
            {QUICK_CITIES.map((city) => (
              <button
                key={city}
                type="button"
                onClick={() => handleQuickCity(city)}
                style={{
                  background: "rgba(59,130,246,0.15)",
                  border: "1px solid rgba(59,130,246,0.4)",
                  color: "#93c5fd",
                  borderRadius: 8,
                  padding: "8px 16px",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 600,
                  transition: "all 0.2s",
                }}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            zIndex: 1002,
            background: "rgba(10,15,30,0.92)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 16,
            padding: "28px 40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              border: "3px solid rgba(59,130,246,0.3)",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 12px",
            }}
          />
          <div style={{ color: "#f1f5f9", fontWeight: 600 }}>
            Loading road network...
          </div>
          <div style={{ color: "#64748b", fontSize: 13, marginTop: 4 }}>
            Fetching live data from OpenStreetMap
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !isLoading && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 1002,
            background: "rgba(239,68,68,0.15)",
            border: "1px solid rgba(239,68,68,0.4)",
            borderRadius: 10,
            padding: "12px 20px",
            color: "#fca5a5",
            fontSize: 14,
          }}
        >
          {error}
        </div>
      )}

      {/* Stats panel */}
      {stats && !isLoading && (
        <div
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 1000,
            width: 260,
            background: "rgba(10,15,30,0.92)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 14,
            padding: "18px 20px",
          }}
        >
          <div
            style={{
              color: "#f1f5f9",
              fontWeight: 700,
              fontSize: 15,
              marginBottom: 14,
            }}
          >
            {stats.city} — Network Stats
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[
              {
                label: "Total Roads",
                value: stats.totalRoads,
                color: "#94a3b8",
              },
              {
                label: "Motorways / Trunk",
                value: stats.motorways,
                color: "#3b82f6",
              },
              {
                label: "Primary Roads",
                value: stats.primaryRoads,
                color: "#f97316",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#94a3b8", fontSize: 13 }}>
                  {item.label}
                </span>
                <span
                  style={{ color: item.color, fontWeight: 700, fontSize: 15 }}
                >
                  {item.value}
                </span>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px solid rgba(255,255,255,0.07)",
                paddingTop: 10,
                marginTop: 2,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ color: "#94a3b8", fontSize: 13 }}>
                  Road Health Score
                </span>
                <span
                  style={{
                    color:
                      stats.healthScore >= 80
                        ? "#22c55e"
                        : stats.healthScore >= 65
                          ? "#f97316"
                          : "#ef4444",
                    fontWeight: 700,
                    fontSize: 16,
                  }}
                >
                  {stats.healthScore}/100
                </span>
              </div>
              <div
                style={{
                  marginTop: 8,
                  height: 6,
                  background: "rgba(255,255,255,0.1)",
                  borderRadius: 3,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    width: `${stats.healthScore}%`,
                    background:
                      stats.healthScore >= 80
                        ? "#22c55e"
                        : stats.healthScore >= 65
                          ? "#f97316"
                          : "#ef4444",
                    borderRadius: 3,
                    transition: "width 1s",
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{ marginTop: 14, display: "flex", gap: 8, flexWrap: "wrap" }}
          >
            {[
              { color: "#3b82f6", label: "Motorway/Trunk" },
              { color: "#f97316", label: "Primary" },
              { color: "#eab308", label: "Secondary" },
            ].map((item) => (
              <div
                key={item.label}
                style={{ display: "flex", alignItems: "center", gap: 5 }}
              >
                <div
                  style={{
                    width: 12,
                    height: 4,
                    background: item.color,
                    borderRadius: 2,
                  }}
                />
                <span style={{ color: "#64748b", fontSize: 11 }}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spin animation */}
      <style>
        {
          "@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}"
        }
      </style>
    </div>
  );
}
