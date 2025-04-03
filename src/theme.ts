import { createTheme } from '@mui/material/styles';

const colors = {
  primary: {
    main: '#00A3B5',  // Teal color from the design
    light: '#00B5B5',
    dark: '#008B95',
  },
  secondary: {
    main: '#FF0242',  // Pink color from the design
    light: '#FF3366',
    dark: '#CC0033',
  },
  accent: '#E69712',  // Golden color from the design
  background: {
    default: '#0A1929',  // Dark background from the design
    paper: '#132F4C',
  },
  text: {
    primary: '#FFFFFF',
    secondary: 'rgba(255, 255, 255, 0.7)',
  },
};

const theme = createTheme({
  palette: {
    mode: 'dark',
    ...colors,
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
    h1: {
      fontSize: '68px',
      fontWeight: 900,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    h2: {
      fontWeight: 800,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    h3: {
      fontWeight: 800,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    h4: {
      fontWeight: 800,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    h5: {
      fontSize: '24px',
      fontWeight: 800,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    h6: {
      fontWeight: 800,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
    subtitle1: {
      fontSize: '18px',
      fontWeight: 700,
      letterSpacing: '0.02em',
    },
    body1: {
      fontSize: '16px',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    body2: {
      fontSize: '14px',
      fontWeight: 500,
      letterSpacing: '0.02em',
    },
    button: {
      fontWeight: 700,
      letterSpacing: '0.02em',
      textTransform: 'uppercase',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 16px',
          fontWeight: 700,
          letterSpacing: '0.02em',
        },
        contained: {
          background: 'linear-gradient(45deg, #00A3B5 30%, #00B5B5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #008B95 30%, #00A3B5 90%)',
          },
        },
        outlined: {
          borderColor: '#00A3B5',
          color: '#00A3B5',
          '&:hover': {
            borderColor: '#00B5B5',
            color: '#00B5B5',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          background: 'linear-gradient(145deg, #132F4C 0%, #0A1929 100%)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            fontWeight: 500,
            letterSpacing: '0.02em',
            '& fieldset': {
              borderColor: 'rgba(0, 163, 181, 0.3)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 163, 181, 0.5)',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00A3B5',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          letterSpacing: '0.02em',
        },
      },
    },
  },
});

export default theme; 