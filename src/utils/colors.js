export function cssVar(name, el = document.querySelector('.app-diskmap')) {
    return getComputedStyle(el).getPropertyValue(name).trim() || '#cccccc'
}

const LIGHTNESS_PER_STEP = 9.4

export function hexToHsl(hex) {
    let v = hex.replace(/^#/, '')
    if (v.length === 3) v = [...v].map((c) => c + c).join('')
    const n = parseInt(v, 16)
    const r = ((n >> 16) & 255) / 255
    const g = ((n >> 8) & 255) / 255
    const b = (n & 255) / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const d = max - min
    const l = (max + min) / 2

    let h = 0, s = 0
    if (d !== 0) {
        s = d / (1 - Math.abs(2 * l - 1))
        if (max === r) h = ((g - b) / d) % 6
        else if (max === g) h = (b - r) / d + 2
        else h = (r - g) / d + 4
        h = Math.round(h * 60)
        if (h < 0) h += 360
    }
    return { h, s: s * 100, l: l * 100 }
}

export function hslToHex(h, s, l) {
    h = ((h % 360) + 360) % 360
    s /= 100; l /= 100
    const c = (1 - Math.abs(2 * l - 1)) * s
    const x = c * (1 - Math.abs((h / 60) % 2 - 1))
    const m = l - c / 2

    let r = 0, g = 0, b = 0
    if (h < 60) { r = c; g = x; b = 0 }
    else if (h < 120) { r = x; g = c; b = 0 }
    else if (h < 180) { r = 0; g = c; b = x }
    else if (h < 240) { r = 0; g = x; b = c }
    else if (h < 300) { r = x; g = 0; b = c }
    else { r = c; g = 0; b = x }

    const toHex = (v) => Math.round((v + m) * 255).toString(16).padStart(2, '0')
    return '#' + toHex(r) + toHex(g) + toHex(b)
}

// Change the shade of a color, with step in positive to make it lighter, negative to make it darker
export function shade(hex, step) {
    const { h, s, l } = hexToHsl(hex)
    const next = Math.min(100, Math.max(0, l + step * LIGHTNESS_PER_STEP))
    return hslToHex(h, s, next)
}

/** Input a hex, a n, and a mode and it outputs a palette of shades of n elements around hex
 *  mode can be 'lighter' to do base -> lighter colors ; 'darker' to do base -> darker colors ; and 'both' do do darker -> base -> lighter
 */
export function palette(hex, n, mode = 'both') {
    const offset = { lighter: 0, darker: -(n - 1), both: -(n - 1) / 2 }[mode]
        ?? -(n - 1) / 2
    return Array.from({ length: n }, (_, i) => shade(hex, offset + i))
}