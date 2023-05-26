export type Optional<T> = T | undefined | null;

export type NonEmptyArray<T> = [T, ...T[]];
export type DrawingTool = "DRAW" | "ERASE" | "LINE" | "SQUARE" | "NOOP";
