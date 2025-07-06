// Available Google Maps marker colors
const MARKER_COLORS = [
  'red',
  'blue', 
  'green',
  'yellow',
  'purple',
  'pink',
  'orange',
  'ltblue', // light blue
] as const

type MarkerColor = typeof MARKER_COLORS[number]

// Generate a consistent color for a user based on their ID
export function getBuddyColor(userId: string): MarkerColor {
  // Simple hash function to convert string to number
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  
  // Use absolute value and modulo to get consistent index
  const colorIndex = Math.abs(hash) % MARKER_COLORS.length
  return MARKER_COLORS[colorIndex]
}

export function getBuddyMarkerIcon(userId: string, size: number = 40) {
  const color = getBuddyColor(userId)
  return {
    url: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    scaledSize: new google.maps.Size(size, size),
  }
}

// Get a CSS color for UI elements (for consistency in search results, etc.)
export function getBuddyUIColor(userId: string): string {
  const color = getBuddyColor(userId)
  
  const colorMap: Record<MarkerColor, string> = {
    red: '#ef4444',
    blue: '#3b82f6', 
    green: '#22c55e',
    yellow: '#eab308',
    purple: '#a855f7',
    pink: '#ec4899',
    orange: '#f97316',
    ltblue: '#06b6d4',
  }
  
  return colorMap[color]
}
