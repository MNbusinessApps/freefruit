// Steve Jobs Minimalist Theme - Free Fruit Sports Intelligence
export const theme = {
  colors: {
    // Core Colors (Steve Jobs Philosophy)
    primary: '#1CE5C8',        // Electric teal - main accent
    background: '#0B132B',      // Midnight navy - main background
    surface: '#1a2332',         // Darker navy for cards/surfaces
    text: '#F2F5FA',            // White text - high contrast
    textSecondary: '#8B9DC3',   // Muted teal for secondary text
    error: '#FF6B6B',           // Error states
    success: '#4ECDC4',         // Success states
    
    // Semantic Colors
    fruit: '#1CE5C8',           // Fruit Score color
    fruitHigh: '#00FFB3',       // High confidence
    fruitMedium: '#FFD93D',     // Medium confidence  
    fruitLow: '#FF8C42',        // Low confidence
    warning: '#FFD93D',
    info: '#6BCF7F',
    
    // Gradients
    gradient: {
      primary: ['#1CE5C8', '#0B132B'],
      surface: ['#1a2332', '#0B132B'],
      fruit: ['#1CE5C8', '#00FFB3']
    },
    
    // Shadows and Borders
    border: '#2A3A4A',
    shadow: 'rgba(28, 229, 200, 0.1)',
    divider: '#2A3A4A',
    
    // States
    disabled: '#4A5B6B',
    overlay: 'rgba(11, 19, 43, 0.8)',
  },
  
  typography: {
    // Font Families (System fonts for clean, professional look)
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    
    // Font Sizes
    fontSize: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
    },
    
    // Font Weights
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    '2xl': 48,
  },
  
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#1CE5C8',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#1CE5C8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#1CE5C8',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 5,
    },
  },
  
  // Animation timing
  animation: {
    fast: 150,
    normal: 300,
    slow: 500,
  },
  
  // Z-index layers
  zIndex: {
    modal: 1000,
    overlay: 100,
    dropdown: 10,
    header: 20,
  },
  
  // Component specific styles
  components: {
    button: {
      height: 48,
      borderRadius: 24,
      paddingHorizontal: 24,
    },
    
    card: {
      borderRadius: 12,
      padding: 16,
      backgroundColor: '#1a2332',
      shadowColor: '#1CE5C8',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    
    input: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 16,
      backgroundColor: '#1a2332',
      borderWidth: 1,
      borderColor: '#2A3A4A',
    },
    
    fruitScore: {
      high: { color: '#00FFB3', threshold: 80 },
      medium: { color: '#FFD93D', threshold: 65 },
      low: { color: '#FF8C42', threshold: 50 },
    },
  },
};

// Export individual theme sections for convenience
export const colors = theme.colors;
export const typography = theme.typography;
export const spacing = theme.spacing;
export const shadows = theme.shadows;