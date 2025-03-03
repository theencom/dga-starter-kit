/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/**/*.antlers.html',
        './resources/**/*.antlers.php',
        './resources/**/*.blade.php',
        './resources/**/*.vue',
        './content/**/*.md',
    ],

    darkMode: 'class',

    theme: {
        extend: {
            'fontFamily': {
                sans: ['IBM Plex Sans Arabic', 'sans-serif'],
            },
            screens: {},
            colors: {
                primaryGreen: {
                    25: '#f7fdf9',
                    50: '#f3fcf6',
                    100: '#dff6e7',
                    200: '#b8eacb',
                    300: '#88d8ad',
                    400: '#54c08a',
                    500: '#25935f',
                    600: '#1b8354',
                    700: '#166a45',
                    800: '#14573a',
                    900: '#104631',
                    950: '#092a1e'
                },
                primaryYellow: '#dba102',
                darkBg: '#282828',
                darkBgLight: '#8b8b8b',
                darkText: '#E5E5E5',

                lavender: {
                    25: '#FEFCFF',
                    50: '#F9F5FA',
                    100: '#F2E9F5',
                    200: '#E1CCE8',
                    300: '#CCADD9',
                    400: '#A57BBA',
                    500: '#80519F',
                    600: '#6D428F',
                    700: '#532D75',
                    800: '#3D1D5E',
                    900: '#281047',
                    950: '#16072E',
                },
                gold: {
                    25: '#FFFEF7',
                    50: '#FFFEF2',
                    100: '#FFFCE6',
                    200: '#FCF3BD',
                    300: '#FAE996',
                    400: '#F7D54D',
                    500: '#F5BD02',
                    600: '#DBA102',
                    700: '#B87B02',
                    800: '#945C01',
                    900: '#6E3C00',
                    950: '#472400',
                },
                gray: {
                    25: '#FCFCFD',
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D2D6DB',
                    400: '#9DA4AE',
                    500: '#6C737F',
                    600: '#4D5761',
                    700: '#384250',
                    800: '#1F2A37',
                    900: '#111927',
                    950: '#0D121C',
                },
            },

        },

        darkMode: 'media',

    },

    plugins: [
        require('@tailwindcss/typography'),
        require('tailwindcss-debug-screens'),
    ],


};

