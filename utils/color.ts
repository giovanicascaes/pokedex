function rgbToNumber(rgb: string) {
  return parseInt(rgb, 16)
}

function getRGB(rgb: string) {
  return rgbToNumber(rgb) / 255 <= 0.03928
    ? rgbToNumber(rgb) / 255 / 12.92
    : Math.pow((rgbToNumber(rgb) / 255 + 0.055) / 1.055, 2.4)
}

function getLuminance(hexColor: string) {
  return (
    0.2126 * getRGB(hexColor.slice(1, 3)) +
    0.7152 * getRGB(hexColor.slice(3, 5)) +
    0.0722 * getRGB(hexColor.slice(-2))
  )
}

function getContrast(background: string, foreground: string) {
  const foregroundLuminance = getLuminance(background)
  const backgroundLuminance = getLuminance(foreground)
  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  )
}

export type ForegroundType = "dark" | "light"

export function getForegroundStyleForColor(
  backgroundHexColor: string
): ForegroundType {
  const whiteContrast = getContrast(backgroundHexColor, "#ffffff")
  const blackContrast = getContrast(backgroundHexColor, "#000000")

  return whiteContrast > blackContrast ? "light" : "dark"
}
