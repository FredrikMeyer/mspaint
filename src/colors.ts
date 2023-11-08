export interface Color {
  red: number;
  green: number;
  blue: number;
}

export class ColorFactory {
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
  BLACK: ColorFactory.fromRGB(0, 0, 0),
  WHITE: ColorFactory.fromRGB(255, 255, 255),
  LIGHT_GREY: ColorFactory.fromRGB(191, 191, 191),
  DARK_GREY: ColorFactory.fromRGB(128, 128, 128),
  RED: ColorFactory.fromRGB(233, 50, 35),
  DARK_RED: ColorFactory.fromRGB(117, 20, 12),
  YELLOW: ColorFactory.fromRGB(255, 253, 84),
  DARK_YELLOW: ColorFactory.fromRGB(128, 127, 38),
  NEON_GREEN: ColorFactory.fromRGB(117, 249, 76),
  DARK_NEON_GREEN: ColorFactory.fromRGB(55, 125, 34),
  TEAL: ColorFactory.fromRGB(115, 251, 253),
  DARK_TEAL: ColorFactory.fromRGB(54, 126, 127),
  BLUE: ColorFactory.fromRGB(0, 30, 245),
  DARK_BLUE: ColorFactory.fromRGB(0, 10, 123),
  MAGENTA: ColorFactory.fromRGB(234, 60, 247),
  DARK_MAGENTA: ColorFactory.fromRGB(117, 24, 124),
  PASTEL_YELLOW: ColorFactory.fromRGB(255, 255, 146),
  GOLD_FUSION: ColorFactory.fromRGB(128, 127, 73),
  LIGHT_MALACHITE_GREEN: ColorFactory.fromRGB(117, 250, 142),
  SACRAMENTO_STATE_GREEN: ColorFactory.fromRGB(0, 51, 51),
  WATERSPOUT: ColorFactory.fromRGB(160, 252, 253),
  BRILLIANT_AZURE: ColorFactory.fromRGB(51, 153, 255),
  MEDIUM_SLATE_BLUE: ColorFactory.fromRGB(121, 131, 247),
  DARK_CERULEAN: ColorFactory.fromRGB(22, 64, 124),
  CERISE_PINK: ColorFactory.fromRGB(234, 53, 127),
  PERSIAN_INDIGO: ColorFactory.fromRGB(57, 15, 123),
  ATOMIC_TANGERINE: ColorFactory.fromRGB(255, 153, 102),
  SEPIA: ColorFactory.fromRGB(120, 66, 21),
};
