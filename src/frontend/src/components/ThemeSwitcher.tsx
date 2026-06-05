import { cn } from "@/lib/utils";
import { Check, ChevronDown, Palette } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export type ThemePreset =
  | "deep-navy"
  | "midnight-black"
  | "slate-gray"
  | "dark-forest"
  | "light";

interface ThemeOption {
  id: ThemePreset;
  label: string;
  swatch: string;
  vars: Record<string, string>;
  htmlClass: string;
  colorScheme: "dark" | "light";
}

export const THEME_PRESETS: ThemeOption[] = [
  {
    id: "deep-navy",
    label: "Deep Navy",
    swatch: "oklch(0.08 0.018 255)",
    htmlClass: "dark theme-deep-navy",
    colorScheme: "dark",
    vars: {
      "--background": "0.08 0.018 255",
      "--card": "0.11 0.022 255",
      "--popover": "0.11 0.022 255",
      "--muted": "0.15 0.03 255",
      "--secondary": "0.18 0.04 255",
      "--border": "0.22 0.04 255",
      "--input": "0.17 0.035 255",
      "--sidebar": "0.06 0.018 255",
      "--sidebar-accent": "0.13 0.028 255",
      "--sidebar-border": "0.19 0.035 255",
    },
  },
  {
    id: "midnight-black",
    label: "Midnight Black",
    swatch: "oklch(0.04 0.008 240)",
    htmlClass: "dark theme-midnight",
    colorScheme: "dark",
    vars: {
      "--background": "0.04 0.008 240",
      "--card": "0.07 0.012 240",
      "--popover": "0.07 0.012 240",
      "--muted": "0.10 0.018 240",
      "--secondary": "0.13 0.025 240",
      "--border": "0.17 0.025 240",
      "--input": "0.12 0.020 240",
      "--sidebar": "0.02 0.005 240",
      "--sidebar-accent": "0.09 0.016 240",
      "--sidebar-border": "0.14 0.022 240",
    },
  },
  {
    id: "slate-gray",
    label: "Slate Gray",
    swatch: "oklch(0.14 0.008 220)",
    htmlClass: "dark theme-slate",
    colorScheme: "dark",
    vars: {
      "--background": "0.14 0.008 220",
      "--card": "0.17 0.010 220",
      "--popover": "0.17 0.010 220",
      "--muted": "0.21 0.012 220",
      "--secondary": "0.24 0.015 220",
      "--border": "0.28 0.015 220",
      "--input": "0.22 0.012 220",
      "--sidebar": "0.10 0.006 220",
      "--sidebar-accent": "0.19 0.010 220",
      "--sidebar-border": "0.24 0.012 220",
    },
  },
  {
    id: "dark-forest",
    label: "Dark Forest",
    swatch: "oklch(0.08 0.022 150)",
    htmlClass: "dark theme-forest",
    colorScheme: "dark",
    vars: {
      "--background": "0.08 0.022 150",
      "--card": "0.11 0.026 150",
      "--popover": "0.11 0.026 150",
      "--muted": "0.15 0.030 150",
      "--secondary": "0.18 0.035 150",
      "--border": "0.22 0.038 150",
      "--input": "0.16 0.032 150",
      "--sidebar": "0.06 0.018 150",
      "--sidebar-accent": "0.13 0.028 150",
      "--sidebar-border": "0.19 0.035 150",
    },
  },
  {
    id: "light",
    label: "Light Mode",
    swatch: "oklch(0.98 0.004 240)",
    htmlClass: "light",
    colorScheme: "light",
    vars: {
      "--background": "0.98 0.004 240",
      "--card": "1 0 0",
      "--popover": "1 0 0",
      "--muted": "0.96 0.008 240",
      "--secondary": "0.94 0.02 240",
      "--border": "0.88 0.01 240",
      "--input": "0.94 0.01 240",
      "--primary": "0.55 0.26 265",
      "--sidebar": "0.96 0.008 240",
      "--sidebar-accent": "0.92 0.012 240",
      "--sidebar-border": "0.85 0.012 240",
      "--foreground": "0.1 0.02 255",
      "--card-foreground": "0.1 0.02 255",
      "--muted-foreground": "0.48 0.02 240",
    },
  },
];

export const THEME_STORAGE_KEY = "foundrly-theme";

export function applyTheme(preset: ThemeOption) {
  const html = document.documentElement;
  // Remove all existing theme classes
  html.className = html.className
    .split(" ")
    .filter(
      (c) =>
        ![
          "dark",
          "light",
          "theme-deep-navy",
          "theme-midnight",
          "theme-slate",
          "theme-forest",
        ].includes(c),
    )
    .join(" ");
  // Add new classes
  for (const cls of preset.htmlClass.split(" ")) {
    if (cls) html.classList.add(cls);
  }
  // Apply CSS vars
  for (const [key, val] of Object.entries(preset.vars)) {
    html.style.setProperty(key, val);
  }
  // If not light, clear any light-specific overrides back to dark defaults
  if (preset.id !== "light") {
    const darkDefaults: Record<string, string> = {
      "--foreground": "0.97 0.005 240",
      "--card-foreground": "0.97 0.005 240",
      "--muted-foreground": "0.62 0.018 240",
      "--primary": "0.62 0.26 265",
    };
    for (const [key, val] of Object.entries(darkDefaults)) {
      html.style.setProperty(key, val);
    }
  }
  html.style.setProperty("color-scheme", preset.colorScheme);
  localStorage.setItem(THEME_STORAGE_KEY, preset.id);
}

export function initTheme() {
  const stored = localStorage.getItem(THEME_STORAGE_KEY) as ThemePreset | null;
  const preset =
    THEME_PRESETS.find((p) => p.id === (stored ?? "deep-navy")) ??
    THEME_PRESETS[0];
  applyTheme(preset);
  return preset.id;
}

export function ThemeSwitcher() {
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState<ThemePreset>("deep-navy");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(
      THEME_STORAGE_KEY,
    ) as ThemePreset | null;
    const preset =
      THEME_PRESETS.find((p) => p.id === (stored ?? "deep-navy")) ??
      THEME_PRESETS[0];
    setActiveId(preset.id);
    applyTheme(preset);
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (preset: ThemeOption) => {
    applyTheme(preset);
    setActiveId(preset.id);
    setOpen(false);
  };

  const activePreset =
    THEME_PRESETS.find((p) => p.id === activeId) ?? THEME_PRESETS[0];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="h-9 flex items-center gap-1.5 px-2.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-all duration-200"
        aria-label="Change theme"
        data-ocid="header.theme_switcher"
      >
        <div
          className="h-4 w-4 rounded-full border-2 border-border flex-shrink-0"
          style={{ background: activePreset.swatch }}
        />
        <Palette className="h-3.5 w-3.5" />
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border shadow-xl z-50 overflow-hidden"
            style={{ background: "oklch(var(--card))" }}
            data-ocid="header.theme_panel"
          >
            <div className="p-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 pb-1.5">
                Theme
              </p>
              {THEME_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelect(preset)}
                  className={cn(
                    "w-full flex items-center gap-3 px-2.5 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                    activeId === preset.id
                      ? "bg-primary/15 text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                  )}
                  data-ocid={`header.theme_option.${preset.id}`}
                >
                  <div
                    className="h-5 w-5 rounded-lg border border-border/60 flex-shrink-0 shadow-sm"
                    style={{ background: preset.swatch }}
                  />
                  <span className="flex-1 text-left">{preset.label}</span>
                  {activeId === preset.id && (
                    <Check className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
