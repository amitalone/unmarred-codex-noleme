import { ColorPalette, GlowConfiguration, GlowStyle } from "./types";

/**
 * Default color palette for combination highlighting
 */
export const DEFAULT_COLOR_PALETTE: ColorPalette = {
  primary: [
    "#ef4444", // red-500
    "#f97316", // orange-500
    "#eab308", // yellow-500
    "#22c55e", // green-500
    "#06b6d4", // cyan-500
    "#3b82f6", // blue-500
    "#8b5cf6", // violet-500
    "#ec4899", // pink-500
  ],
  secondary: [
    "#dc2626", // red-600
    "#ea580c", // orange-600
    "#ca8a04", // yellow-600
    "#16a34a", // green-600
    "#0891b2", // cyan-600
    "#2563eb", // blue-600
    "#7c3aed", // violet-600
    "#db2777", // pink-600
  ],
  accent: [
    "#fecaca", // red-200
    "#fed7aa", // orange-200
    "#fef3c7", // yellow-200
    "#bbf7d0", // green-200
    "#a7f3d0", // emerald-200
    "#bfdbfe", // blue-200
    "#ddd6fe", // violet-200
    "#fbcfe8", // pink-200
  ],
};

/**
 * Default glow configuration
 */
export const DEFAULT_GLOW_CONFIG: GlowConfiguration = {
  color: "#3b82f6",
  intensity: 0.7,
  animationDuration: 2000,
  enablePulse: true,
};

/**
 * Gets a color from the palette based on index
 */
export function getColorFromPalette(
  palette: ColorPalette,
  index: number,
  variant: keyof ColorPalette = "primary"
): string {
  const colors = palette[variant];
  return colors[index % colors.length] || colors[0] || DEFAULT_COLOR_PALETTE.primary[0];
}

/**
 * Generates a unique color for a combination based on its hash
 */
export function generateCombinationColor(
  combinationId: string,
  palette: ColorPalette = DEFAULT_COLOR_PALETTE
): string {
  // Simple hash function to get consistent colors
  let hash = 0;
  for (let i = 0; i < combinationId.length; i++) {
    const char = combinationId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  const index = Math.abs(hash);
  return getColorFromPalette(palette, index, "primary");
}

/**
 * Creates glow CSS styles based on configuration
 */
export function createGlowStyles(config: GlowConfiguration): GlowStyle {
  const { color, intensity, animationDuration, enablePulse } = config;
  
  // Calculate glow intensity
  const shadowBlur = Math.round(intensity * 20);
  const shadowSpread = Math.round(intensity * 4);
  
  // Create multiple shadow layers for better glow effect
  const glowShadows = [
    `0 0 ${shadowBlur}px ${shadowSpread}px ${color}40`, // Inner glow
    `0 0 ${shadowBlur * 1.5}px ${shadowSpread * 1.5}px ${color}20`, // Middle glow
    `0 0 ${shadowBlur * 2}px ${shadowSpread * 2}px ${color}10`, // Outer glow
  ];

  const style: GlowStyle = {
    boxShadow: glowShadows.join(", "),
    border: `2px solid ${color}60`,
  };

  // Add pulsing animation if enabled
  if (enablePulse) {
    style.animation = `combinationGlow ${animationDuration}ms ease-in-out infinite alternate`;
  }

  return style;
}

/**
 * Creates CSS keyframes for glow animation
 */
export function generateGlowKeyframes(): string {
  return `
    @keyframes combinationGlow {
      0% {
        filter: brightness(1) saturate(1);
        transform: scale(1);
      }
      100% {
        filter: brightness(1.1) saturate(1.2);
        transform: scale(1.02);
      }
    }
  `;
}

/**
 * Lightens a hex color by a percentage
 */
export function lightenColor(hex: string, percent: number): string {
  // Remove # if present
  const color = hex.replace("#", "");
  
  // Parse RGB values
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate lighter values
  const newR = Math.min(255, Math.round(r + (255 - r) * percent));
  const newG = Math.min(255, Math.round(g + (255 - g) * percent));
  const newB = Math.min(255, Math.round(b + (255 - b) * percent));
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

/**
 * Darkens a hex color by a percentage
 */
export function darkenColor(hex: string, percent: number): string {
  // Remove # if present
  const color = hex.replace("#", "");
  
  // Parse RGB values
  const r = parseInt(color.substr(0, 2), 16);
  const g = parseInt(color.substr(2, 2), 16);
  const b = parseInt(color.substr(4, 2), 16);
  
  // Calculate darker values
  const newR = Math.max(0, Math.round(r * (1 - percent)));
  const newG = Math.max(0, Math.round(g * (1 - percent)));
  const newB = Math.max(0, Math.round(b * (1 - percent)));
  
  // Convert back to hex
  return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}
