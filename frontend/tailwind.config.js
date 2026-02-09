/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                gaze: {
                    dark: '#0f172a',
                    darker: '#020617',
                    panel: '#1e293b',
                    accent: '#3b82f6',
                    text: '#e2e8f0',
                    muted: '#64748b'
                }
            }
        },
    },
    plugins: [],
}
