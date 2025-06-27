import {
  getColorFromPalette,
  generateCombinationColor,
  createGlowStyles,
  generateGlowKeyframes,
  lightenColor,
  darkenColor,
  DEFAULT_COLOR_PALETTE,
  DEFAULT_GLOW_CONFIG,
} from './colorUtils';

describe('colorUtils', () => {
  describe('getColorFromPalette', () => {
    test('returns color from primary palette', () => {
      const color = getColorFromPalette(DEFAULT_COLOR_PALETTE, 0);
      expect(color).toBe(DEFAULT_COLOR_PALETTE.primary[0]);
    });

    test('wraps around palette length', () => {
      const paletteLength = DEFAULT_COLOR_PALETTE.primary.length;
      const color = getColorFromPalette(DEFAULT_COLOR_PALETTE, paletteLength + 1);
      expect(color).toBe(DEFAULT_COLOR_PALETTE.primary[1]);
    });

    test('returns color from secondary palette', () => {
      const color = getColorFromPalette(DEFAULT_COLOR_PALETTE, 0, 'secondary');
      expect(color).toBe(DEFAULT_COLOR_PALETTE.secondary[0]);
    });

    test('handles empty palette gracefully', () => {
      const emptyPalette = { primary: [], secondary: [], accent: [] };
      const color = getColorFromPalette(emptyPalette, 0);
      expect(color).toBe(DEFAULT_COLOR_PALETTE.primary[0]);
    });
  });

  describe('generateCombinationColor', () => {
    test('generates consistent color for same ID', () => {
      const id = 'face_123.jpg--model_456.png';
      const color1 = generateCombinationColor(id);
      const color2 = generateCombinationColor(id);
      expect(color1).toBe(color2);
    });

    test('generates different colors for different IDs', () => {
      const id1 = 'face_123.jpg--model_456.png';
      const id2 = 'face_789.jpg--model_123.png';
      const color1 = generateCombinationColor(id1);
      const color2 = generateCombinationColor(id2);
      expect(color1).not.toBe(color2);
    });

    test('returns valid hex color', () => {
      const color = generateCombinationColor('test_id');
      expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });

  describe('createGlowStyles', () => {
    test('creates glow styles with default config', () => {
      const styles = createGlowStyles(DEFAULT_GLOW_CONFIG);
      
      expect(styles.boxShadow).toBeDefined();
      expect(styles.border).toBeDefined();
      expect(styles.animation).toBeDefined();
    });

    test('creates styles without animation when disabled', () => {
      const config = { ...DEFAULT_GLOW_CONFIG, enablePulse: false };
      const styles = createGlowStyles(config);
      
      expect(styles.boxShadow).toBeDefined();
      expect(styles.border).toBeDefined();
      expect(styles.animation).toBeUndefined();
    });

    test('adjusts shadow intensity', () => {
      const lowIntensity = createGlowStyles({ ...DEFAULT_GLOW_CONFIG, intensity: 0.1 });
      const highIntensity = createGlowStyles({ ...DEFAULT_GLOW_CONFIG, intensity: 1.0 });
      
      expect(lowIntensity.boxShadow).toBeDefined();
      expect(highIntensity.boxShadow).toBeDefined();
      expect(lowIntensity.boxShadow).not.toBe(highIntensity.boxShadow);
    });

    test('uses custom color', () => {
      const customColor = '#ff0000';
      const styles = createGlowStyles({ ...DEFAULT_GLOW_CONFIG, color: customColor });
      
      expect(styles.boxShadow).toContain('#ff0000');
      expect(styles.border).toContain('#ff0000');
    });
  });

  describe('generateGlowKeyframes', () => {
    test('generates CSS keyframes string', () => {
      const keyframes = generateGlowKeyframes();
      
      expect(keyframes).toContain('@keyframes combinationGlow');
      expect(keyframes).toContain('0%');
      expect(keyframes).toContain('100%');
      expect(keyframes).toContain('brightness');
      expect(keyframes).toContain('saturate');
      expect(keyframes).toContain('scale');
    });
  });

  describe('lightenColor', () => {
    test('lightens hex color', () => {
      const originalColor = '#000000';
      const lightenedColor = lightenColor(originalColor, 0.5);
      
      expect(lightenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(lightenedColor).not.toBe(originalColor);
    });

    test('handles color without hash', () => {
      const lightenedColor = lightenColor('000000', 0.5);
      expect(lightenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('maintains hex format', () => {
      const lightenedColor = lightenColor('#123456', 0.2);
      expect(lightenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(lightenedColor.length).toBe(7);
    });
  });

  describe('darkenColor', () => {
    test('darkens hex color', () => {
      const originalColor = '#ffffff';
      const darkenedColor = darkenColor(originalColor, 0.5);
      
      expect(darkenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(darkenedColor).not.toBe(originalColor);
    });

    test('handles color without hash', () => {
      const darkenedColor = darkenColor('ffffff', 0.5);
      expect(darkenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test('maintains hex format', () => {
      const darkenedColor = darkenColor('#abcdef', 0.3);
      expect(darkenedColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(darkenedColor.length).toBe(7);
    });

    test('does not go below zero', () => {
      const darkenedColor = darkenColor('#111111', 1.0);
      expect(darkenedColor).toBe('#000000');
    });
  });

  describe('DEFAULT_COLOR_PALETTE', () => {
    test('has all required color arrays', () => {
      expect(DEFAULT_COLOR_PALETTE.primary).toBeDefined();
      expect(DEFAULT_COLOR_PALETTE.secondary).toBeDefined();
      expect(DEFAULT_COLOR_PALETTE.accent).toBeDefined();
      
      expect(Array.isArray(DEFAULT_COLOR_PALETTE.primary)).toBe(true);
      expect(Array.isArray(DEFAULT_COLOR_PALETTE.secondary)).toBe(true);
      expect(Array.isArray(DEFAULT_COLOR_PALETTE.accent)).toBe(true);
    });

    test('has valid hex colors', () => {
      const allColors = [
        ...DEFAULT_COLOR_PALETTE.primary,
        ...DEFAULT_COLOR_PALETTE.secondary,
        ...DEFAULT_COLOR_PALETTE.accent,
      ];

      allColors.forEach(color => {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    test('has same length arrays', () => {
      const primaryLength = DEFAULT_COLOR_PALETTE.primary.length;
      expect(DEFAULT_COLOR_PALETTE.secondary.length).toBe(primaryLength);
      expect(DEFAULT_COLOR_PALETTE.accent.length).toBe(primaryLength);
    });
  });

  describe('DEFAULT_GLOW_CONFIG', () => {
    test('has valid configuration', () => {
      expect(DEFAULT_GLOW_CONFIG.color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(DEFAULT_GLOW_CONFIG.intensity).toBeGreaterThan(0);
      expect(DEFAULT_GLOW_CONFIG.intensity).toBeLessThanOrEqual(1);
      expect(DEFAULT_GLOW_CONFIG.animationDuration).toBeGreaterThan(0);
      expect(typeof DEFAULT_GLOW_CONFIG.enablePulse).toBe('boolean');
    });
  });
});
