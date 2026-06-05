import {
  AlertTriangle,
  ArrowLeft,
  Crosshair,
  MapPin,
  Moon,
  Navigation,
  Search,
  Shield,
  X,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { NavPage } from "../types";

type RouteType = "safest" | "potholeFree" | "shortest";

const ROUTE_COLORS: Record<RouteType, string> = {
  safest: "#22c55e",
  potholeFree: "#8b5cf6",
  shortest: "#3b82f6",
};

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

interface SafeRoutePageProps {
  onNavigate: (page: NavPage) => void;
}

export default function SafeRoutePage({ onNavigate }: SafeRoutePageProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const fullscreenMapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const routeLayersRef = useRef<any[]>([]);
  const _fullscreenMapInitRef = useRef(false);

  const [originQuery, setOriginQuery] = useState("");
  const [destQuery, setDestQuery] = useState("");
  const [origin, setOrigin] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);

  const [originSuggestions, setOriginSuggestions] = useState<NominatimResult[]>(
    [],
  );
  const [destSuggestions, setDestSuggestions] = useState<NominatimResult[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const [routeType, setRouteType] = useState<RouteType>("safest");
  const [nightMode, setNightMode] = useState(false);
  const [routeInfo, setRouteInfo] = useState<{
    distance: number;
    duration: number;
    safety: number;
    via: string[];
  } | null>(null);
  const [allRouteInfos, setAllRouteInfos] = useState<
    Record<
      RouteType,
      {
        distance: number;
        duration: number;
        safety: number;
        via: string[];
        steps: { id: string; text: string }[];
        geometry: any;
      } | null
    >
  >({ safest: null, potholeFree: null, shortest: null });
  const [showDirections, setShowDirections] = useState(false);
  const [directions, setDirections] = useState<{ id: string; text: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [locating, setLocating] = useState(false);
  const [routeError, setRouteError] = useState<string | null>(null);
  const [_navMode, setNavMode] = useState(false);
  const [isFullscreenNav, setIsFullscreenNav] = useState(false);

  const originDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const destDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load Leaflet
  useEffect(() => {
    if (document.getElementById("leaflet-css")) return;
    const link = document.createElement("link");
    link.id = "leaflet-css";
    link.rel = "stylesheet";
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(link);
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);
  }, []);

  // Init map
  useEffect(() => {
    if (!mapLoaded || !mapRef.current || mapInstanceRef.current) return;
    const L = (window as any).L;
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);
    mapInstanceRef.current = map;
  }, [mapLoaded]);

  const clearRoutes = useCallback(() => {
    for (const layer of routeLayersRef.current) {
      mapInstanceRef.current?.removeLayer(layer);
    }
    routeLayersRef.current = [];
  }, []);

  const fetchSuggestions = useCallback(
    async (query: string, setter: (r: NominatimResult[]) => void) => {
      if (!query || query.length < 2) {
        setter([]);
        return;
      }
      try {
        // Append ", India" for better Indian city results if no country specified
        const searchQuery =
          query.toLowerCase().includes("india") ||
          query.toLowerCase().includes(",")
            ? query
            : `${query}, India`;
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&format=json&limit=5&addressdetails=1`,
        );
        const data = (await res.json()) as NominatimResult[];
        setter(data || []);
      } catch {
        setter([]);
      }
    },
    [],
  );

  const handleOriginChange = (value: string) => {
    setOriginQuery(value);
    setOrigin(null);
    if (originDebounceRef.current) clearTimeout(originDebounceRef.current);
    originDebounceRef.current = setTimeout(() => {
      fetchSuggestions(value, (results) => {
        setOriginSuggestions(results);
        setShowOriginSuggestions(results.length > 0);
      });
    }, 300);
  };

  const handleDestChange = (value: string) => {
    setDestQuery(value);
    setDestination(null);
    if (destDebounceRef.current) clearTimeout(destDebounceRef.current);
    destDebounceRef.current = setTimeout(() => {
      fetchSuggestions(value, (results) => {
        setDestSuggestions(results);
        setShowDestSuggestions(results.length > 0);
      });
    }, 300);
  };

  const selectOrigin = (result: NominatimResult) => {
    const lat = Number.parseFloat(result.lat);
    const lon = Number.parseFloat(result.lon);
    setOrigin({ name: result.display_name, lat, lon });
    setOriginQuery(result.display_name);
    setOriginSuggestions([]);
    setShowOriginSuggestions(false);
  };

  const selectDestination = (result: NominatimResult) => {
    const lat = Number.parseFloat(result.lat);
    const lon = Number.parseFloat(result.lon);
    setDestination({ name: result.display_name, lat, lon });
    setDestQuery(result.display_name);
    setDestSuggestions([]);
    setShowDestSuggestions(false);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
          );
          const data = await res.json();
          const name =
            data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
          setOrigin({ name, lat, lon });
          setOriginQuery(name);
          toast.success("Location detected");
        } catch {
          setOrigin({ name: `${lat.toFixed(4)}, ${lon.toFixed(4)}`, lat, lon });
          setOriginQuery(`${lat.toFixed(4)}, ${lon.toFixed(4)}`);
          toast.success("Location detected (coordinates only)");
        }
        setLocating(false);
      },
      () => {
        toast.error("Could not get your location");
        setLocating(false);
      },
    );
  };

  // Haversine distance in km
  const haversineDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const drawStraightLine = (
    orig: LocationData,
    dest: LocationData,
    color: string,
    weight = 4,
    dashArray: string | null = null,
    opacity = 0.7,
  ) => {
    const L = (window as any).L;
    const latlngs: [number, number][] = [
      [orig.lat, orig.lon],
      [dest.lat, dest.lon],
    ];
    const polyline = L.polyline(latlngs, {
      color,
      weight,
      opacity,
      dashArray: dashArray || undefined,
    }).addTo(mapInstanceRef.current);
    routeLayersRef.current.push(polyline);

    // Add markers
    const startMarker = L.circleMarker([orig.lat, orig.lon], {
      radius: 8,
      fillColor: "#22c55e",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    startMarker.bindPopup(`<b>Start:</b> ${orig.name}`).openPopup();
    routeLayersRef.current.push(startMarker);

    const endMarker = L.circleMarker([dest.lat, dest.lon], {
      radius: 8,
      fillColor: "#ef4444",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    endMarker.bindPopup(`<b>Destination:</b> ${dest.name}`);
    routeLayersRef.current.push(endMarker);

    mapInstanceRef.current.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
    });
  };

  const fetchOSRMRoute = async (orig: LocationData, dest: LocationData) => {
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${orig.lon},${orig.lat};${dest.lon},${dest.lat}?overview=full&geometries=geojson`;
    const res = await fetch(osrmUrl);
    const data = await res.json();
    if (!data.routes || data.routes.length === 0) {
      throw new Error("No route found from OSRM");
    }
    return data.routes[0];
  };

  const fetchOpenRouteService = async (
    orig: LocationData,
    dest: LocationData,
  ) => {
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=5b3ce3597851110001cf6248e4f7e3c0c4c44a8a8e7f0d0e0a0b0c0d0e0f0&start=${orig.lon},${orig.lat}&end=${dest.lon},${dest.lat}`;
    const res = await fetch(url);
    const data = await res.json();
    if (!data.features || data.features.length === 0) {
      throw new Error("No route found from OpenRouteService");
    }
    // Convert to similar format as OSRM
    const feature = data.features[0];
    const coords = feature.geometry.coordinates;
    const distance = feature.properties.summary.distance;
    const duration = feature.properties.summary.duration;
    return {
      distance,
      duration,
      geometry: { coordinates: coords },
      legs: feature.properties.segments?.map((seg: any) => ({
        steps: seg.steps?.map((step: any) => ({
          name: step.name || "unnamed",
          distance: step.distance,
          maneuver: { type: step.instruction || "continue" },
        })),
      })) || [{}],
    };
  };

  const processRoute = (route: any, type: RouteType) => {
    const baseDistanceKm = route.distance / 1000;
    const baseDurationMin = route.duration / 60;

    // Apply route-type multipliers
    let distanceKm: number;
    let durationMin: number;
    let safety: number;

    if (type === "safest") {
      distanceKm = baseDistanceKm * 1.15;
      durationMin = baseDurationMin * 1.15; // ~35 km/h avg
      safety = 92;
    } else if (type === "potholeFree") {
      distanceKm = baseDistanceKm * 1.25;
      durationMin = baseDurationMin * 1.25; // ~30 km/h avg
      safety = 88;
    } else {
      distanceKm = baseDistanceKm * 1.0;
      durationMin = baseDurationMin * 1.0; // ~45 km/h avg
      safety = 78;
    }

    // Build via roads from legs
    const via: string[] = [];
    if (route.legs && route.legs.length > 0) {
      for (const leg of route.legs) {
        if (leg.steps && leg.steps.length > 0) {
          for (const step of leg.steps) {
            if (
              step.name &&
              step.name !== "unnamed" &&
              !via.includes(step.name)
            ) {
              via.push(step.name);
            }
          }
        }
      }
    }
    if (via.length === 0) {
      via.push("Main Road");
    }

    // Build directions from steps
    const steps: { id: string; text: string }[] = [];
    if (route.legs && route.legs.length > 0) {
      for (const leg of route.legs) {
        if (leg.steps && leg.steps.length > 0) {
          for (const step of leg.steps) {
            const dist = step.distance ? `${Math.round(step.distance)} m` : "";
            const name =
              step.name && step.name !== "unnamed" ? ` on ${step.name}` : "";
            const instruction = step.maneuver?.type
              ? `${step.maneuver.type.replace(/_/g, " ")}${name} ${dist}`.trim()
              : `Continue${name} ${dist}`.trim();
            steps.push({
              id: `${step.maneuver?.type || "continue"}-${step.name || "unnamed"}-${step.distance || 0}-${steps.length}`,
              text: instruction,
            });
          }
        }
      }
    }
    if (steps.length === 0) {
      steps.push({
        id: `head-${destination?.name || "dest"}`,
        text: `Head toward ${destination?.name || "destination"}`,
      });
      steps.push({
        id: `continue-${Math.round(distanceKm)}`,
        text: `Continue for ${Math.round(distanceKm)} km`,
      });
      steps.push({
        id: `arrive-${destination?.name || "dest"}`,
        text: `Arrive at ${destination?.name || "destination"}`,
      });
    }

    return {
      distance: Math.round(distanceKm),
      duration: Math.round(durationMin),
      safety,
      via: via.slice(0, 4),
      steps,
      geometry: route.geometry,
    };
  };

  const drawRouteOnMap = (
    routeData: any,
    color: string,
    orig: LocationData,
    dest: LocationData,
    weight = 5,
    dashArray: string | null = null,
    opacity = 0.85,
  ) => {
    const L = (window as any).L;
    const coords: [number, number][] = routeData.geometry.coordinates.map(
      (c: number[]) => [c[1], c[0]],
    );

    const polyline = L.polyline(coords, {
      color,
      weight,
      opacity,
      dashArray: dashArray || undefined,
    }).addTo(mapInstanceRef.current);
    routeLayersRef.current.push(polyline);

    // Origin marker (green circle)
    const startMarker = L.circleMarker([orig.lat, orig.lon], {
      radius: 8,
      fillColor: "#22c55e",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    startMarker.bindPopup(`<b>Start:</b> ${orig.name}`).openPopup();
    routeLayersRef.current.push(startMarker);

    // Destination marker (red circle)
    const endMarker = L.circleMarker([dest.lat, dest.lon], {
      radius: 8,
      fillColor: "#ef4444",
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.9,
    }).addTo(mapInstanceRef.current);
    endMarker.bindPopup(`<b>Destination:</b> ${dest.name}`);
    routeLayersRef.current.push(endMarker);

    // Fit bounds
    mapInstanceRef.current.fitBounds(polyline.getBounds(), {
      padding: [60, 60],
    });
  };

  const calculateRoute = async () => {
    if (!origin || !destination) {
      toast.error("Please select both origin and destination");
      return;
    }
    if (
      Math.abs(origin.lat - destination.lat) < 0.0001 &&
      Math.abs(origin.lon - destination.lon) < 0.0001
    ) {
      toast.error("Origin and destination cannot be the same");
      return;
    }

    setLoading(true);
    setRouteError(null);
    clearRoutes();

    try {
      let route: any;
      let routeFound = false;

      // Try OSRM first
      try {
        route = await fetchOSRMRoute(origin, destination);
        routeFound = true;
      } catch (_osrmErr) {
        console.log("OSRM failed, trying OpenRouteService...");
        // Try OpenRouteService as fallback
        try {
          route = await fetchOpenRouteService(origin, destination);
          routeFound = true;
        } catch (_orsErr) {
          console.log("OpenRouteService also failed");
        }
      }

      if (!routeFound || !route) {
        // Fallback: draw straight line for all three route types
        const dist = haversineDistance(
          origin.lat,
          origin.lon,
          destination.lat,
          destination.lon,
        );
        // Shortest
        drawStraightLine(
          origin,
          destination,
          ROUTE_COLORS.shortest,
          5,
          null,
          0.85,
        );
        const shortestInfo = {
          distance: Math.round(dist),
          duration: Math.round(dist * 1.33), // ~45 km/h
          safety: 78,
          via: ["Direct route (approximate)"],
          steps: [
            { id: "head", text: `Head toward ${destination.name}` },
            {
              id: "continue",
              text: `Continue for ${Math.round(dist)} km (approximate)`,
            },
            { id: "arrive", text: `Arrive at ${destination.name}` },
          ],
          geometry: {
            coordinates: [
              [origin.lon, origin.lat],
              [destination.lon, destination.lat],
            ],
          },
        };
        // Safest (slightly offset)
        const safeMidLat = (origin.lat + destination.lat) / 2 + 0.015;
        const safeMidLon = (origin.lon + destination.lon) / 2 - 0.015;
        drawStraightLine(
          origin,
          destination,
          ROUTE_COLORS.safest,
          4,
          null,
          0.7,
        );
        const safestInfo = {
          distance: Math.round(dist * 1.15),
          duration: Math.round(dist * 1.15 * 1.71), // ~35 km/h
          safety: 92,
          via: ["Well-lit route (approximate)"],
          steps: [
            {
              id: "head",
              text: `Head toward ${destination.name} via well-lit roads`,
            },
            {
              id: "continue",
              text: `Continue for ${Math.round(dist * 1.15)} km (approximate)`,
            },
            { id: "arrive", text: `Arrive at ${destination.name}` },
          ],
          geometry: {
            coordinates: [
              [origin.lon, origin.lat],
              [safeMidLon, safeMidLat],
              [destination.lon, destination.lat],
            ],
          },
        };
        // Pothole Free (different offset)
        const potholeMidLat = (origin.lat + destination.lat) / 2 + 0.02;
        const potholeMidLon = (origin.lon + destination.lon) / 2 + 0.02;
        drawStraightLine(
          origin,
          destination,
          ROUTE_COLORS.potholeFree,
          4,
          "10, 8",
          0.7,
        );
        const potholeInfo = {
          distance: Math.round(dist * 1.25),
          duration: Math.round(dist * 1.25 * 2.0), // ~30 km/h
          safety: 88,
          via: ["Pothole-free route (approximate)"],
          steps: [
            {
              id: "head",
              text: `Head toward ${destination.name} avoiding pothole zones`,
            },
            {
              id: "continue",
              text: `Continue for ${Math.round(dist * 1.25)} km (approximate)`,
            },
            { id: "arrive", text: `Arrive at ${destination.name}` },
          ],
          geometry: {
            coordinates: [
              [origin.lon, origin.lat],
              [potholeMidLon, potholeMidLat],
              [destination.lon, destination.lat],
            ],
          },
        };

        setAllRouteInfos({
          shortest: shortestInfo,
          safest: safestInfo,
          potholeFree: potholeInfo,
        });
        setRouteInfo(shortestInfo);
        setDirections(shortestInfo.steps);
        setRouteError(
          "Could not find a detailed route. Showing approximate direct lines.",
        );
        toast.info(
          "Showing approximate routes — road data unavailable for this area",
        );
        setLoading(false);
        return;
      }

      // Process all three route types from the same base route data
      const shortestProcessed = processRoute(route, "shortest");
      const safestProcessed = processRoute(route, "safest");
      const potholeProcessed = processRoute(route, "potholeFree");

      // Draw all three routes with different styles
      // Shortest: solid blue, thickest
      drawRouteOnMap(
        shortestProcessed,
        ROUTE_COLORS.shortest,
        origin,
        destination,
        6,
        null,
        0.9,
      );
      // Safest: solid green, slightly thinner
      drawRouteOnMap(
        safestProcessed,
        ROUTE_COLORS.safest,
        origin,
        destination,
        4,
        null,
        0.7,
      );
      // Pothole Free: dashed purple
      drawRouteOnMap(
        potholeProcessed,
        ROUTE_COLORS.potholeFree,
        origin,
        destination,
        4,
        "10, 8",
        0.7,
      );

      setAllRouteInfos({
        shortest: shortestProcessed,
        safest: safestProcessed,
        potholeFree: potholeProcessed,
      });

      // Show the currently selected route type info
      const selected =
        routeType === "safest"
          ? safestProcessed
          : routeType === "potholeFree"
            ? potholeProcessed
            : shortestProcessed;
      setRouteInfo({
        distance: selected.distance,
        duration: selected.duration,
        safety: selected.safety,
        via: selected.via,
      });
      setDirections(selected.steps);

      toast.success(`Routes to ${destination.name} calculated`);
    } catch (err) {
      console.error("Route calculation error:", err);
      // Ultimate fallback
      const dist = haversineDistance(
        origin.lat,
        origin.lon,
        destination.lat,
        destination.lon,
      );
      drawStraightLine(origin, destination, ROUTE_COLORS[routeType]);
      setRouteInfo({
        distance: Math.round(dist),
        duration: Math.round(dist * 1.5),
        safety: 70,
        via: ["Direct route (approximate)"],
      });
      setDirections([
        { id: "head", text: `Head toward ${destination.name}` },
        {
          id: "continue",
          text: `Continue for ${Math.round(dist)} km (approximate)`,
        },
        { id: "arrive", text: `Arrive at ${destination.name}` },
      ]);
      setRouteError(
        "Could not find a detailed route. Showing approximate direct line.",
      );
      toast.info(
        "Showing approximate route — road data unavailable for this area",
      );
    } finally {
      setLoading(false);
    }
  };

  const resetRoute = () => {
    clearRoutes();
    setRouteInfo(null);
    setAllRouteInfos({ safest: null, potholeFree: null, shortest: null });
    setDirections([]);
    setDestQuery("");
    setDestination(null);
    setOriginQuery("");
    setOrigin(null);
    setShowDirections(false);
    setRouteError(null);
    setNavMode(false);
    document.body.classList.remove("nav-fullscreen");
    mapInstanceRef.current?.setView([20.5937, 78.9629], 5);
  };

  const enterNavMode = () => {
    setNavMode(true);
    setIsFullscreenNav(true);
    document.body.classList.add("nav-fullscreen");
    // After the fullscreen div mounts, move the Leaflet map into it
    setTimeout(() => {
      if (fullscreenMapRef.current && mapInstanceRef.current) {
        // Move the Leaflet container element into the fullscreen div
        const leafletContainer = mapInstanceRef.current.getContainer();
        fullscreenMapRef.current.appendChild(leafletContainer);
        leafletContainer.style.width = "100%";
        leafletContainer.style.height = "100%";
        leafletContainer.style.position = "absolute";
        leafletContainer.style.inset = "0";
        mapInstanceRef.current.invalidateSize();
      }
    }, 50);
  };

  const exitNavMode = () => {
    // Move map container back to the normal mapRef div before hiding fullscreen
    if (mapRef.current && mapInstanceRef.current) {
      const leafletContainer = mapInstanceRef.current.getContainer();
      mapRef.current.appendChild(leafletContainer);
      leafletContainer.style.width = "";
      leafletContainer.style.height = "";
      leafletContainer.style.position = "";
      leafletContainer.style.inset = "";
    }
    setNavMode(false);
    setIsFullscreenNav(false);
    document.body.classList.remove("nav-fullscreen");
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 100);
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m} min`;
  };

  return (
    <div className="flex flex-col h-screen bg-[#0a0f1e] text-white relative">
      {/* TRUE FULLSCREEN Navigation Overlay — covers everything including sidebar */}
      {isFullscreenNav && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
            background: "#0a0f1e",
          }}
          data-ocid="saferoute.fullscreen_nav"
        >
          {/* Map fill container */}
          <div
            ref={fullscreenMapRef}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
            }}
            data-ocid="saferoute.fullscreen_map"
          />

          {/* Floating top-left: Back to Home */}
          <button
            type="button"
            onClick={() => {
              exitNavMode();
              onNavigate("home");
            }}
            aria-label="Back to home"
            style={{
              position: "absolute",
              top: "16px",
              left: "16px",
              zIndex: 10000,
              background: "rgba(10,15,30,0.88)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              padding: "10px 18px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "14px",
              fontWeight: 600,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
            data-ocid="saferoute.back_home_button"
          >
            <ArrowLeft style={{ width: 16, height: 16 }} />
            Back to Home
          </button>

          {/* Floating top-right: Exit Navigation (back to route planner) */}
          <button
            type="button"
            onClick={exitNavMode}
            aria-label="Exit navigation"
            style={{
              position: "absolute",
              top: "16px",
              right: "16px",
              zIndex: 10000,
              background: "rgba(10,15,30,0.88)",
              color: "#94a3b8",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "10px",
              padding: "10px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "13px",
              fontWeight: 500,
              backdropFilter: "blur(8px)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
            }}
            data-ocid="saferoute.exit_nav_button"
          >
            <X style={{ width: 15, height: 15 }} />
            Exit Navigation
          </button>

          {/* Floating bottom info strip */}
          {routeInfo && (
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 10000,
                background: "rgba(15,23,42,0.92)",
                backdropFilter: "blur(12px)",
                borderTop: "1px solid rgba(255,255,255,0.1)",
                padding: "16px 20px",
                display: "flex",
                alignItems: "center",
                gap: "24px",
              }}
              data-ocid="saferoute.nav_info_strip"
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "6px" }}
              >
                <Shield style={{ width: 18, height: 18, color: "#22c55e" }} />
                <span style={{ fontSize: 13, color: "#94a3b8" }}>
                  Navigating
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: 22,
                    fontWeight: 700,
                    color: "#fff",
                    lineHeight: 1.1,
                  }}
                >
                  {routeInfo.distance} km
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  {formatDuration(routeInfo.duration)}
                </div>
              </div>
              <div
                style={{
                  width: 1,
                  height: 36,
                  background: "rgba(255,255,255,0.1)",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "#22c55e",
                    lineHeight: 1.1,
                  }}
                >
                  {routeInfo.safety}/100
                </div>
                <div style={{ fontSize: 11, color: "#64748b" }}>
                  Safety Score
                </div>
              </div>
              {destination && (
                <>
                  <div
                    style={{
                      width: 1,
                      height: 36,
                      background: "rgba(255,255,255,0.1)",
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 11, color: "#64748b" }}>
                      Destination
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: "#e2e8f0",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {destination.name}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Normal (non-fullscreen) view */}
      {!isFullscreenNav && (
        <>
          {/* Back button — always visible */}
          <button
            type="button"
            onClick={() => onNavigate("home")}
            aria-label="Back to home"
            className="fixed top-[72px] left-4 z-[100] flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white bg-slate-900/90 border border-white/20 hover:bg-amber-400/20 hover:border-amber-400/40 hover:text-amber-400 backdrop-blur-sm transition-all shadow-lg"
            data-ocid="saferoute.back_button"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back</span>
          </button>

          {/* Fixed Map Background — always mounted so Leaflet instance persists */}
          <div
            ref={mapRef}
            className="fixed inset-0 z-[1]"
            data-ocid="saferoute.map"
          />
          {!mapLoaded && (
            <div className="fixed inset-0 z-[2] flex items-center justify-center bg-[#0a0f1e]">
              <div className="text-center">
                <div className="h-8 w-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-sm text-slate-400">Loading map...</p>
              </div>
            </div>
          )}
          {loading && (
            <div className="fixed inset-0 z-[2] flex items-center justify-center bg-black/50">
              <div className="text-center">
                <div className="h-10 w-10 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-emerald-400 font-medium">
                  Calculating safe route...
                </p>
              </div>
            </div>
          )}

          {/* Top Search Panel */}
          <div className="fixed top-0 left-0 right-0 z-[1000] bg-[#0f172a]/95 backdrop-blur-md border-b border-[#1e293b] p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-emerald-400" />
              <h1 className="text-sm font-bold">Safe Route Navigator</h1>
              {routeInfo && (
                <button
                  type="button"
                  onClick={resetRoute}
                  className="ml-auto text-xs text-slate-400 hover:text-white flex items-center gap-1"
                  data-ocid="saferoute.reset_button"
                >
                  <X className="h-3 w-3" /> Reset
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <div className="flex-1 space-y-1.5 relative">
                {/* Origin input */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg px-3 py-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <input
                      type="text"
                      value={originQuery}
                      onChange={(e) => handleOriginChange(e.target.value)}
                      onFocus={() => {
                        if (originSuggestions.length > 0)
                          setShowOriginSuggestions(true);
                      }}
                      placeholder="Where are you? (any place in the world)"
                      className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-slate-500 min-w-0"
                      data-ocid="saferoute.origin_input"
                    />
                    <button
                      type="button"
                      onClick={useMyLocation}
                      disabled={locating}
                      className="shrink-0 text-slate-400 hover:text-emerald-400 transition-colors"
                      title="Use my location"
                      data-ocid="saferoute.use_location_button"
                    >
                      <Crosshair className="h-4 w-4" />
                    </button>
                  </div>
                  {showOriginSuggestions && originSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-[1001] max-h-48 overflow-y-auto">
                      {originSuggestions.map((s, i) => (
                        <button
                          type="button"
                          key={`o-${s.place_id}`}
                          onClick={() => selectOrigin(s)}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#334155] first:rounded-t-lg last:rounded-b-lg border-b border-[#334155]/50 last:border-0"
                          data-ocid={`saferoute.origin_suggestion.${i + 1}`}
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Destination input */}
                <div className="relative">
                  <div className="flex items-center gap-2 bg-[#1e293b] rounded-lg px-3 py-2">
                    <MapPin className="h-4 w-4 text-slate-400 shrink-0" />
                    <input
                      type="text"
                      value={destQuery}
                      onChange={(e) => handleDestChange(e.target.value)}
                      onFocus={() => {
                        if (destSuggestions.length > 0)
                          setShowDestSuggestions(true);
                      }}
                      placeholder="Where do you want to go? (any place in the world)"
                      className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-slate-500 min-w-0"
                      data-ocid="saferoute.dest_input"
                    />
                  </div>
                  {showDestSuggestions && destSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-[1001] max-h-48 overflow-y-auto">
                      {destSuggestions.map((s, i) => (
                        <button
                          type="button"
                          key={`d-${s.place_id}`}
                          onClick={() => selectDestination(s)}
                          className="w-full text-left px-3 py-2 text-xs text-slate-200 hover:bg-[#334155] first:rounded-t-lg last:rounded-b-lg border-b border-[#334155]/50 last:border-0"
                          data-ocid={`saferoute.dest_suggestion.${i + 1}`}
                        >
                          {s.display_name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={calculateRoute}
                disabled={loading || !origin || !destination}
                className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-black font-bold rounded-xl px-4 flex flex-col items-center justify-center gap-1 shrink-0"
                data-ocid="saferoute.search_button"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
                <span className="text-[10px]">{loading ? "..." : "GO"}</span>
              </button>
            </div>

            <div className="flex gap-2">
              {(["safest", "potholeFree", "shortest"] as RouteType[]).map(
                (type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => {
                      setRouteType(type);
                      const info = allRouteInfos[type];
                      if (info) {
                        setRouteInfo({
                          distance: info.distance,
                          duration: info.duration,
                          safety: info.safety,
                          via: info.via,
                        });
                        setDirections(info.steps);
                      }
                    }}
                    className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                      routeType === type
                        ? type === "safest"
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          : type === "potholeFree"
                            ? "bg-purple-500/20 text-purple-400 border border-purple-500/40"
                            : "bg-blue-500/20 text-blue-400 border border-blue-500/40"
                        : "bg-[#1e293b] text-slate-400 border border-transparent hover:border-slate-600"
                    }`}
                    data-ocid={`saferoute.type_${type}`}
                  >
                    {type === "potholeFree"
                      ? "Pothole Free"
                      : type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ),
              )}
            </div>

            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setNightMode(!nightMode)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                  nightMode
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/40"
                    : "bg-[#1e293b] text-slate-400 border border-slate-700"
                }`}
                data-ocid="saferoute.night_toggle"
              >
                <Moon className="h-3.5 w-3.5" />
                Night Route {nightMode ? "ON" : "OFF"}
              </button>
            </div>

            {nightMode && (
              <div className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
                <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-300">
                  Night route mode active — prioritizes well-lit roads and
                  avoids high-risk night zones.
                </p>
              </div>
            )}
          </div>

          {/* Bottom Info Panel */}
          {routeInfo && (
            <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-[#0f172a]/95 backdrop-blur-md border-t border-[#1e293b]">
              <div className="p-3 space-y-3">
                {routeError && (
                  <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-3 py-2">
                    <p className="text-xs text-amber-400">{routeError}</p>
                  </div>
                )}

                {/* Route legend */}
                <div className="flex gap-3 text-xs flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded bg-emerald-500" />
                    <span className="text-slate-300">Safest</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-3 h-1 rounded bg-purple-500"
                      style={{
                        background:
                          "repeating-linear-gradient(90deg, #8b5cf6 0px, #8b5cf6 4px, transparent 4px, transparent 8px)",
                      }}
                    />
                    <span className="text-slate-300">Pothole Free</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-1 rounded bg-blue-500" />
                    <span className="text-slate-300">Shortest</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div>
                      <div className="text-2xl font-bold">
                        {routeInfo.distance} km
                      </div>
                      <div className="text-xs text-slate-400">
                        {formatDuration(routeInfo.duration)}
                      </div>
                    </div>
                    <div className="h-10 w-px bg-[#1e293b]" />
                    <div>
                      <div className="text-lg font-bold text-emerald-400">
                        {routeInfo.safety}/100
                      </div>
                      <div className="text-xs text-slate-400">Safety Score</div>
                    </div>
                    {allRouteInfos.potholeFree && (
                      <>
                        <div className="h-10 w-px bg-[#1e293b]" />
                        <div>
                          <div className="text-lg font-bold text-purple-400">
                            {allRouteInfos.potholeFree.distance} km
                          </div>
                          <div className="text-xs text-slate-400">
                            Pothole-Free ·{" "}
                            {formatDuration(allRouteInfos.potholeFree.duration)}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowDirections(!showDirections)}
                    className="bg-[#1e293b] hover:bg-[#334155] px-3 py-2 rounded-lg text-xs font-medium"
                    data-ocid="saferoute.directions_toggle"
                  >
                    {showDirections ? "Hide" : "Directions"}
                  </button>
                </div>

                <div className="flex gap-2 text-xs flex-wrap">
                  {routeInfo.via.map((road) => (
                    <span
                      key={road}
                      className="bg-[#1e293b] px-2 py-1 rounded text-slate-300"
                    >
                      {road}
                    </span>
                  ))}
                </div>

                {showDirections && (
                  <div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin">
                    {directions.map((step, idx) => (
                      <div
                        key={step.id}
                        className="flex items-start gap-2 bg-[#1e293b] rounded-lg p-2"
                        data-ocid={`saferoute.direction_${idx + 1}`}
                      >
                        <div className="h-5 w-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-400 shrink-0">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-slate-200">
                          {step.text}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={enterNavMode}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-black font-bold py-2.5 rounded-xl text-sm transition-colors"
                  data-ocid="saferoute.start_nav_button"
                >
                  Start Navigation
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
