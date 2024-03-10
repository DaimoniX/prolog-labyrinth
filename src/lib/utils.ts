export function createZeroMatrix(width: number, height: number): number[][] {
	return createMatrix(width, height, () => 0);
}

type FillRule<T> = (x: number, y: number) => T;

export function createMatrix<T>(width: number, height: number, fillRule: FillRule<T>): T[][] {
	return new Array(height)
		.fill(0)
		.map((_, y) => new Array(width).fill(0).map((_, x) => fillRule(x, y)));
}
