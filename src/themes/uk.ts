import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

const Uk = definePreset(Aura, {
    primitive: {
        uk: {
            50: '#F0F4FF',
            100: '#D9E2FF',
            200: '#B8C7FB',
            300: '#93A6E4',
            400: '#6B81C3',
            500: '#4B60A1',
            600: '#354784',
            700: '#26386B',
            800: '#1D2E59',
            900: '#142042',
            950: '#0A1128',
        },
    },
    semantic: {
        primary: {
            50: '{uk.50}',
            100: '{uk.100}',
            200: '{uk.200}',
            300: '{uk.300}',
            400: '{uk.400}',
            500: '{uk.500}',
            600: '{uk.600}',
            700: '{uk.700}',
            800: '{uk.800}',
            900: '{uk.900}',
            950: '{uk.950}',
        },
        colorScheme: {
            light: {
                primary: {
                    color: '{uk.800}',
                    inverseColor: '#ffffff',
                    hoverColor: '{uk.900}',
                    activeColor: '{uk.950}',
                },
                highlight: {
                    background: '{uk.100}',
                    focusBackground: '{uk.200}',
                    color: '{uk.900}',
                    focusColor: '{uk.900}',
                },
            },
            dark: {
                primary: {
                    color: '{uk.100}',
                    inverseColor: '{uk.950}',
                    hoverColor: '{uk.200}',
                    activeColor: '{uk.300}',
                },
                highlight: {
                    background: 'rgba(184, 199, 251, 0.16)',
                    focusBackground: 'rgba(184, 199, 251, 0.24)',
                    color: '{uk.50}',
                    focusColor: '{uk.50}',
                },
            },
        },
    },
});

export default Uk;
