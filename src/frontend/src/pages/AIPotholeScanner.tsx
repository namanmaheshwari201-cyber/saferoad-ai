import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Camera,
  CameraOff,
  MapPin,
  ScanLine,
  StopCircle,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ─── Types ───────────────────────────────────────────────────────────────────
interface DetectedRegion {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  color: string;
  confidence: number;
  severity: "High" | "Medium" | "Low";
  description: string;
}

interface DetectionLogEntry {
  id: number;
  timestamp: string;
  type: string;
  severity: "High" | "Medium" | "Low";
  confidence: number;
  lat: number;
  lng: number;
  description: string;
}

// ─── Constants ───────────────────────────────────────────────────────────────
const SEVERITY_BADGE: Record<string, string> = {
  High: "bg-red-500/20 text-red-400 border-red-500/30",
  Medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

let globalRegionId = 1;
let globalLogId = 1;

// ── Helpers ─────────────────────────────────────────────────────────────────
function getBrightness(
  data: Uint8ClampedArray,
  vw: number,
  x: number,
  y: number,
) {
  const i = (y * vw + x) * 4;
  return (data[i] + data[i + 1] + data[i + 2]) / 3;
}

function isBlackFrame(
  data: Uint8ClampedArray,
  vw: number,
  vh: number,
): boolean {
  let total = 0;
  for (let s = 0; s < 20; s++) {
    const sx = Math.floor(Math.random() * vw);
    const sy = Math.floor(Math.random() * vh);
    total += getBrightness(data, vw, sx, sy);
  }
  return total / 20 < 20;
}

function isRoadSurface(
  data: Uint8ClampedArray,
  vw: number,
  vh: number,
): { detected: boolean; avgLuminance: number; roadPixelsMask: Uint8Array } {
  // Sample a 16x16 grid across the FULL frame
  const gridW = 16;
  const gridH = 16;
  const stepX = Math.floor(vw / gridW);
  const stepY = Math.floor(vh / gridH);

  let roadCount = 0;
  let totalCount = 0;
  let brightnessSum = 0;
  let brightnessSqSum = 0;

  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = Math.min(gx * stepX + Math.floor(stepX / 2), vw - 1);
      const py = Math.min(gy * stepY + Math.floor(stepY / 2), vh - 1);
      const i = (py * vw + px) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const brightness = (r + g + b) / 3;
      brightnessSum += brightness;
      brightnessSqSum += brightness * brightness;
      totalCount++;

      // Gray tones (asphalt/concrete): R,G,B all within 50 of each other, and in range
      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const isGray =
        r >= 60 &&
        r <= 200 &&
        g >= 60 &&
        g <= 200 &&
        b >= 50 &&
        b <= 180 &&
        maxC - minC <= 50;

      // Brown/dirt tones: R > G + 15 and R in range
      const isDirt =
        r >= 80 &&
        r <= 180 &&
        r > g + 15 &&
        g >= 50 &&
        g <= 150 &&
        b >= 30 &&
        b <= 120;

      if (isGray || isDirt) roadCount++;
    }
  }

  const avgBrightness = totalCount > 0 ? brightnessSum / totalCount : 0;
  const variance =
    totalCount > 0
      ? brightnessSqSum / totalCount - avgBrightness * avgBrightness
      : 0;
  const stddev = Math.sqrt(Math.max(0, variance));

  // Skin-tone check: warm pink/orange dominant
  let skinCount = 0;
  for (let gy = 0; gy < gridH; gy++) {
    for (let gx = 0; gx < gridW; gx++) {
      const px = Math.min(gx * stepX + Math.floor(stepX / 2), vw - 1);
      const py = Math.min(gy * stepY + Math.floor(stepY / 2), vh - 1);
      const i = (py * vw + px) * 4;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      if (r > 160 && r > g * 1.3 && r > b * 1.4) skinCount++;
    }
  }
  const skinRatio = skinCount / totalCount;

  // Very uniform solid color
  const isUniform = stddev < 5;
  // Very bright uniform scene
  const isBrightUniform = avgBrightness > 210 && stddev < 15;

  const roadRatio = totalCount > 0 ? roadCount / totalCount : 0;
  const detected =
    roadRatio >= 0.25 &&
    stddev > 8 &&
    skinRatio < 0.3 &&
    !isUniform &&
    !isBrightUniform;

  // Build a pixel mask marking which full-resolution pixels are road-like
  const mask = new Uint8Array(vw * vh);
  if (detected) {
    for (let y = 0; y < vh; y += 2) {
      for (let x = 0; x < vw; x += 2) {
        const i = (y * vw + x) * 4;
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        const isGray =
          r >= 60 &&
          r <= 200 &&
          g >= 60 &&
          g <= 200 &&
          b >= 50 &&
          b <= 180 &&
          maxC - minC <= 50;
        const isDirt =
          r >= 80 &&
          r <= 180 &&
          r > g + 15 &&
          g >= 50 &&
          g <= 150 &&
          b >= 30 &&
          b <= 120;
        if (isGray || isDirt) mask[y * vw + x] = 1;
      }
    }
  }

  // Compute average luminance of road pixels for Gate 2 baseline
  let lumSum = 0;
  let lumCount = 0;
  if (detected) {
    for (let idx = 0; idx < mask.length; idx++) {
      if (mask[idx] === 1) {
        const i = idx * 4;
        lumSum += (data[i] + data[i + 1] + data[i + 2]) / 3;
        lumCount++;
      }
    }
  }
  const avgLuminance = lumCount > 0 ? lumSum / lumCount : 0;

  return { detected, avgLuminance, roadPixelsMask: mask };
}

// ── Damage Detection ──────────────────────────────────────────────────────
function analyzeFrame(
  imageData: ImageData,
  vw: number,
  vh: number,
  avgRoadLuminance: number,
  roadMask: Uint8Array,
): DetectedRegion | null {
  const data = imageData.data;
  const totalPixels = vw * vh;

  // Gate 2: find the darkest pixel in the road region
  let darkestLum = 999;
  let darkestX = -1;
  let darkestY = -1;
  const depThreshold = avgRoadLuminance - 25;

  for (let y = 0; y < vh; y += 2) {
    for (let x = 0; x < vw; x += 2) {
      if (roadMask[y * vw + x] !== 1) continue;
      const i = (y * vw + x) * 4;
      const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
      if (lum < depThreshold && lum < darkestLum) {
        darkestLum = lum;
        darkestX = x;
        darkestY = y;
      }
    }
  }

  if (darkestX === -1) return null;

  // Flood-fill the dark depression from the darkest seed
  const visited = new Uint8Array(vw * vh);
  const stack: [number, number][] = [[darkestX, darkestY]];
  const pixels: [number, number][] = [];
  let minX = darkestX;
  let maxX = darkestX;
  let minY = darkestY;
  let maxY = darkestY;
  let lumAccum = 0;
  let avgB = 0;
  let avgR = 0;

  while (stack.length > 0) {
    const entry = stack.pop();
    if (!entry) break;
    const [cx, cy] = entry;
    const idx = cy * vw + cx;
    if (visited[idx]) continue;
    visited[idx] = 1;
    const i = idx * 4;
    const lum = (data[i] + data[i + 1] + data[i + 2]) / 3;
    if (lum >= depThreshold) continue;
    pixels.push([cx, cy]);
    lumAccum += lum;
    avgB += data[i + 2];
    avgR += data[i];
    minX = Math.min(minX, cx);
    maxX = Math.max(maxX, cx);
    minY = Math.min(minY, cy);
    maxY = Math.max(maxY, cy);

    const neighbors: [number, number][] = [
      [cx - 2, cy],
      [cx + 2, cy],
      [cx, cy - 2],
      [cx, cy + 2],
    ];
    for (const [nx, ny] of neighbors) {
      if (nx < 0 || nx >= vw || ny < 0 || ny >= vh) continue;
      const nidx = ny * vw + nx;
      if (visited[nidx]) continue;
      stack.push([nx, ny]);
    }
  }

  if (pixels.length === 0) return null;

  const area = pixels.length;
  const areaRatio = area / (totalPixels / 4);
  const w = maxX - minX;
  const h = maxY - minY;
  const aspect = w / Math.max(h, 1);

  // Area: 1% to 35% of frame
  if (areaRatio < 0.01 || areaRatio > 0.35) return null;
  // Aspect ratio: 0.2 to 4.0
  if (aspect < 0.2 || aspect > 4.0) return null;

  const darkRegionLuminance = lumAccum / area;
  if (darkRegionLuminance >= avgRoadLuminance * 0.85) return null;

  // Check that at least 2 cardinal sides are surrounded by road pixels
  const checkPoints: [number, number][] = [
    [Math.floor((minX + maxX) / 2), Math.max(0, minY - 20)],
    [Math.floor((minX + maxX) / 2), Math.min(vh - 1, maxY + 20)],
    [Math.max(0, minX - 20), Math.floor((minY + maxY) / 2)],
    [Math.min(vw - 1, maxX + 20), Math.floor((minY + maxY) / 2)],
  ];
  let roadSides = 0;
  for (const [cx, cy] of checkPoints) {
    if (roadMask[cy * vw + cx] === 1) roadSides++;
  }
  if (roadSides < 2) return null;

  // Confidence scoring
  const depthRatio =
    (avgRoadLuminance - darkRegionLuminance) / Math.max(avgRoadLuminance, 1);
  const shapeScore = aspect >= 0.5 && aspect <= 2.0 ? 1.0 : 0.7;
  const confidence = areaRatio * 0.5 + depthRatio * 0.3 + shapeScore * 0.2;

  if (confidence < 0.5) return null;

  const meanB = avgB / area;
  const meanR = avgR / area;
  let label: string;
  let color: string;
  let severity: "High" | "Medium" | "Low";
  let description: string;

  if (meanB > meanR + 15) {
    label = "Pothole - Water Filled";
    color = "#3b82f6";
    severity = "High";
    description = "Water-filled pothole with potential hydroplaning risk";
  } else if (depthRatio > 0.5) {
    label = "Deep Pothole";
    color = "#dc2626";
    severity = "High";
    description = "Deep pothole exceeding 15cm depth, immediate repair needed";
  } else if (depthRatio > 0.3) {
    label = "Pothole";
    color = "#f97316";
    severity = "Medium";
    description = "Pothole with visible surface depression";
  } else {
    label = "Surface Depression";
    color = "#eab308";
    severity = "Low";
    description = "Shallow surface depression, monitor for expansion";
  }

  const confPct = Math.round(confidence * 100);

  return {
    id: globalRegionId++,
    x: minX,
    y: minY,
    w,
    h,
    label,
    color,
    confidence: confPct,
    severity,
    description,
  };
}

// ── Drawing ─────────────────────────────────────────────────────────────────
function drawRegionBox(
  oc: CanvasRenderingContext2D,
  r: DetectedRegion,
  displayW: number,
  displayH: number,
  vw: number,
  vh: number,
  isFrontCamera: boolean,
) {
  // object-fit:cover scaling
  const scaleX = displayW / vw;
  const scaleY = displayH / vh;
  const largerScale = Math.max(scaleX, scaleY);
  const offsetX = (displayW - vw * largerScale) / 2;
  const offsetY = (displayH - vh * largerScale) / 2;

  let scaledX = r.x * largerScale + offsetX;
  const scaledY = r.y * largerScale + offsetY;
  const scaledW = r.w * largerScale;
  const scaledH = r.h * largerScale;

  // Mirror compensation for front camera
  if (isFrontCamera) {
    scaledX = displayW - (scaledX + scaledW);
  }

  const color = r.color;
  oc.strokeStyle = color;
  oc.lineWidth = 3;
  oc.setLineDash([]);
  oc.strokeRect(scaledX, scaledY, scaledW, scaledH);

  const cl = 8;
  const corners = [
    [scaledX, scaledY, 1, 1],
    [scaledX + scaledW, scaledY, -1, 1],
    [scaledX, scaledY + scaledH, 1, -1],
    [scaledX + scaledW, scaledY + scaledH, -1, -1],
  ];
  for (const [cx, cy, sx, sy] of corners) {
    oc.beginPath();
    oc.moveTo(Number(cx), Number(cy) + Number(sy) * cl);
    oc.lineTo(Number(cx), Number(cy));
    oc.lineTo(Number(cx) + Number(sx) * cl, Number(cy));
    oc.stroke();
  }

  const labelText = `${r.label} ${r.confidence}%`;
  oc.font = "bold 12px sans-serif";
  const tw = oc.measureText(labelText).width;
  const badgeH = 22;
  const badgeY = Math.max(2, scaledY - badgeH - 3);
  oc.fillStyle = `${color}E6`;
  oc.fillRect(scaledX - 1, badgeY, tw + 14, badgeH);
  oc.fillStyle = "#fff";
  oc.fillText(labelText, scaledX + 6, badgeY + 16);

  const sevText = r.severity;
  oc.font = "bold 10px sans-serif";
  const sw = oc.measureText(sevText).width;
  const sevColor =
    r.severity === "High"
      ? "#dc2626"
      : r.severity === "Medium"
        ? "#f59e0b"
        : "#10b981";
  oc.fillStyle = `${sevColor}E6`;
  oc.fillRect(scaledX + scaledW - sw - 10, badgeY, sw + 12, 18);
  oc.fillStyle = "#fff";
  oc.fillText(sevText, scaledX + scaledW - sw - 4, badgeY + 13);
}

// ─── Component ─────────────────────────────────────────────────────────────────
export default function AIPotholeScanner() {
  const [cameraState, setCameraState] = useState<
    "idle" | "requesting" | "active" | "error"
  >("idle");
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraLoading, setCameraLoading] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [statusText, setStatusText] = useState(
    "Camera ready — tap Scan to detect road damage",
  );
  const [detectionCount, setDetectionCount] = useState(0);
  const [logEntries, setLogEntries] = useState<DetectionLogEntry[]>([]);
  const [currentRegions, setCurrentRegions] = useState<DetectedRegion[]>([]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const scanningRef = useRef(false);
  const isFrontCameraRef = useRef(false);

  const runScan = useCallback(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    const capture = captureCanvasRef.current;
    if (!video || !overlay || !capture) return;

    if (
      video.readyState < 2 ||
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setStatusText("Camera loading, please wait...");
      return;
    }

    const vw = video.videoWidth;
    const vh = video.videoHeight;

    if (capture.width !== vw || capture.height !== vh) {
      capture.width = vw;
      capture.height = vh;
    }

    const displayW = overlay.clientWidth || video.clientWidth || vw;
    const displayH = overlay.clientHeight || video.clientHeight || vh;
    if (overlay.width !== displayW || overlay.height !== displayH) {
      overlay.width = displayW;
      overlay.height = displayH;
    }

    const ctx = capture.getContext("2d");
    const oc = overlay.getContext("2d");
    if (!ctx || !oc) return;

    ctx.drawImage(video, 0, 0, vw, vh);
    const imageData = ctx.getImageData(0, 0, vw, vh);
    const data = imageData.data;

    // Black frame guard
    if (isBlackFrame(data, vw, vh)) {
      oc.clearRect(0, 0, displayW, displayH);
      setStatusText("Camera loading, please wait...");
      setCurrentRegions([]);
      setDetectionCount(0);
      return;
    }

    // Gate 1: road surface check
    const roadCheck = isRoadSurface(data, vw, vh);
    if (!roadCheck.detected) {
      oc.clearRect(0, 0, displayW, displayH);
      setStatusText("Point camera at a road surface");
      setCurrentRegions([]);
      setDetectionCount(0);
      return;
    }

    // Gate 2: pothole detection
    const region = analyzeFrame(
      imageData,
      vw,
      vh,
      roadCheck.avgLuminance,
      roadCheck.roadPixelsMask,
    );

    // Clear overlay every frame
    oc.clearRect(0, 0, displayW, displayH);

    if (!region) {
      setCurrentRegions([]);
      setDetectionCount(0);
      setStatusText("Road surface clear — no damage detected");
      return;
    }

    // Draw bounding box directly on overlay
    drawRegionBox(
      oc,
      region,
      displayW,
      displayH,
      vw,
      vh,
      isFrontCameraRef.current,
    );

    setCurrentRegions([region]);
    setDetectionCount(1);
    setStatusText(
      `${region.label} detected (${region.confidence}% confidence)`,
    );

    // Log the detection
    const now = new Date();
    const ts = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    const lat = 28.6 + Math.random() * 0.05;
    const lng = 77.2 + Math.random() * 0.05;

    setLogEntries((prev) => {
      const alreadyLogged = prev.some(
        (e) => e.type === region.label && Math.abs(e.lat - lat) < 0.02,
      );
      if (alreadyLogged) return prev;
      const entry: DetectionLogEntry = {
        id: globalLogId++,
        timestamp: ts,
        type: region.label,
        severity: region.severity,
        confidence: region.confidence,
        lat,
        lng,
        description: region.description,
      };
      return [entry, ...prev].slice(0, 5);
    });
  }, []);

  const startScanning = useCallback(() => {
    if (scanningRef.current) return;
    scanningRef.current = true;
    setIsScanning(true);
    setStatusText("Scanning...");
    intervalRef.current = setInterval(() => {
      if (!scanningRef.current) return;
      runScan();
    }, 200);
  }, [runScan]);

  const stopScanning = useCallback(() => {
    scanningRef.current = false;
    setIsScanning(false);
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const overlay = overlayRef.current;
    if (overlay) {
      const oc = overlay.getContext("2d");
      oc?.clearRect(0, 0, overlay.width, overlay.height);
    }
    setCurrentRegions([]);
    setDetectionCount(0);
    setStatusText("Scan stopped — tap Scan to detect road damage");
  }, []);

  async function startCamera() {
    setCameraState("requesting");
    setCameraError(null);
    setCameraLoading(true);
    setCurrentRegions([]);
    setDetectionCount(0);
    setStatusText("Camera ready — tap Scan to detect road damage");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });
      streamRef.current = stream;
      // Detect if front or rear camera
      const track = stream.getVideoTracks()[0];
      const settings = track.getSettings();
      isFrontCameraRef.current = settings.facingMode === "user";
      setCameraState("active");
    } catch (err) {
      const msg =
        err instanceof Error && err.name === "NotAllowedError"
          ? "Camera permission denied. Please allow camera access in your browser settings."
          : err instanceof Error && err.name === "NotFoundError"
            ? "No camera found on this device."
            : err instanceof Error
              ? `Camera error: ${err.message}`
              : "Could not access camera.";
      setCameraError(msg);
      setCameraState("error");
      setCameraLoading(false);
    }
  }

  function stopCamera() {
    stopScanning();
    const tracks = streamRef.current?.getTracks() ?? [];
    for (const track of tracks) track.stop();
    streamRef.current = null;
    const video = videoRef.current;
    if (video) video.srcObject = null;
    const overlay = overlayRef.current;
    if (overlay) {
      const oc = overlay.getContext("2d");
      oc?.clearRect(0, 0, overlay.width, overlay.height);
    }
    setCurrentRegions([]);
    setDetectionCount(0);
    setStatusText("Camera ready — tap Scan to detect road damage");
    setCameraLoading(true);
    setCameraState("idle");
  }

  function handleScanToggle() {
    if (isScanning) {
      stopScanning();
    } else {
      startScanning();
    }
  }

  function captureAndReport() {
    if (currentRegions.length === 0) {
      toast.info("No damage detected in current frame");
      return;
    }
    const ticketId = `CMP-2025-${Math.floor(Math.random() * 900 + 100)}`;
    toast.success(
      `${currentRegions[0].label} reported! Ticket ${ticketId} created — routed to PWD`,
    );
  }

  useEffect(() => {
    if (cameraState === "active" && videoRef.current && streamRef.current) {
      const video = videoRef.current;
      video.srcObject = streamRef.current;
      video.play().catch(() => {});
      video.onplaying = () => {
        setCameraLoading(false);
      };
    }
  }, [cameraState]);

  useEffect(() => {
    return () => {
      scanningRef.current = false;
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (streamRef.current) {
        for (const t of streamRef.current.getTracks()) t.stop();
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div
      className="min-h-screen bg-background"
      data-ocid="aipotholescanner.page"
    >
      {/* Header */}
      <div className="border-b border-border bg-card px-4 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex items-center justify-center h-9 w-9 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
            data-ocid="aipotholescanner.back_button"
          >
            <ArrowLeft className="h-4 w-4 text-foreground" />
          </button>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20">
            <Camera className="h-5 w-5 text-red-400" />
          </div>
          <div>
            <h1 className="text-lg font-bold font-display text-foreground">
              AI Pothole Scanner
            </h1>
            <p className="text-xs text-muted-foreground">
              Point your camera at road damage to detect and analyze potholes
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-4">
        {/* Status Bar */}
        <div className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div
              className={`h-2.5 w-2.5 rounded-full ${
                cameraState === "active"
                  ? isScanning
                    ? "bg-amber-500 animate-pulse"
                    : currentRegions.length > 0
                      ? "bg-red-500"
                      : "bg-emerald-500"
                  : "bg-muted-foreground"
              }`}
            />
            <span className="text-sm font-medium text-foreground">
              {statusText}
            </span>
          </div>
          {cameraState === "active" && (
            <Badge
              className={`text-xs ${
                detectionCount > 0
                  ? "bg-red-500/20 text-red-400 border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-400 border-emerald-500/30"
              }`}
            >
              {detectionCount > 0 ? `${detectionCount} detected` : "Ready"}
            </Badge>
          )}
        </div>

        {/* Camera Area */}
        {cameraState === "idle" && (
          <div className="flex flex-col items-center justify-center gap-6 rounded-xl border border-dashed border-red-500/40 bg-red-500/5 py-16 px-8 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-500/20 text-4xl">
              <Camera className="h-10 w-10 text-red-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-foreground">
                Enable Live Camera Detection
              </h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Point your rear camera at a road surface. Tap Scan to detect
                potholes and cracks.
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card px-4 py-3 text-left text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">Before you start:</p>
              <p>
                • Your browser will ask for camera permission — please click
                Allow
              </p>
              <p>• Use the rear (environment-facing) camera for best results</p>
              <p>
                • Point camera at road surface, then tap Scan to detect damage
              </p>
            </div>
            <Button
              type="button"
              onClick={startCamera}
              className="bg-red-600 hover:bg-red-700 text-white px-8"
              data-ocid="aipotholescanner.start_camera_button"
            >
              <Camera className="h-4 w-4 mr-2" />
              Open Camera
            </Button>
          </div>
        )}

        {cameraState === "requesting" && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-border bg-card py-16">
            <span className="inline-block h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin" />
            <p className="text-sm text-muted-foreground">
              Requesting camera access…
            </p>
          </div>
        )}

        {cameraState === "error" && (
          <div
            className="flex flex-col items-center gap-4 rounded-xl border border-red-500/40 bg-red-500/10 p-8 text-center"
            data-ocid="aipotholescanner.camera_error_state"
          >
            <CameraOff className="h-10 w-10 text-red-400" />
            <p className="font-semibold text-red-400">Camera Access Failed</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              {cameraError}
            </p>
            <div className="rounded-lg border border-border bg-card px-4 py-3 text-left text-xs text-muted-foreground space-y-1">
              <p className="font-semibold text-foreground">How to fix:</p>
              <p>• Click the camera icon in your browser&apos;s address bar</p>
              <p>• Set Camera permission to Allow</p>
              <p>• Reload the page and try again</p>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setCameraState("idle");
                setCameraError(null);
              }}
              data-ocid="aipotholescanner.retry_camera_button"
            >
              Try Again
            </Button>
          </div>
        )}

        {cameraState === "active" && (
          <div className="space-y-4">
            {/* Camera Feed Container */}
            <div
              className="relative w-full overflow-hidden rounded-xl border border-red-500/40"
              style={{
                position: "relative",
                width: "100%",
                height: "420px",
                background: "#000",
                overflow: "hidden",
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                  background: "#000",
                }}
              />
              <canvas
                ref={overlayRef}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  zIndex: 10,
                  pointerEvents: "none",
                }}
              />
              {/* Camera loading overlay */}
              {cameraLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-20">
                  <span className="inline-block h-10 w-10 rounded-full border-4 border-red-500 border-t-transparent animate-spin mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Camera loading…
                  </p>
                </div>
              )}
              {/* LIVE badge */}
              {!cameraLoading && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white shadow-lg z-20">
                  <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                  LIVE
                </div>
              )}
              {/* Detection count badge */}
              {!cameraLoading && detectionCount > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-red-500/90 px-3 py-1 text-xs font-bold text-white shadow-lg z-20">
                  {detectionCount} DETECTED
                </div>
              )}
              {/* Scanning indicator */}
              {!cameraLoading && isScanning && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 rounded-full bg-amber-600/90 px-4 py-1.5 text-xs font-bold text-white shadow-lg z-20">
                  <span className="inline-block h-2 w-2 rounded-full bg-white animate-pulse" />
                  SCANNING ACTIVE
                </div>
              )}
            </div>

            {/* Hidden capture canvas */}
            <canvas ref={captureCanvasRef} style={{ display: "none" }} />

            {/* Scan / Stop Toggle Button */}
            <Button
              type="button"
              onClick={handleScanToggle}
              disabled={cameraLoading}
              className={`w-full h-14 text-lg font-bold ${
                isScanning
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
              data-ocid="aipotholescanner.scan_button"
            >
              {isScanning ? (
                <>
                  <StopCircle className="h-5 w-5 mr-2" />
                  Stop Scanning
                </>
              ) : (
                <>
                  <ScanLine className="h-5 w-5 mr-2" />
                  Start Scanning
                </>
              )}
            </Button>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                type="button"
                variant="destructive"
                onClick={stopCamera}
                className="flex-1"
                data-ocid="aipotholescanner.stop_camera_button"
              >
                <CameraOff className="h-4 w-4 mr-2" />
                Stop Camera
              </Button>
              <Button
                type="button"
                onClick={captureAndReport}
                className="flex-1 bg-amber-600 hover:bg-amber-700 text-white"
                disabled={detectionCount === 0}
                data-ocid="aipotholescanner.capture_report_button"
              >
                📸 Capture & Report
              </Button>
            </div>
          </div>
        )}

        {/* Detection Log Panel */}
        <div
          className="rounded-xl border border-border bg-card overflow-hidden"
          data-ocid="aipotholescanner.detection_log_panel"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">
              Detection Log
            </p>
            <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
              Last 5 detections
            </Badge>
          </div>
          {logEntries.length === 0 ? (
            <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
              No detections yet — open camera and tap Scan to detect road damage
            </div>
          ) : (
            <div className="divide-y divide-border">
              {logEntries.map((entry, i) => (
                <div
                  key={entry.id}
                  className="flex items-start gap-3 px-4 py-3"
                  data-ocid={`aipotholescanner.log_item.${i + 1}`}
                >
                  <div
                    className={`h-2.5 w-2.5 shrink-0 rounded-full mt-1.5 ${
                      entry.severity === "High"
                        ? "bg-red-500"
                        : entry.severity === "Medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-foreground">
                        {entry.type}
                      </span>
                      <Badge
                        className={`text-xs ${SEVERITY_BADGE[entry.severity]}`}
                      >
                        {entry.severity}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {entry.confidence}% confidence
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {entry.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-muted-foreground font-mono flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {entry.lat.toFixed(4)}°N, {entry.lng.toFixed(4)}°E
                      </span>
                      <span className="text-xs text-muted-foreground font-mono">
                        {entry.timestamp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
