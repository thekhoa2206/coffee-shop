export interface PaletteColors {
  primary: {
    light: string;
    main: string;
    dark: string;
  };
  secondary: {
    main: string;
  };
}

export interface ThemeState {
  currentTheme: PaletteColors;
}
