/// import { Inter, Playfair_Display, Outfit } from 'next/font/google'

// FALLBACK: Using system fonts due to network build issues
// We mock the next/font/google return shape so the app doesn't break
const localFontMock = (variable: string) => ({
    variable,
    style: { fontFamily: 'system-ui, sans-serif' },
    className: variable, // This is a simplification but works for our className usage
})

export const inter = {
    variable: '--font-sans',
    style: { fontFamily: '"Inter", system-ui, sans-serif' },
}

export const playfair = {
    variable: '--font-serif',
    style: { fontFamily: '"Playfair Display", Georgia, serif' },
}

export const outfit = {
    variable: '--font-heading',
    style: { fontFamily: '"Outfit", system-ui, sans-serif' },
}
