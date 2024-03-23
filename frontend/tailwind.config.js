/** @type {import('tailwindcss').Config} */
defaultTheme = require('tailwindcss/defaultTheme');
module.exports = {
    content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['"Montserrat"', ...defaultTheme.fontFamily.sans]
            },
            colors: {
                'southLanPurple': '#882DA8',
                'southLanGreen': '#CFFF06',
                ...defaultTheme.colors
            },
        }
    },
    plugins: [],
}

