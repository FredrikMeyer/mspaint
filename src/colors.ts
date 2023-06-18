export interface Color {
  red: number;
  green: number;
  blue: number;
}

export class Color {
  static fromRGB(red: number, green: number, blue: number): Color {
    return { red, green, blue };
  }

  static toRGBString(color: Color): string {
    const { red, green, blue } = color;
    return `rgb(${red},${green},${blue})`;
  }

  static to32BitRepresentation(color: Color): number {
    const { red, green, blue } = color;

    return (
      (255 << 24) | // alpha
      (blue << 16) | // blue
      (green << 8) | // green
      red
    ); // red
  }
}

export const COLORS = {
  BLACK: Color.fromRGB(0, 0, 0),
  WHITE: Color.fromRGB(255, 255, 255),
  LIGHT_GREY: Color.fromRGB(191, 191, 191),
  DARK_GREY: Color.fromRGB(128, 128, 128),
  RED: Color.fromRGB(233, 50, 35),
  DARK_RED: Color.fromRGB(117, 20, 12),
  YELLOW: Color.fromRGB(255, 253, 84),
  DARK_YELLOW: Color.fromRGB(128, 127, 38),
  NEON_GREEN: Color.fromRGB(117, 249, 76),
  DARK_NEON_GREEN: Color.fromRGB(55, 125, 34),
  TEAL: Color.fromRGB(115, 251, 253),
  DARK_TEAL: Color.fromRGB(54, 126, 127),
  BLUE: Color.fromRGB(0, 30, 245),
  DARK_BLUE: Color.fromRGB(0, 10, 123),
  MAGENTA: Color.fromRGB(234, 60, 247),
  DARK_MAGENTA: Color.fromRGB(117, 24, 124),
  PASTEL_YELLOW: Color.fromRGB(255, 255, 146),
  GOLD_FUSION: Color.fromRGB(128, 127, 73),
  LIGHT_MALACHITE_GREEN: Color.fromRGB(117, 250, 142),
  SACRAMENTO_STATE_GREEN: Color.fromRGB(0, 51, 51),
  WATERSPOUT: Color.fromRGB(160, 252, 253),
  BRILLIANT_AZURE: Color.fromRGB(51, 153, 255),
  MEDIUM_SLATE_BLUE: Color.fromRGB(121, 131, 247),
  DARK_CERULEAN: Color.fromRGB(22, 64, 124),
  CERISE_PINK: Color.fromRGB(234, 53, 127),
  PERSIAN_INDIGO: Color.fromRGB(57, 15, 123),
  ATOMIC_TANGERINE: Color.fromRGB(255, 153, 102),
  SEPIA: Color.fromRGB(120, 66, 21),
};
