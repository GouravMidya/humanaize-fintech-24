// src/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

export const ColorModeContext = createContext({ toggleColorMode: () => {} });

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState('light');
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                // Light mode
                primary: {
                  main: '#1976d2',
                },
                secondary:{
                    main:'#000000'
                },
                background: {
                  default: '#ffffff',
                  paper: '#f5f5f5',
                  input: '#ffffff',
                  box:'#ffffff',
                  container:'#ffffff'
                },
                text: {
                  primary: '#000000',
                  secondary: '#424242',
                },
                Box:{
                    primary:'#1976d2',
                    secondary:'1976d2'
                }
              }
            : {
                // Dark mode
                primary: {
                  main: '#90caf9',
                },
                secondary:{
                    main:'#000000'
                },
                background: {
                  default: '#000000',
                  paper: '#1c1c1c',
                  input: '#333333',
                  box:'#000000',
                  container:'#000000'
                  
                },
                text: {
                  primary: '#ffffff',
                  secondary: '#b0bec5',
                },
                Box:{
                    primary:'#ffffff',
                    secondary:'#ffffff'
                }
              }),
        },
        components: {
          MuiTextField: {
            styleOverrides: {
              root: ({ theme }) => ({
                '& .MuiOutlinedInput-root': {
                  backgroundColor: theme.palette.background.input,
                  '& fieldset': {
                    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                  },
                  '&:hover fieldset': {
                    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: theme.palette.primary.main,
                  },
                },
                '& .MuiInputBase-input': {
                  color: theme.palette.text.primary,
                },
                '& .MuiInputLabel-root': {
                  color: theme.palette.text.secondary,
                },
              }),
            },
          },
        },
      }),
    [mode],
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};